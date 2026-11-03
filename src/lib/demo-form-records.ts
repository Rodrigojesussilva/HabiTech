import { saveDemoRecordTombstone } from "@/service/demo-record-tombstones"

export type DemoInstrumentType = "residencial" | "nao-residencial" | "ocupacao-predial"
export type DemoRecordStatus = "Rascunho" | "Concluído"

export type DemoInstrumentRecord = {
  id: string
  instrument: DemoInstrumentType
  values: Record<string, unknown>
  status: DemoRecordStatus
  createdAt: string
  updatedAt: string
}

export const demoInstrumentTypes: DemoInstrumentType[] = [
  "residencial",
  "nao-residencial",
  "ocupacao-predial",
]

const recordsStorageKey = (instrument: DemoInstrumentType, user: string) =>
  `sehab-demo-records:v1:${user}:${instrument}`

const activeRecordStorageKey = (instrument: DemoInstrumentType, user: string) =>
  `sehab-demo-active-record:v1:${user}:${instrument}`

const routeDefinitions: Array<{ instrument: DemoInstrumentType; prefix: string; createPath: string }> = [
  { instrument: "residencial", prefix: "residencial", createPath: "create-residencial" },
  { instrument: "nao-residencial", prefix: "nao-residencial", createPath: "create-nao-residencial" },
  { instrument: "ocupacao-predial", prefix: "ocupacao-predial", createPath: "create-ocupacao-predial" },
]

function isDemoInstrumentRecord(value: unknown): value is DemoInstrumentRecord {
  if (typeof value !== "object" || value === null) return false
  const record = value as Partial<DemoInstrumentRecord>
  return typeof record.id === "string"
    && typeof record.instrument === "string"
    && typeof record.status === "string"
    && typeof record.createdAt === "string"
    && typeof record.updatedAt === "string"
    && typeof record.values === "object"
    && record.values !== null
    && !Array.isArray(record.values)
}

export function getDemoUser(): string {
  const user = localStorage.getItem("userEmail")?.trim()
  return user || "anonymous"
}

export function migrateEmptyUserDemoRecords(): void {
  if (localStorage.getItem("userEmail")?.trim()) return
  // Move records created while userEmail was an empty string into the same
  // anonymous account used by form completion.
  for (const instrument of demoInstrumentTypes) {
    const anonymousKey = recordsStorageKey(instrument, "anonymous")
    const emptyUserKey = recordsStorageKey(instrument, "")
    const emptyUserRaw = localStorage.getItem(emptyUserKey)
    if (!emptyUserRaw) continue

    try {
      const emptyUserRecords: unknown = JSON.parse(emptyUserRaw)
      const anonymousRecords: unknown = JSON.parse(localStorage.getItem(anonymousKey) || "[]")
      if (!Array.isArray(emptyUserRecords) || !emptyUserRecords.every(isDemoInstrumentRecord)) continue
      if (!Array.isArray(anonymousRecords) || !anonymousRecords.every(isDemoInstrumentRecord)) continue

      const merged = new Map<string, DemoInstrumentRecord>()
      for (const record of [...emptyUserRecords, ...anonymousRecords]) {
        const current = merged.get(record.id)
        if (!current || record.updatedAt > current.updatedAt) merged.set(record.id, record)
      }
      localStorage.setItem(anonymousKey, JSON.stringify([...merged.values()]))
      localStorage.removeItem(emptyUserKey)
    } catch (error) {
      console.error("Não foi possível migrar os registros demonstrativos anônimos:", error)
    }
  }
}

export function readDemoInstrumentRecords(instrument: DemoInstrumentType, user: string): DemoInstrumentRecord[] {
  const raw = localStorage.getItem(recordsStorageKey(instrument, user))
  if (!raw) return []

  const parsed: unknown = JSON.parse(raw)
  if (!Array.isArray(parsed) || !parsed.every(isDemoInstrumentRecord)) {
    throw new Error("Os registros demonstrativos estão em um formato inválido.")
  }
  return parsed.filter((record) => record.instrument === instrument)
}

export function writeDemoInstrumentRecords(
  instrument: DemoInstrumentType,
  user: string,
  records: DemoInstrumentRecord[],
  notify = true,
): void {
  localStorage.setItem(recordsStorageKey(instrument, user), JSON.stringify(records))
  if (notify) {
    window.dispatchEvent(new CustomEvent("habitech-demo-records-updated", { detail: instrument }))
  }
}

export function findDemoInstrumentRecord(
  instrument: DemoInstrumentType,
  user: string,
  id: string,
): DemoInstrumentRecord | undefined {
  return readDemoInstrumentRecords(instrument, user).find((record) => record.id === id)
}

function makeRecordId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function resolveRoute(pathname: string) {
  const segments = pathname.split("/").filter(Boolean)
  const route = routeDefinitions.find(({ prefix }) =>
    segments.some((segment) => segment === `create-${prefix}` || segment === `edit-${prefix}` || segment === `view-${prefix}`),
  )
  if (!route) return undefined

  const action = segments.find((segment) =>
    segment === `create-${route.prefix}` || segment === `edit-${route.prefix}` || segment === `view-${route.prefix}`,
  )
  if (!action || action.startsWith("view-")) return undefined

  const id = action.startsWith("edit-") ? segments[segments.indexOf(action) + 1] : undefined
  return { ...route, id, isCreate: action.startsWith("create-") }
}

export function getOrCreateActiveDemoRecordId(instrument: DemoInstrumentType, user: string): string {
  const key = activeRecordStorageKey(instrument, user)
  const existingId = localStorage.getItem(key)
  if (existingId) return existingId

  const id = makeRecordId()
  localStorage.setItem(key, id)
  return id
}

