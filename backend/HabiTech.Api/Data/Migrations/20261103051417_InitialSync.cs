using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HabiTech.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialSync : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SyncedInstrumentRecords",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserEmail = table.Column<string>(type: "nvarchar(254)", maxLength: 254, nullable: false),
                    RecordId = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Instrument = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ValuesJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ClientUpdatedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    SyncedAtUtc = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SyncedInstrumentRecords", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SyncedInstrumentRecords_UserEmail_Instrument_ClientUpdatedAtUtc",
                table: "SyncedInstrumentRecords",
                columns: new[] { "UserEmail", "Instrument", "ClientUpdatedAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_SyncedInstrumentRecords_UserEmail_RecordId",
                table: "SyncedInstrumentRecords",
                columns: new[] { "UserEmail", "RecordId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SyncedInstrumentRecords");
        }
    }
}
