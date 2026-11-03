using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using HabiTech.Api.Auth;
using HabiTech.Api.Data;
using HabiTech.Api.Health;
using HabiTech.Api.Sync;
using System.Security.Cryptography;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("AzureSql");
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "HabiTech.Api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "HabiTech.Web";
var configuredSigningKey = builder.Configuration["Jwt:SigningKey"];
var demoAccounts = builder.Configuration.GetSection("DemoAccounts").Get<DemoAccount[]>() ?? [];

if (builder.Environment.IsProduction()
    && (string.IsNullOrWhiteSpace(configuredSigningKey) || configuredSigningKey.Length < 32))
{
    throw new InvalidOperationException("Configure Jwt:SigningKey com no mínimo 32 caracteres no ambiente de produção.");
}

if (builder.Environment.IsProduction() && demoAccounts.Length == 0)
{
    throw new InvalidOperationException("Configure pelo menos uma conta demonstrativa no ambiente de produção.");
}

var signingKey = configuredSigningKey is { Length: >= 32 }
    ? configuredSigningKey
    : Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey));

builder.Services
    .AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = securityKey,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(30),
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddSingleton(new DemoTokenIssuer(securityKey, jwtIssuer, jwtAudience));
builder.Services.AddSingleton<IReadOnlyList<DemoAccount>>(demoAccounts);
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 120,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                AutoReplenishment = true,
            }));
    options.AddPolicy("demo-login", context =>
    {
        var email = context.Request.Headers["X-Login-Email"].ToString().Trim().ToUpperInvariant();
        var clientIp = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        return RateLimitPartition.GetFixedWindowLimiter(
            $"{clientIp}:{(string.IsNullOrEmpty(email) ? "invalid-login" : email)}",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                AutoReplenishment = true,
            });
    });
});

builder.Services.AddDbContext<HabiTechDbContext>(options =>
{
    if (!string.IsNullOrWhiteSpace(connectionString))
    {
        options.UseSqlServer(connectionString);
    }
});

builder.Services
    .AddHealthChecks()
    .AddCheck("live", () => Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Healthy())
    .AddCheck<AzureSqlHealthCheck>("azure-sql", tags: ["ready"]);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
        }
    });
});

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/api/auth/login", (HttpContext context, LoginRequest request, IReadOnlyList<DemoAccount> accounts, DemoTokenIssuer tokenIssuer) =>
{
    context.Response.Headers.CacheControl = "no-store";

    if (string.IsNullOrWhiteSpace(request.Email)
        || request.Email.Length > 254
        || string.IsNullOrEmpty(request.Password)
        || request.Password.Length > 200)
    {
        return Results.BadRequest(new { message = "Informe um e-mail e uma senha válidos." });
    }

    var email = request.Email.Trim();
    var account = accounts.FirstOrDefault(candidate =>
        string.Equals(candidate.Email, email, StringComparison.OrdinalIgnoreCase));
    var expectedPassword = account?.Password ?? "invalid-demo-password";
    var expectedHash = SHA256.HashData(Encoding.UTF8.GetBytes(expectedPassword));
    var suppliedHash = SHA256.HashData(Encoding.UTF8.GetBytes(request.Password));
    var passwordMatches = CryptographicOperations.FixedTimeEquals(expectedHash, suppliedHash);

    if (account is null || !passwordMatches)
    {
        return Results.Json(new { message = "E-mail ou senha inválidos." }, statusCode: StatusCodes.Status401Unauthorized);
    }

    return Results.Ok(tokenIssuer.CreateToken(account.Email));
})
    .RequireRateLimiting("demo-login")
    .WithName("DemoLogin");

app.MapGet("/api/v1/session", (System.Security.Claims.ClaimsPrincipal user) =>
    Results.Ok(new { email = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value }))
    .RequireAuthorization();

