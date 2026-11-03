using System.Text.Json;

namespace HabiTech.Api.Sync;

public sealed record SyncRecordResponse(
    string Id,
    string Result,
    DateTimeOffset StoredUpdatedAt);

public sealed record SyncBatchResponse(IReadOnlyList<SyncRecordResponse> Records);

public sealed record SyncedInstrumentRecordResponse(
    string Id,
    string Instrument,
    string Status,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    JsonElement Values);
