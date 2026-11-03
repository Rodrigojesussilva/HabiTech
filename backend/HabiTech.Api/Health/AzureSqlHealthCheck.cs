using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using HabiTech.Api.Data;

namespace HabiTech.Api.Health;

public sealed class AzureSqlHealthCheck(
    HabiTechDbContext dbContext,
    IConfiguration configuration,
    ILogger<AzureSqlHealthCheck> logger) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(configuration.GetConnectionString("AzureSql")))
        {
            return HealthCheckResult.Unhealthy("A conexão Azure SQL não foi configurada.");
        }

        var canConnect = await dbContext.Database.CanConnectAsync(cancellationToken);
        if (canConnect)
        {
            return HealthCheckResult.Healthy("Azure SQL está acessível.");
        }

        logger.LogWarning("A verificação de prontidão não conseguiu conectar ao Azure SQL.");
        return HealthCheckResult.Unhealthy("Azure SQL está indisponível.");
    }
}
