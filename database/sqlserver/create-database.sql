-- Execute no SSMS com Query > SQLCMD Mode habilitado.
-- Substitua a senha abaixo por uma senha local forte e use o mesmo valor
-- na ConnectionStrings:LocalSqlServer armazenada em .NET User Secrets.
:setvar HabiTechAppPassword "CHANGE_ME_BEFORE_RUNNING"
:on error exit

USE [master];
GO

IF N'$(HabiTechAppPassword)' = N'CHANGE_ME_BEFORE_RUNNING'
BEGIN
    THROW 51000, 'Edite HabiTechAppPassword no início do script antes de executar.', 1;
END;
GO

IF DB_ID(N'HabiTechLocal') IS NULL
BEGIN
    CREATE DATABASE [HabiTechLocal];
END;
GO

IF SUSER_ID(N'habitech_app') IS NULL
BEGIN
    CREATE LOGIN [habitech_app]
    WITH PASSWORD = N'$(HabiTechAppPassword)',
         CHECK_POLICY = ON,
         CHECK_EXPIRATION = OFF;
END;
ELSE
BEGIN
    ALTER LOGIN [habitech_app]
    WITH PASSWORD = N'$(HabiTechAppPassword)',
         CHECK_POLICY = ON,
         CHECK_EXPIRATION = OFF;
END;

ALTER LOGIN [habitech_app] WITH DEFAULT_DATABASE = [HabiTechLocal];
ALTER LOGIN [habitech_app] ENABLE;
GO

USE [HabiTechLocal];
GO

IF DATABASE_PRINCIPAL_ID(N'habitech_app') IS NULL
BEGIN
    CREATE USER [habitech_app] FOR LOGIN [habitech_app];
END;
ELSE IF EXISTS
(
    SELECT 1
    FROM sys.database_principals
    WHERE [name] = N'habitech_app'
      AND [sid] <> SUSER_SID(N'habitech_app')
)
BEGIN
    ALTER USER [habitech_app] WITH LOGIN = [habitech_app];
END;
GO

IF IS_ROLEMEMBER(N'db_datareader', N'habitech_app') <> 1
    ALTER ROLE [db_datareader] ADD MEMBER [habitech_app];

IF IS_ROLEMEMBER(N'db_datawriter', N'habitech_app') <> 1
    ALTER ROLE [db_datawriter] ADD MEMBER [habitech_app];
GO

IF OBJECT_ID(N'dbo.__EFMigrationsHistory', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[__EFMigrationsHistory]
    (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

IF OBJECT_ID(N'dbo.SyncedInstrumentRecords', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[SyncedInstrumentRecords]
    (
        [Id] bigint IDENTITY(1,1) NOT NULL,
        [UserEmail] nvarchar(254) NOT NULL,
        [RecordId] nvarchar(80) NOT NULL,
        [Instrument] nvarchar(32) NOT NULL,
        [Status] nvarchar(20) NOT NULL,
        [ValuesJson] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetimeoffset NOT NULL,
        [ClientUpdatedAtUtc] datetimeoffset NOT NULL,
        [SyncedAtUtc] datetimeoffset NOT NULL,
        CONSTRAINT [PK_SyncedInstrumentRecords] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE [name] = N'IX_SyncedInstrumentRecords_UserEmail_RecordId'
      AND [object_id] = OBJECT_ID(N'dbo.SyncedInstrumentRecords')
)
BEGIN
    CREATE UNIQUE NONCLUSTERED INDEX [IX_SyncedInstrumentRecords_UserEmail_RecordId]
        ON [dbo].[SyncedInstrumentRecords] ([UserEmail], [RecordId]);
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE [name] = N'IX_SyncedInstrumentRecords_UserEmail_Instrument_ClientUpdatedAtUtc'
      AND [object_id] = OBJECT_ID(N'dbo.SyncedInstrumentRecords')
)
BEGIN
    CREATE NONCLUSTERED INDEX [IX_SyncedInstrumentRecords_UserEmail_Instrument_ClientUpdatedAtUtc]
        ON [dbo].[SyncedInstrumentRecords] ([UserEmail], [Instrument], [ClientUpdatedAtUtc]);
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM [dbo].[__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261103051417_InitialSync'
)
BEGIN
    INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261103051417_InitialSync', N'10.0.14');
END;
GO
