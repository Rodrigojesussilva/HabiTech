import { http, HttpResponse } from "msw"
import { cidadesLocais } from "@/components/cidades_estados/cidade"
import { createArrolamentoSurveyId, createSelagemSurveyId } from "@/service/demo-record-id"
import { saveDemoRecordTombstone } from "@/service/demo-record-tombstones"

type DemoRecord = {
  id: string
  survey_id: string
  created_by: string
  visit_count: number
  completed: boolean
  completed_at?: string
  created_at: string
  updated_at: string
  deleted_at: string
  survey: Record<string, unknown>
  attachments: string[]
}

const demoUser = "demo@example.test"

const selagensStorageKey = "habitech-mock-records:v1:selagens"
const arrolamentosStorageKey = "habitech-mock-records:v1:arrolamentos"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function readStoredRecords(key: string, fallback: DemoRecord[]): DemoRecord[] {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(fallback))
      return fallback
    }
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? (parsed as DemoRecord[]) : fallback
  } catch {
    return fallback
  }
}

function persistRecords(key: string, records: DemoRecord[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(records))
    window.dispatchEvent(
      new CustomEvent("habitech-demo-records-updated", { detail: "mock-records" }),
    )
  } catch (error) {
    console.error("Não foi possível salvar registros mock localmente:", error)
  }
}

function clearUnmodifiedSampleNumbers(records: DemoRecord[]): DemoRecord[] {
  const samples: Record<string, { updatedAt: string; number: string }> = {
    "selagem-demo-001": { updatedAt: "2026-10-28T14:30:00.000Z", number: "100" },
    "selagem-demo-002": { updatedAt: "2026-10-30T10:00:00.000Z", number: "45" },
  }
  let changed = false
  const migrated = records.map((record) => {
    const sample = samples[record.id]
    const unit = record.survey.identificacao_unidade
    if (
      !sample ||
      record.updated_at !== sample.updatedAt ||
      typeof unit !== "object" ||
      unit === null
    ) {
      return record
    }
    const address = unit as Record<string, unknown>
    if (address.numero !== sample.number) return record
    changed = true
    return {
      ...record,
      survey: {
        ...record.survey,
        identificacao_unidade: { ...address, numero: "" },
      },
    }
  })

  if (changed) {
    try {
      localStorage.setItem(selagensStorageKey, JSON.stringify(migrated))
    } catch {
      /* Mantém o formulário utilizável se o armazenamento falhar. */
    }
  }
  return migrated
}

function isCompletedStatus(status: unknown): boolean {
  if (typeof status !== "string") return false
  const normalized = status.trim().toLowerCase()
  return (
    normalized === "concluído" ||
    normalized === "concluido" ||
    normalized.startsWith("completed") ||
    normalized === "finalizado" ||
    normalized === "finalizada"
  )
}

function repairCompletedFlags(records: DemoRecord[], storageKey: string): DemoRecord[] {
  let changed = false
  const repaired = records.map((record) => {
    const notas = record.survey.status_notas
    const status = isRecord(notas) ? notas.status : undefined
    const nestedCompleted = record.survey.completed === true
    if (!record.completed && (nestedCompleted || isCompletedStatus(status))) {
      changed = true
      const survey = { ...record.survey }
      delete survey.completed
      return {
        ...record,
        completed: true,
        completed_at: record.completed_at || record.updated_at || new Date().toISOString(),
        survey,
      }
    }
    return record
  })
  if (changed) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(repaired))
      window.dispatchEvent(
        new CustomEvent("habitech-demo-records-updated", { detail: "mock-records" }),
      )
    } catch {
      /* Mantém o formulário utilizável se o armazenamento falhar. */
    }
  }
  return repaired
}

