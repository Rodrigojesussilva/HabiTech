using HabiTech.Api.Data;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace HabiTech.Api.Health;

public sealed class LocalDatabaseHealthCheck(HabiTechDbContext dbContext) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        var canConnect = await dbContext.Database.CanConnectAsync(cancellationToken);
        return canConnect
            ? HealthCheckResult.Healthy("SQL Server local está acessível.")
            : HealthCheckResult.Unhealthy("SQL Server local está indisponível.");
    }
}