export function resumeDemoInstrumentDraft(instrument: DemoInstrumentType, user: string, id: string): string {
  localStorage.setItem(activeRecordStorageKey(instrument, user), id)
  return id
}

export function startNewDemoInstrumentDraft(instrument: DemoInstrumentType, user: string): string {
  const id = makeRecordId()
  localStorage.setItem(activeRecordStorageKey(instrument, user), id)
  clearDemoInstrumentDraft(user, getCreatePath(instrument))
  return id
}

export function deleteDemoInstrumentRecord(
  instrument: DemoInstrumentType,
  user: string,
  id: string,
): void {
  const records = readDemoInstrumentRecords(instrument, user)
  const record = records.find((item) => item.id === id)
  if (!record) return

  writeDemoInstrumentRecords(instrument, user, records.filter((item) => item.id !== id), false)
  saveDemoRecordTombstone(instrument, id, record.createdAt)
  const wasActiveRecord = localStorage.getItem(activeRecordStorageKey(instrument, user)) === id
  if (wasActiveRecord) {
    localStorage.removeItem(activeRecordStorageKey(instrument, user))
    clearDemoInstrumentDraft(user, getCreatePath(instrument))
  }
  clearDemoInstrumentDraft(user, `${getCreatePath(instrument)}?continuar=${encodeURIComponent(id)}`)
  clearDemoInstrumentDraft(user, getEditPath(instrument, id))
  window.dispatchEvent(new CustomEvent("habitech-demo-records-updated", { detail: instrument }))
}

export function createDemoInstrumentVisit(
  instrument: DemoInstrumentType,
  user: string,
  sourceRecordId: string,
  backendRecordId: string,
  visitCount: number,
): string {
  const source = findDemoInstrumentRecord(instrument, user, sourceRecordId)
  if (!source) throw new Error("O cadastro de origem não foi encontrado nesta lista.")

  const id = startNewDemoInstrumentDraft(instrument, user)
  const now = new Date()
  const timestamp = now.toISOString()
  const values = {
    ...source.values,
    backendSelagemId: backendRecordId,
    visitNumber: String(visitCount),
    firstVisitStart: now.toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    }).replace(",", " -"),
    firstVisitEnd: "",
    endTime: "",
  }
  const records = readDemoInstrumentRecords(instrument, user)
  const record: DemoInstrumentRecord = {
    id,
    instrument,
    values,
    status: "Rascunho",
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  writeDemoInstrumentRecords(instrument, user, [record, ...records])
  return id
}

export function saveAutosavedDemoRecord(
  pathname: string,
  user: string,
  values: Record<string, unknown>,
): void {
  const route = resolveRoute(pathname)
  if (!route) return

  const id = route.id ?? (route.isCreate ? getOrCreateActiveDemoRecordId(route.instrument, user) : undefined)
  if (!id) return

  const records = readDemoInstrumentRecords(route.instrument, user)
  const existing = records.find((record) => record.id === id)
  const now = new Date().toISOString()
  const nextRecord: DemoInstrumentRecord = {
    id,
    instrument: route.instrument,
    values,
    status: existing?.status ?? "Rascunho",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }
  const nextRecords = existing
    ? records.map((record) => record.id === id ? nextRecord : record)
    : [nextRecord, ...records]
  localStorage.setItem(recordsStorageKey(route.instrument, user), JSON.stringify(nextRecords))
  window.dispatchEvent(new CustomEvent("habitech-demo-records-updated", { detail: route.instrument }))
}

export function completeDemoInstrumentRecord(
  instrument: DemoInstrumentType,
  user: string,
  id: string,
  values: Record<string, unknown>,
): void {
  const records = readDemoInstrumentRecords(instrument, user)
  const existing = records.find((record) => record.id === id)
  const now = new Date().toISOString()
  const completedRecord: DemoInstrumentRecord = {
    id,
    instrument,
    values,
    status: "Concluído",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }
  const nextRecords = existing
    ? records.map((record) => record.id === id ? completedRecord : record)
    : [completedRecord, ...records]
  localStorage.setItem(recordsStorageKey(instrument, user), JSON.stringify(nextRecords))
  localStorage.removeItem(activeRecordStorageKey(instrument, user))
  window.dispatchEvent(new CustomEvent("habitech-demo-records-updated", { detail: instrument }))
}

export function clearDemoInstrumentDraft(
  user: string,
  pathname: string,
): void {
  const draftPrefix = `sehab-form-draft:v1:${user}:${pathname}`
  for (const key of Object.keys(localStorage)) {
    if (key === draftPrefix || key.startsWith(`${draftPrefix}?`)) localStorage.removeItem(key)
  }
}

export function getCreatePath(instrument: DemoInstrumentType): string {
  const route = routeDefinitions.find((definition) => definition.instrument === instrument)
  if (!route) throw new Error(`Instrumento demonstrativo não reconhecido: ${instrument}`)
  return `/${route.createPath}`
}

export function getEditPath(instrument: DemoInstrumentType, id: string): string {
  const route = routeDefinitions.find((definition) => definition.instrument === instrument)
  if (!route) throw new Error(`Instrumento demonstrativo não reconhecido: ${instrument}`)
  return `/edit-${route.prefix}/${id}`
}

export function getViewPath(instrument: DemoInstrumentType, id: string): string {
  const route = routeDefinitions.find((definition) => definition.instrument === instrument)
  if (!route) throw new Error(`Instrumento demonstrativo não reconhecido: ${instrument}`)
  return `/view-${route.prefix}/${id}`
}
