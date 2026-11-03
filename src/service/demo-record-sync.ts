import axios from "axios"
import { DEMO_AUTH_TOKEN } from "@/service/demo.api"
import {
  demoInstrumentTypes,
  readDemoInstrumentRecords,
  writeDemoInstrumentRecords,
  type DemoInstrumentRecord,
} from "@/lib/demo-form-records"
import { backendApi } from "@/service/backend.api"
import { readLocalAttachmentData, saveLocalAttachmentData } from "@/service/local-attachment-data"
import {
  hasDemoRecordTombstone,
  isDemoRecordTombstone,
  readDemoRecordTombstones,
  saveDemoRecordTombstone,
} from "@/service/demo-record-tombstones"

type SyncRecordResponse = {
  records: Array<{
    id: string
    result: "stored" | "server-newer"
    storedUpdatedAt: string
  }>
}

type SyncedInstrumentRecord = Omit<DemoInstrumentRecord, "instrument"> & {
  instrument: DemoInstrumentRecord["instrument"] | "selagem" | "arrolamento" | "selagem-anexo" | "arrolamento-anexo"
}

type SyncNotice = { kind: "server-detected" | "sync-complete"; count: number }

function reportSyncStatus(status: "syncing" | "synced" | "offline" | "error", message?: string) {
  window.dispatchEvent(new CustomEvent("habitech-sync-status", { detail: { status, message } }))
}

function reportSyncNotice(notice: SyncNotice): void {
  window.dispatchEvent(new CustomEvent("habitech-sync-notice", { detail: notice }))
}

async function mergeServerRecords(user: string, remoteRecords: SyncedInstrumentRecord[]): Promise<void> {
  for (const remote of remoteRecords) {
    if (!isDemoRecordTombstone(remote.values)) continue
    saveDemoRecordTombstone(remote.values.instrument, remote.id, remote.values.createdAt, remote.values.deletedAt)
  }
  const tombstones = readDemoRecordTombstones()

  for (const instrument of demoInstrumentTypes) {
    const localRecords = readDemoInstrumentRecords(instrument, user)
    const activeLocalRecords = localRecords.filter((record) => !hasDemoRecordTombstone(tombstones, instrument, record.id))
    const merged = new Map(activeLocalRecords.map((record) => [record.id, record]))
    let changed = activeLocalRecords.length !== localRecords.length

    for (const remoteRecord of remoteRecords) {
      if (remoteRecord.instrument !== instrument) continue
      if (hasDemoRecordTombstone(tombstones, instrument, remoteRecord.id)) continue
      const localRecord = merged.get(remoteRecord.id)
      if (!localRecord || remoteRecord.updatedAt > localRecord.updatedAt) {
        merged.set(remoteRecord.id, remoteRecord as DemoInstrumentRecord)
        changed = true
      }
    }

    if (changed) {
      writeDemoInstrumentRecords(instrument, user, [...merged.values()], false)
      window.dispatchEvent(new CustomEvent("habitech-demo-records-updated", { detail: instrument }))
    }
  }

  for (const instrument of ["selagem", "arrolamento"] as const) {
    const collectionName = instrument === "selagem" ? "selagens" : "arrolamentos"
    const key = `habitech-mock-records:v1:${collectionName}`
    const local = JSON.parse(localStorage.getItem(key) || "[]") as Array<Record<string, unknown>>
    const activeLocalRecords = local.filter((record) =>
      typeof record.id === "string" && !hasDemoRecordTombstone(tombstones, instrument, record.id),
    )
    const merged = new Map(activeLocalRecords.map((record) => [String(record.id), record]))
    let changed = activeLocalRecords.length !== local.length
    for (const remote of remoteRecords) {
      if (remote.instrument !== instrument || typeof remote.values !== "object" || remote.values === null) continue
      if (hasDemoRecordTombstone(tombstones, instrument, remote.id)) continue
      const values = remote.values as Record<string, unknown>
      const current = merged.get(remote.id)
      const localUpdated = typeof current?.updated_at === "string" ? current.updated_at : ""
      if (!current || remote.updatedAt > localUpdated) {
        merged.set(remote.id, values)
        changed = true
      }
    }
    if (changed) {
      localStorage.setItem(key, JSON.stringify([...merged.values()]))
      window.dispatchEvent(new CustomEvent("habitech-demo-records-updated", { detail: "mock-records" }))
    }
  }

  for (const remote of remoteRecords) {
    const prefix = remote.instrument === "selagem-anexo" ? "selagem" : remote.instrument === "arrolamento-anexo" ? "arrolamento" : undefined
    if (!prefix || !remote.id.startsWith(`attachments:${prefix}:`)) continue
    const surveyId = remote.id.slice(`attachments:${prefix}:`.length)
    const key = `${prefix}_attachments_${surveyId}`
    try {
      const current = JSON.parse(localStorage.getItem(key) || "{}") as Record<string, unknown>
      const localValues = remote.values as Record<string, unknown>
      const metadataValues: Record<string, unknown> = {}
      for (const [field, rawItems] of Object.entries(localValues)) {
        if (!Array.isArray(rawItems)) continue
        metadataValues[field] = await Promise.all(rawItems.map(async rawItem => {
          if (typeof rawItem !== "object" || rawItem === null) return rawItem
          const item = rawItem as Record<string, unknown>
          if (typeof item.id === "string" && typeof item.dataUrl === "string") {
            await saveLocalAttachmentData(item.id, item.dataUrl)
          }
          const { dataUrl: _dataUrl, ...metadata } = item
          return metadata
        }))
      }
      if (JSON.stringify(current) !== JSON.stringify(metadataValues)) localStorage.setItem(key, JSON.stringify(metadataValues))
    } catch {
      localStorage.setItem(key, JSON.stringify(remote.values))
    }
  }
}

