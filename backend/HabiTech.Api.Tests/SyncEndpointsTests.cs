using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using HabiTech.Api.Auth;
using HabiTech.Api.Data;
using HabiTech.Api.Sync;

namespace HabiTech.Api.Tests;

[TestClass]
public sealed class SyncEndpointsTests
{
    [TestMethod]
    public async Task SyncEndpointsRequireAuthentication()
    {
        using var factory = new HabiTechApiFactory();
        using var client = factory.CreateClient();

        var getResponse = await client.GetAsync("/api/v1/sync/records");
        var postResponse = await client.PostAsJsonAsync(
            "/api/v1/sync/records",
            new { records = new[] { CreateRecord("record-1", DateTimeOffset.UtcNow, "unauthenticated") } });

        Assert.AreEqual(HttpStatusCode.Unauthorized, getResponse.StatusCode);
        Assert.AreEqual(HttpStatusCode.Unauthorized, postResponse.StatusCode);
    }

    [TestMethod]
    public async Task SyncKeepsNewestVersionAndIsolatesRecordsByUser()
    {
        using var factory = new HabiTechApiFactory();
        using var firstUser = factory.CreateClient();
        using var secondUser = factory.CreateClient();
        var firstUserToken = await Login(firstUser, "demo@example.test", "first-password");
        var secondUserToken = await Login(secondUser, "other@example.test", "second-password");
        firstUser.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", firstUserToken);
        secondUser.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", secondUserToken);
        var newer = DateTimeOffset.UtcNow.AddMinutes(2);

        var storedResponse = await firstUser.PostAsJsonAsync(
            "/api/v1/sync/records",
            new { records = new[] { CreateRecord("shared-id", newer, "newest") } });
        var staleResponse = await firstUser.PostAsJsonAsync(
            "/api/v1/sync/records",
            new { records = new[] { CreateRecord("shared-id", newer.AddMinutes(-1), "stale") } });

        Assert.AreEqual(HttpStatusCode.OK, storedResponse.StatusCode);
        Assert.AreEqual(HttpStatusCode.OK, staleResponse.StatusCode);
        var staleBatch = await staleResponse.Content.ReadFromJsonAsync<SyncBatchResponse>();
        Assert.AreEqual("server-newer", staleBatch!.Records.Single().Result);

        var firstUserRecords = await firstUser.GetFromJsonAsync<List<SyncedInstrumentRecordResponse>>(
            "/api/v1/sync/records");
        var secondUserRecords = await secondUser.GetFromJsonAsync<List<SyncedInstrumentRecordResponse>>(
            "/api/v1/sync/records");

        Assert.AreEqual("newest", firstUserRecords!.Single().Values.GetProperty("value").GetString());
        Assert.IsEmpty(secondUserRecords!);
    }

    private static async Task<string> Login(HttpClient client, string email, string password)
    {
        var response = await client.PostAsJsonAsync("/api/auth/login", new { email, password });
        response.EnsureSuccessStatusCode();
        using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        return body.RootElement.GetProperty("accessToken").GetString()!;
    }

    private static object CreateRecord(string id, DateTimeOffset updatedAt, string value) => new
    {
        id,
        instrument = "residencial",
        status = "Rascunho",
        createdAt = updatedAt.AddHours(-1),
        updatedAt,
        values = new { value },
    };

    private sealed class HabiTechApiFactory : WebApplicationFactory<Program>
    {
        private readonly string _databaseName = Guid.NewGuid().ToString();

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Development");
            builder.ConfigureTestServices(services =>
            {
                services.RemoveAll<HabiTechDbContext>();
                services.RemoveAll<DbContextOptions<HabiTechDbContext>>();
                services.RemoveAll<IReadOnlyList<DemoAccount>>();
                services.AddSingleton<IReadOnlyList<DemoAccount>>(
                [
                    new DemoAccount { Email = "demo@example.test", Password = "first-password" },
                    new DemoAccount { Email = "other@example.test", Password = "second-password" },
                ]);
                services.AddDbContext<HabiTechDbContext>(options =>
                    options.UseInMemoryDatabase(_databaseName)
                        .ConfigureWarnings(warnings =>
                            warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning)));
            });
        }
    }
}