let selagens: DemoRecord[] = repairCompletedFlags(
  clearUnmodifiedSampleNumbers(
    readStoredRecords(selagensStorageKey, [
      {
        id: "selagem-demo-001",
        survey_id: "SEL-2026-001",
        created_by: demoUser,
        visit_count: 1,
        completed: true,
        completed_at: "2026-10-28T14:30:00.000Z",
        created_at: "2026-10-28T13:00:00.000Z",
        updated_at: "2026-10-28T14:30:00.000Z",
        deleted_at: "",
        survey: {
          main_metadata: { numero_sei: "DEMO-2026-001" },
          identificacao_espaco_habitado: {
            nome_espaco_habitado: "Comunidade Exemplo",
            numero_selo: "SEL-001",
          },
          identificacao_unidade: {
            cep: "00000-001",
            logradouro: "Rua Exemplo",
            numero: "",
            bairro: "Bairro Exemplo",
            cidade: "Cidade Exemplo",
            uf: "SP",
          },
          situacao_uso_unidade: { situacao: "Ocupada", uso: "Residencial" },
          status_notas: { status: "Concluído", observacao: "" },
        },
        attachments: [],
      },
      {
        id: "selagem-demo-002",
        survey_id: "SEL-2026-002",
        created_by: demoUser,
        visit_count: 1,
        completed: false,
        created_at: "2026-10-30T10:00:00.000Z",
        updated_at: "2026-10-30T10:00:00.000Z",
        deleted_at: "",
        survey: {
          main_metadata: { numero_sei: "DEMO-2026-002" },
          identificacao_espaco_habitado: {
            nome_espaco_habitado: "Jardim Novo",
            numero_selo: "SEL-002",
          },
          identificacao_unidade: {
            cep: "04567-890",
            logradouro: "Avenida do Progresso",
            numero: "",
            bairro: "Jardim Novo",
            cidade: "Cidade Exemplo",
            uf: "SP",
          },
          situacao_uso_unidade: { situacao: "Ocupada", uso: "Residencial" },
          status_notas: { status: "Em andamento", observacao: "" },
        },
        attachments: [],
      },
    ]),
  ),
  selagensStorageKey,
)

let arrolamentos: DemoRecord[] = repairCompletedFlags(
  readStoredRecords(arrolamentosStorageKey, [
    {
      id: "arrolamento-demo-001",
      survey_id: "ARR-2026-001",
      created_by: demoUser,
      visit_count: 1,
      completed: true,
      completed_at: "2026-10-27T16:00:00.000Z",
      created_at: "2026-10-27T14:00:00.000Z",
      updated_at: "2026-10-27T16:00:00.000Z",
      deleted_at: "",
      survey: {
        main_metadata: {
          numero_sei: "DEMO-2026-003",
          numero_selo: "SEL-001",
          quantidade_familias: 1,
        },
        outras_informacoes: { texto: "" },
        status_notas: { status: "Concluído", observacao: "" },
        forms: [],
      },
      attachments: [],
    },
  ]),
  arrolamentosStorageKey,
)

const states = [
  { nome: "Acre", sigla: "AC" },
  { nome: "Alagoas", sigla: "AL" },
  { nome: "Amapá", sigla: "AP" },
  { nome: "Amazonas", sigla: "AM" },
  { nome: "Bahia", sigla: "BA" },
  { nome: "Ceará", sigla: "CE" },
  { nome: "Distrito Federal", sigla: "DF" },
  { nome: "Espírito Santo", sigla: "ES" },
  { nome: "Goiás", sigla: "GO" },
  { nome: "Maranhão", sigla: "MA" },
  { nome: "Mato Grosso", sigla: "MT" },
  { nome: "Mato Grosso do Sul", sigla: "MS" },
  { nome: "Minas Gerais", sigla: "MG" },
  { nome: "Pará", sigla: "PA" },
  { nome: "Paraíba", sigla: "PB" },
  { nome: "Paraná", sigla: "PR" },
  { nome: "Pernambuco", sigla: "PE" },
  { nome: "Piauí", sigla: "PI" },
  { nome: "Rio de Janeiro", sigla: "RJ" },
  { nome: "Rio Grande do Norte", sigla: "RN" },
  { nome: "Rio Grande do Sul", sigla: "RS" },
  { nome: "Rondônia", sigla: "RO" },
  { nome: "Roraima", sigla: "RR" },
  { nome: "Santa Catarina", sigla: "SC" },
  { nome: "São Paulo", sigla: "SP" },
  { nome: "Sergipe", sigla: "SE" },
  { nome: "Tocantins", sigla: "TO" },
]