async function getLocalRecords(user: string): Promise<SyncedInstrumentRecord[]> {
  const records: SyncedInstrumentRecord[] = demoInstrumentTypes.flatMap((instrument) => readDemoInstrumentRecords(instrument, user))
  const readArray = (key: string): Array<Record<string, unknown>> => {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(key) || "[]")
      return Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null) : []
    } catch { return [] }
  }
  const now = new Date().toISOString()
  for (const kind of ["selagens", "arrolamentos"] as const) {
    const instrument = kind === "selagens" ? "selagem" : "arrolamento"
    for (const record of readArray(`habitech-mock-records:v1:${kind}`)) {
      if (typeof record.id !== "string") continue
      records.push({
        id: record.id,
        instrument: instrument as "selagem" | "arrolamento",
        values: record,
        status: record.completed === true ? "Concluído" : "Rascunho",
        createdAt: typeof record.created_at === "string" ? record.created_at : now,
        updatedAt: typeof record.updated_at === "string" ? record.updated_at : now,
      })
    }
  }
  for (const tombstone of readDemoRecordTombstones()) {
    records.push({
      id: tombstone.id,
      instrument: tombstone.instrument,
      values: {
        id: tombstone.id,
        instrument: tombstone.instrument,
        createdAt: tombstone.createdAt,
        deletedAt: tombstone.deletedAt,
        deleted: true,
      },
      status: "Rascunho",
      createdAt: tombstone.createdAt,
      updatedAt: tombstone.deletedAt,
    })
  }
  for (const key of Object.keys(localStorage)) {
    const kind = key.startsWith("selagem_attachments_") ? "selagem" : key.startsWith("arrolamento_attachments_") ? "arrolamento" : undefined
    if (!kind) continue
    const id = key.slice(`${kind}_attachments_`.length)
    if (!id) continue
    try {
      const values: unknown = JSON.parse(localStorage.getItem(key) || "{}")
      if (typeof values !== "object" || values === null || Array.isArray(values)) continue
      const hydratedValues: Record<string, unknown> = {}
      for (const [field, rawItems] of Object.entries(values)) {
        if (!Array.isArray(rawItems)) continue
        hydratedValues[field] = await Promise.all(rawItems.map(async rawItem => {
          if (typeof rawItem !== "object" || rawItem === null) return rawItem
          const item = rawItem as Record<string, unknown>
          const dataUrl = typeof item.id === "string" ? await readLocalAttachmentData(item.id).catch(() => undefined) : undefined
          return dataUrl ? { ...item, dataUrl } : item
        }))
      }
      records.push({ id: `attachments:${kind}:${id}`, instrument: `${kind}-anexo` as "selagem-anexo" | "arrolamento-anexo", values: hydratedValues, status: "Rascunho", createdAt: now, updatedAt: now })
    } catch { /* Ignora apenas a chave local malformada; as demais seguem no lote. */ }
  }
  return records
}

