export type SyncableInstrument =
  | "residencial"
  | "nao-residencial"
  | "ocupacao-predial"
  | "selagem"
  | "arrolamento"

export type DemoRecordTombstone = {
  id: string
  instrument: SyncableInstrument
  createdAt: string
  deletedAt: string
}

const tombstonesStorageKey = "habitech-sync-tombstones:v1"

export function readDemoRecordTombstones(): DemoRecordTombstone[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(tombstonesStorageKey) || "[]")
    if (!Array.isArray(value)) return []
    return value.filter((item): item is DemoRecordTombstone =>
      typeof item === "object"
      && item !== null
      && typeof item.id === "string"
      && typeof item.instrument === "string"
      && typeof item.createdAt === "string"
      && typeof item.deletedAt === "string",
    )
  } catch {
    return []
  }
}

export function isDemoRecordTombstone(value: unknown): value is { id: string; instrument: SyncableInstrument; createdAt: string; deletedAt: string } {
  if (typeof value !== "object" || value === null) return false
  const candidate = value as Record<string, unknown>
  return candidate.deleted === true
    && typeof candidate.id === "string"
    && typeof candidate.instrument === "string"
    && typeof candidate.createdAt === "string"
    && typeof candidate.deletedAt === "string"
}

export function saveDemoRecordTombstone(
  instrument: SyncableInstrument,
  id: string,
  createdAt: string,
  deletedAt = new Date().toISOString(),
): void {
  const tombstones = readDemoRecordTombstones()
  const next = tombstones.filter((item) => item.id !== id || item.instrument !== instrument)
  next.push({ id, instrument, createdAt, deletedAt })
  localStorage.setItem(tombstonesStorageKey, JSON.stringify(next))
}

export function hasDemoRecordTombstone(
  tombstones: DemoRecordTombstone[],
  instrument: SyncableInstrument,
  id: string,
): boolean {
  return tombstones.some((item) => item.instrument === instrument && item.id === id)
}
