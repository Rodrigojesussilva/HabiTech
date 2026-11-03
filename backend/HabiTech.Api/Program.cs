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
using System.Text.Json;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var connectionString = builder.Configuration.GetConnectionString("LocalSqlServer")
    ?? throw new InvalidOperationException("Configure ConnectionStrings:LocalSqlServer para iniciar a API.");
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

builder.Services.AddDbContext<HabiTechDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddHttpClient("cep-provider", client => client.Timeout = TimeSpan.FromSeconds(8));

builder.Services
    .AddHealthChecks()
    .AddCheck("live", () => Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Healthy())
    .AddCheck<LocalDatabaseHealthCheck>("local-database", tags: ["ready"]);

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    await using var scope = app.Services.CreateAsyncScope();
    var database = scope.ServiceProvider.GetRequiredService<HabiTechDbContext>().Database;
    try
    {
        if (database.IsRelational())
        {
            await database.MigrateAsync();
        }
        else
        {
            await database.EnsureCreatedAsync();
        }
    }
    catch (Exception error)
    {
        app.Logger.LogError(error, "A API iniciará sem acesso ao SQL Server. Recursos que usam o banco ficarão indisponíveis.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
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

app.MapGet("/api/v1/lookup/cep/{cep}", async (
    string cep,
    IHttpClientFactory httpClientFactory,
    CancellationToken cancellationToken) =>
{
    var normalizedCep = new string(cep.Where(char.IsDigit).ToArray());
    if (normalizedCep.Length != 8)
    {
        return Results.BadRequest(new { message = "Informe um CEP com 8 dígitos." });
    }

    var client = httpClientFactory.CreateClient("cep-provider");
    var providerFailed = false;
    var providerReportedNotFound = false;
    var providers = new (string Url, bool ViaCep)[]
    {
        ($"https://brasilapi.com.br/api/cep/v1/{normalizedCep}", false),
        ($"https://viacep.com.br/ws/{normalizedCep}/json/", true),
    };

    foreach (var provider in providers)
    {
        try
        {
            using var response = await client.GetAsync(provider.Url, cancellationToken);
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                providerReportedNotFound = true;
                continue;
            }
            if (!response.IsSuccessStatusCode)
            {
                providerFailed = true;
                continue;
            }

            await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
            using var document = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);
            var data = document.RootElement;
            if (provider.ViaCep
                && data.TryGetProperty("erro", out var notFound)
                && notFound.ValueKind == JsonValueKind.True)
            {
                providerReportedNotFound = true;
                continue;
            }

            var street = ReadJsonString(data, provider.ViaCep ? "logradouro" : "street");
            var neighborhood = ReadJsonString(data, provider.ViaCep ? "bairro" : "neighborhood");
            var city = ReadJsonString(data, provider.ViaCep ? "localidade" : "city");
            var state = ReadJsonString(data, provider.ViaCep ? "uf" : "state");
            if (string.IsNullOrWhiteSpace(city) || string.IsNullOrWhiteSpace(state))
            {
                providerFailed = true;
                continue;
            }

            return Results.Ok(new
            {
                cep = ReadJsonString(data, "cep") ?? normalizedCep,
                logradouro = street ?? string.Empty,
                complemento = ReadJsonString(data, "complemento") ?? string.Empty,
                bairro = neighborhood ?? string.Empty,
                cidade = city,
                uf = state,
            });
        }
        catch (HttpRequestException)
        {
            providerFailed = true;
        }
        catch (TaskCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            providerFailed = true;
        }
        catch (JsonException)
        {
            providerFailed = true;
        }
    }

    if (providerReportedNotFound && !providerFailed)
    {
        return Results.NotFound(new { message = "CEP não encontrado." });
    }

    return Results.Problem(
        title: "Consulta de CEP indisponível",
        detail: "Não foi possível acessar os serviços de CEP. Verifique a conexão do computador que está executando a API.",
        statusCode: StatusCodes.Status503ServiceUnavailable);
})
    .WithName("LookupCep");

app.MapPost("/api/v1/sync/records", async (
    HttpContext context,
    SyncBatchRequest request,
    HabiTechDbContext dbContext,
    IReadOnlyList<DemoAccount> accounts,
    CancellationToken cancellationToken) =>
{
    const int maximumBatchSize = 25;
    const int maximumValuesJsonLength = 20 * 1024 * 1024;
    var supportedInstruments = new HashSet<string>(StringComparer.Ordinal)
    {
        "residencial",
        "nao-residencial",
        "ocupacao-predial",
        "selagem",
        "arrolamento",
        "selagem-anexo",
        "arrolamento-anexo",
    };
    var supportedStatuses = new HashSet<string>(StringComparer.Ordinal)
    {
        "Rascunho",
        "Concluído",
        "ConcluÃ­do",
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

    var userEmail = ResolveSyncUserEmail(context, accounts, app.Environment.IsDevelopment());
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
    .WithName("SyncInstrumentRecords");

app.MapGet("/api/v1/sync/records", async (
    HttpContext context,
    HabiTechDbContext dbContext,
    IReadOnlyList<DemoAccount> accounts,
    CancellationToken cancellationToken) =>
{
    var userEmail = ResolveSyncUserEmail(context, accounts, app.Environment.IsDevelopment());
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

static string? ResolveSyncUserEmail(
    HttpContext context,
    IReadOnlyList<DemoAccount> accounts,
    bool allowOfflineDemoToken)
{
    var authenticatedEmail = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    if (!string.IsNullOrWhiteSpace(authenticatedEmail)) return authenticatedEmail;

    if (!allowOfflineDemoToken
        || !string.Equals(context.Request.Headers["Authorization"].ToString(), "Bearer demo-token", StringComparison.Ordinal))
    {
        return null;
    }

    var offlineEmail = context.Request.Headers["X-Offline-User"].ToString().Trim();
    return accounts.FirstOrDefault(account =>
        string.Equals(account.Email, offlineEmail, StringComparison.OrdinalIgnoreCase))?.Email;
}

static string? ReadJsonString(JsonElement element, string propertyName)
{
    return element.ValueKind == JsonValueKind.Object
        && element.TryGetProperty(propertyName, out var property)
        && property.ValueKind == JsonValueKind.String
            ? property.GetString()
            : null;
}

public partial class Program;
