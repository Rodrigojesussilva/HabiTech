using System.Text.Json;

namespace HabiTech.Api.Sync;

public sealed record SyncRecordRequest(
    string Id,
    string Instrument,
    string Status,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    JsonElement Values);

public sealed record SyncBatchRequest(IReadOnlyList<SyncRecordRequest> Records);