const countries = [
  { nome: "Brasil", sigla: "BR" },
  { nome: "Argentina", sigla: "AR" },
  { nome: "Bolívia", sigla: "BO" },
  { nome: "Chile", sigla: "CL" },
  { nome: "Colômbia", sigla: "CO" },
  { nome: "Haiti", sigla: "HT" },
  { nome: "Peru", sigla: "PE" },
  { nome: "Venezuela", sigla: "VE" },
]

function responseFor(record: DemoRecord) {
  return {
    ...record,
    survey: record.survey,
  }
}

export const handlers = [
  http.get("/mock-api/demo/status", () =>
    HttpResponse.json({ mode: "demo", backendConnected: false }),
  ),
  http.get("/mock-api/lookup/countries", () => HttpResponse.json(countries)),
  http.get("/mock-api/lookup/states", () => HttpResponse.json(states)),
  http.get("/mock-api/lookup/cities/:uf", ({ params }) => {
    const uf = String(params.uf).toUpperCase() as keyof typeof cidadesLocais
    return HttpResponse.json(cidadesLocais[uf] ?? [])
  }),
  http.all("/mock-api/*", async ({ request }) => {
    const url = new URL(request.url)
    const path = url.pathname.toLowerCase()
    const isArrolamento = path.includes("arrolamento")
    selagens = readStoredRecords(selagensStorageKey, selagens)
    arrolamentos = readStoredRecords(arrolamentosStorageKey, arrolamentos)
    const collection = isArrolamento ? arrolamentos : selagens
    const collectionName = isArrolamento ? "arrolamentos" : "selagens"
    const recordName = isArrolamento ? "arrolamento" : "selagem"
    const pathSegments = path.split("/").filter(Boolean)
    const collectionPathIndex = pathSegments.indexOf(collectionName)
    const requestedRecordId =
      collectionPathIndex >= 0 ? pathSegments[collectionPathIndex + 1] : undefined
    const recordId = collection.find((record) => record.id === requestedRecordId)?.id

    if (path.includes("/attachments")) {
      if (request.method === "GET") return HttpResponse.json({ attachments: [] })
      if (request.method === "POST" || request.method === "DELETE") {
        return HttpResponse.json({ status: "OK", mode: "demo" })
      }
    }

    if (request.method === "GET") {
      if (
        requestedRecordId &&
        requestedRecordId !== "new-visit" &&
        requestedRecordId !== "attachments"
      ) {
        const record = collection.find((item) => item.id === recordId)
        return record
          ? HttpResponse.json({ [recordName]: responseFor(record), ...responseFor(record) })
          : HttpResponse.json(
              { message: "Registro demonstrativo não encontrado." },
              { status: 404 },
            )
      }

      if (!path.endsWith(`/${collectionName}`)) {
        return HttpResponse.json(
          { message: `Rota demonstrativa não configurada: GET ${url.pathname}` },
          { status: 501 },
        )
      }

      const requestedId = url.searchParams.get("id")
      const requestedNumber = url.searchParams.get("numero_sei")
      const records = collection.filter((record) => {
        const metadata = record.survey.main_metadata
        const number = isRecord(metadata) ? String(metadata.numero_sei ?? "") : ""
        return (
          (!requestedId || record.id === requestedId) &&
          (!requestedNumber || number === requestedNumber)
        )
      })

      return HttpResponse.json({ [collectionName]: records.map(responseFor) })
    }

    const contentType = request.headers.get("content-type") ?? ""
    const body = contentType.includes("application/json")
      ? ((await request.clone().json()) as unknown)
      : undefined
    const payload = isRecord(body) ? body : {}

    if (path.includes("/new-visit") && request.method === "POST") {
      const originalId = requestedRecordId
      const original = collection.find((record) => record.id === originalId)
      if (!original)
        return HttpResponse.json(
          { message: "Registro demonstrativo não encontrado." },
          { status: 404 },
        )

      const newRecord: DemoRecord = {
        ...original,
        id: `${original.id}-v${original.visit_count + 1}`,
        survey_id: `${original.survey_id}-V${original.visit_count + 1}`,
        visit_count: original.visit_count + 1,
        completed: false,
        completed_at: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      collection.push(newRecord)
      persistRecords(
        collectionName === "arrolamentos" ? arrolamentosStorageKey : selagensStorageKey,
        collection,
      )
      return HttpResponse.json({
        [recordName]: responseFor(newRecord),
        ...responseFor(newRecord),
      })
    }

    if (request.method === "DELETE") {
      if (!recordId) {
        return HttpResponse.json(
          { message: "Registro demonstrativo não encontrado." },
          { status: 404 },
        )
      }
      const deletedRecord = collection.find((record) => record.id === recordId)
      if (deletedRecord) {
        saveDemoRecordTombstone(
          isArrolamento ? "arrolamento" : "selagem",
          recordId,
          deletedRecord.created_at,
        )
      }
      if (isArrolamento) arrolamentos = arrolamentos.filter((record) => record.id !== recordId)
      else selagens = selagens.filter((record) => record.id !== recordId)
      persistRecords(
        collectionName === "arrolamentos" ? arrolamentosStorageKey : selagensStorageKey,
        isArrolamento ? arrolamentos : selagens,
      )
      return HttpResponse.json({})
    }

    if (request.method === "POST" || request.method === "PUT" || request.method === "PATCH") {
      if (path.includes("/upload")) {
        return HttpResponse.json({
          id: `arquivo-demo-${Date.now()}`,
          name: "arquivo-demonstracao.jpg",
        })
      }

      if (recordId) {
        const record = collection.find((item) => item.id === recordId)
        if (record) {
          const updatedAt = new Date().toISOString()
          record.updated_at = updatedAt
          if (typeof payload.completed === "boolean") {
            record.completed = payload.completed
            record.completed_at = payload.completed
              ? record.completed_at || updatedAt
              : undefined
          }
          const surveyPayload = Object.fromEntries(
            Object.entries(payload).filter(([key]) => key !== "completed"),
          )
          record.survey = { ...record.survey, ...surveyPayload }
          persistRecords(
            collectionName === "arrolamentos" ? arrolamentosStorageKey : selagensStorageKey,
            collection,
          )
          return HttpResponse.json({
            [recordName]: responseFor(record),
            ...responseFor(record),
          })
        }
      }

      if (request.method === "POST" && path.endsWith(`/${collectionName}`)) {
        const now = new Date().toISOString()
        const createdAt = new Date(now)
        const created: DemoRecord = {
          id: `${recordName}-${crypto.randomUUID()}`,
          survey_id: isArrolamento
            ? String(payload.survey_id || createArrolamentoSurveyId(collection, createdAt))
            : String(payload.survey_id || createSelagemSurveyId(collection, createdAt)),
          created_by: String(payload.created_by ?? demoUser),
          visit_count: 1,
          completed: false,
          created_at: now,
          updated_at: now,
          deleted_at: "",
          survey: {
            main_metadata: isRecord(payload.main_metadata) ? payload.main_metadata : {},
            status_notas: { status: "Em andamento", observacao: "" },
            ...payload,
          },
          attachments: [],
        }
        collection.push(created)
        persistRecords(
          collectionName === "arrolamentos" ? arrolamentosStorageKey : selagensStorageKey,
          collection,
        )
        return HttpResponse.json({
          [recordName]: responseFor(created),
          ...responseFor(created),
          id: created.id,
        })
      }
    }

    if (
      path.includes("arrolamento") ||
      path.includes("selag") ||
      path.includes("/file-input/")
    ) {
      return HttpResponse.json({ status: "OK", mode: "demo" })
    }

    return HttpResponse.json(
      { message: `Rota demonstrativa não configurada: ${request.method} ${url.pathname}` },
      { status: 501 },
    )
  }),
]
