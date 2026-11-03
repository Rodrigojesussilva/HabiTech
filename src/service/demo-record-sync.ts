import axios from "axios"
import {
  demoInstrumentTypes,
  readDemoInstrumentRecords,
  writeDemoInstrumentRecords,
  type DemoInstrumentRecord,
  type DemoInstrumentType,
} from "@/lib/demo-form-records"
import { backendApi } from "@/service/backend.api"

type SyncRecordResponse = {
  records: Array<{
    id: string
    result: "stored" | "server-newer"
    storedUpdatedAt: string
  }>
}

type SyncedInstrumentRecord = DemoInstrumentRecord

function reportSyncStatus(status: "syncing" | "synced" | "offline" | "error", message?: string) {
  window.dispatchEvent(new CustomEvent("habitech-sync-status", { detail: { status, message } }))
}

function mergeServerRecords(user: string, remoteRecords: SyncedInstrumentRecord[]): void {
  for (const instrument of demoInstrumentTypes) {
    const localRecords = readDemoInstrumentRecords(instrument, user)
    const merged = new Map(localRecords.map((record) => [record.id, record]))
    let changed = false

    for (const remoteRecord of remoteRecords) {
      if (remoteRecord.instrument !== instrument) continue
      const localRecord = merged.get(remoteRecord.id)
      if (!localRecord || remoteRecord.updatedAt > localRecord.updatedAt) {
        merged.set(remoteRecord.id, remoteRecord)
        changed = true
      }
    }

    if (changed) {
      writeDemoInstrumentRecords(instrument, user, [...merged.values()], false)
      window.dispatchEvent(new CustomEvent("habitech-demo-records-updated", { detail: instrument }))
    }
  }
}

function getLocalRecords(user: string): DemoInstrumentRecord[] {
  return demoInstrumentTypes.flatMap((instrument) => readDemoInstrumentRecords(instrument, user))
}

export function startDemoRecordSync(user: string, token: string): () => void {
  let isSyncing = false
  let syncRequestedWhileRunning = false
  let disposed = false
  let debounceTimer: number | undefined
  let retryTimer: number | undefined

  const synchronize = async () => {
    if (disposed) return
    if (isSyncing) {
      syncRequestedWhileRunning = true
      return
    }
    if (!navigator.onLine) {
      reportSyncStatus("offline")
      return
    }

    isSyncing = true
    reportSyncStatus("syncing")

    try {
      const authorization = { Authorization: `Bearer ${token}` }
      const { data: serverRecords } = await backendApi.get<SyncedInstrumentRecord[]>(
        "/api/v1/sync/records",
        { headers: authorization },
      )
      mergeServerRecords(user, serverRecords)

      const localRecords = getLocalRecords(user)
      for (let index = 0; index < localRecords.length; index += 25) {
        await backendApi.post<SyncRecordResponse>(
          "/api/v1/sync/records",
          { records: localRecords.slice(index, index + 25) },
          { headers: authorization },
        )
      }

      const { data: latestRecords } = await backendApi.get<SyncedInstrumentRecord[]>(
        "/api/v1/sync/records",
        { headers: authorization },
      )
      mergeServerRecords(user, latestRecords)
      reportSyncStatus("synced")
    } catch (error) {
      console.error("Não foi possível sincronizar os registros demonstrativos:", error)
      const message = axios.isAxiosError(error) && error.response?.status === 401
        ? "Sessão expirada. Entre novamente quando houver conexão."
        : "Dados permanecem salvos neste navegador; a sincronização será tentada novamente."
      reportSyncStatus("error", message)
      if (navigator.onLine && !(axios.isAxiosError(error) && error.response?.status === 401)) {
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
  const handleRecordsUpdated = (event: Event) => {
    const instrument = (event as CustomEvent<DemoInstrumentType>).detail
    if (demoInstrumentTypes.includes(instrument)) scheduleSync()
  }

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