export function startDemoRecordSync(user: string, token: string): () => void {
  let isSyncing = false
  let syncRequestedWhileRunning = false
  let disposed = false
  let serverWasDetected = false
  let shouldNotifySyncComplete = false
  let debounceTimer: number | undefined
  let retryTimer: number | undefined

  const synchronize = async () => {
    if (disposed) return
    if (isSyncing) {
      syncRequestedWhileRunning = true
      return
    }
    isSyncing = true
    reportSyncStatus("syncing")

    try {
      const authorization = {
        Authorization: `Bearer ${token}`,
        ...(token === DEMO_AUTH_TOKEN ? { "X-Offline-User": user } : {}),
      }
      const { data: serverRecords } = await backendApi.get<SyncedInstrumentRecord[]>(
        "/api/v1/sync/records",
        { headers: authorization },
      )
      await mergeServerRecords(user, serverRecords)
      const localRecords = await getLocalRecords(user)
      if (!serverWasDetected) {
        serverWasDetected = true
        shouldNotifySyncComplete = true
        reportSyncNotice({ kind: "server-detected", count: localRecords.length })
      }

      let transferredCount = 0
      const batches: SyncedInstrumentRecord[][] = []
      let batch: SyncedInstrumentRecord[] = []
      let batchBytes = 0
      for (const record of localRecords) {
        const recordBytes = new Blob([JSON.stringify(record)]).size
        if (batch.length >= 25 || (batch.length > 0 && batchBytes + recordBytes > 20 * 1024 * 1024)) {
          batches.push(batch)
          batch = []
          batchBytes = 0
        }
        batch.push(record)
        batchBytes += recordBytes
      }
      if (batch.length) batches.push(batch)
      for (const records of batches) {
        const { data: batchResult } = await backendApi.post<SyncRecordResponse>(
          "/api/v1/sync/records",
          { records },
          { headers: authorization },
        )
        transferredCount += batchResult.records.filter((record) => record.result === "stored").length
      }

      const { data: latestRecords } = await backendApi.get<SyncedInstrumentRecord[]>(
        "/api/v1/sync/records",
        { headers: authorization },
      )
      await mergeServerRecords(user, latestRecords)
      reportSyncStatus("synced")
      if (shouldNotifySyncComplete) {
        shouldNotifySyncComplete = false
        reportSyncNotice({ kind: "sync-complete", count: transferredCount })
      }
    } catch (error) {
      serverWasDetected = false
      shouldNotifySyncComplete = false
      const backendUnavailable = axios.isAxiosError(error) && !error.response
      if (!backendUnavailable) console.error(error)
      const message = axios.isAxiosError(error) && error.response?.status === 401
        ? "Sessão expirada. Entre novamente quando houver conexão."
        : "Dados permanecem salvos neste navegador; a sincronização será tentada novamente."
      reportSyncStatus(backendUnavailable ? "offline" : "error", message)
      if (!(axios.isAxiosError(error) && error.response?.status === 401)) {
        window.clearTimeout(retryTimer)
        retryTimer = window.setTimeout(() => void synchronize(), 15_000)
      }
    } finally {
      isSyncing = false
      if (syncRequestedWhileRunning) {
        syncRequestedWhileRunning = false
        scheduleSync()
      }
    }
  }

  const scheduleSync = () => {
    window.clearTimeout(debounceTimer)
    debounceTimer = window.setTimeout(() => void synchronize(), 500)
  }

  const handleOnline = () => scheduleSync()
  const handleRecordsUpdated = () => scheduleSync()

  window.addEventListener("online", handleOnline)
  window.addEventListener("habitech-demo-records-updated", handleRecordsUpdated)
  scheduleSync()

  return () => {
    disposed = true
    window.clearTimeout(debounceTimer)
    window.clearTimeout(retryTimer)
    window.removeEventListener("online", handleOnline)
    window.removeEventListener("habitech-demo-records-updated", handleRecordsUpdated)
  }
}