app.MapPost("/api/v1/sync/records", async (
    HttpContext context,
    SyncBatchRequest request,
    HabiTechDbContext dbContext,
    CancellationToken cancellationToken) =>
{
    const int maximumBatchSize = 25;
    const int maximumValuesJsonLength = 512 * 1024;
    var supportedInstruments = new HashSet<string>(StringComparer.Ordinal)
    {
        "residencial",
        "nao-residencial",
        "ocupacao-predial",
    };
    var supportedStatuses = new HashSet<string>(StringComparer.Ordinal)
    {
        "Rascunho",
        "Concluído",
    };

    if (request.Records is null || request.Records.Count is 0 or > maximumBatchSize)
    {
        return Results.BadRequest(new { message = $"Envie de 1 a {maximumBatchSize} registros por lote." });
    }

    if (request.Records.Select(record => record.Id).Distinct(StringComparer.Ordinal).Count() != request.Records.Count)
    {
        return Results.BadRequest(new { message = "O lote não pode conter IDs repetidos." });
    }

    foreach (var record in request.Records)
    {
        if (string.IsNullOrWhiteSpace(record.Id)
            || record.Id.Length > 80
            || !supportedInstruments.Contains(record.Instrument)
            || !supportedStatuses.Contains(record.Status)
            || record.Values.ValueKind != System.Text.Json.JsonValueKind.Object
            || record.Values.GetRawText().Length > maximumValuesJsonLength
            || record.CreatedAt == default
            || record.UpdatedAt == default)
        {
            return Results.BadRequest(new { message = "Um ou mais registros têm campos inválidos." });
        }
    }

    var userEmail = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrWhiteSpace(userEmail))
    {
        return Results.Unauthorized();
    }

    await using var transaction = await dbContext.Database.BeginTransactionAsync(
        System.Data.IsolationLevel.Serializable,
        cancellationToken);

    var responseRecords = new List<SyncRecordResponse>(request.Records.Count);
    var now = DateTimeOffset.UtcNow;

    foreach (var incoming in request.Records)
    {
        var clientUpdatedAt = incoming.UpdatedAt.ToUniversalTime();
        var existing = await dbContext.SyncedInstrumentRecords.SingleOrDefaultAsync(
            record => record.UserEmail == userEmail && record.RecordId == incoming.Id,
            cancellationToken);

        if (existing is not null && clientUpdatedAt < existing.ClientUpdatedAtUtc)
        {
            responseRecords.Add(new SyncRecordResponse(existing.RecordId, "server-newer", existing.ClientUpdatedAtUtc));
            continue;
        }

        if (existing is null)
        {
            existing = new SyncedInstrumentRecord
            {
                UserEmail = userEmail,
                RecordId = incoming.Id,
            };
            dbContext.SyncedInstrumentRecords.Add(existing);
        }

        existing.Instrument = incoming.Instrument;
        existing.Status = incoming.Status;
        existing.ValuesJson = incoming.Values.GetRawText();
        existing.CreatedAtUtc = incoming.CreatedAt.ToUniversalTime();
        existing.ClientUpdatedAtUtc = clientUpdatedAt;
        existing.SyncedAtUtc = now;
        responseRecords.Add(new SyncRecordResponse(incoming.Id, "stored", clientUpdatedAt));
    }

    await dbContext.SaveChangesAsync(cancellationToken);
    await transaction.CommitAsync(cancellationToken);

    return Results.Ok(new SyncBatchResponse(responseRecords));
})
    .RequireAuthorization()
    .WithName("SyncInstrumentRecords");

app.MapGet("/api/v1/sync/records", async (
    System.Security.Claims.ClaimsPrincipal user,
    HabiTechDbContext dbContext,
    CancellationToken cancellationToken) =>
{
    var userEmail = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrWhiteSpace(userEmail))
    {
        return Results.Unauthorized();
    }

    var storedRecords = await dbContext.SyncedInstrumentRecords
        .AsNoTracking()
        .Where(record => record.UserEmail == userEmail)
        .OrderBy(record => record.RecordId)
        .Select(record => new
        {
            record.RecordId,
            record.Instrument,
            record.Status,
            record.CreatedAtUtc,
            record.ClientUpdatedAtUtc,
            record.ValuesJson,
        })
        .ToListAsync(cancellationToken);

    var records = storedRecords.Select(record => new SyncedInstrumentRecordResponse(
        record.RecordId,
        record.Instrument,
        record.Status,
        record.CreatedAtUtc,
        record.ClientUpdatedAtUtc,
        System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(record.ValuesJson)));

    return Results.Ok(records);
})
    .RequireAuthorization()
    .WithName("GetSyncedInstrumentRecords");

app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = check => check.Name == "live",
});

app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
});

app.Run();

public partial class Program;
