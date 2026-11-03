using Microsoft.EntityFrameworkCore;

namespace HabiTech.Api.Data;

public sealed class HabiTechDbContext(DbContextOptions<HabiTechDbContext> options) : DbContext(options)
{
    public DbSet<SyncedInstrumentRecord> SyncedInstrumentRecords => Set<SyncedInstrumentRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var records = modelBuilder.Entity<SyncedInstrumentRecord>();
        records.ToTable("SyncedInstrumentRecords");
        records.HasKey(record => record.Id);
        records.Property(record => record.UserEmail).HasMaxLength(254).IsRequired();
        records.Property(record => record.RecordId).HasMaxLength(80).IsRequired();
        records.Property(record => record.Instrument).HasMaxLength(32).IsRequired();
        records.Property(record => record.Status).HasMaxLength(20).IsRequired();
        records.Property(record => record.ValuesJson).HasColumnType("nvarchar(max)").IsRequired();
        records.HasIndex(record => new { record.UserEmail, record.RecordId }).IsUnique();
        records.HasIndex(record => new { record.UserEmail, record.Instrument, record.ClientUpdatedAtUtc });
    }
}
