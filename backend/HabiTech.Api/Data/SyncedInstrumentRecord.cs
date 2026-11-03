namespace HabiTech.Api.Data;

public sealed class SyncedInstrumentRecord
{
    public long Id { get; set; }
    public string UserEmail { get; set; } = string.Empty;
    public string RecordId { get; set; } = string.Empty;
    public string Instrument { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string ValuesJson { get; set; } = "{}";
    public DateTimeOffset CreatedAtUtc { get; set; }
    public DateTimeOffset ClientUpdatedAtUtc { get; set; }
    public DateTimeOffset SyncedAtUtc { get; set; }
}
