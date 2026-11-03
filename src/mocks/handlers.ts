import { http, HttpResponse } from "msw"

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

let selagens: DemoRecord[] = [
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
        numero: "100",
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
        numero: "45",
        bairro: "Jardim Novo",
        cidade: "Cidade Exemplo",
        uf: "SP",
      },
      situacao_uso_unidade: { situacao: "Ocupada", uso: "Residencial" },
      status_notas: { status: "Em andamento", observacao: "" },
    },
    attachments: [],
  },
]

let arrolamentos: DemoRecord[] = [
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
]

const states = [
  { nome: "Acre", sigla: "AC" }, { nome: "Alagoas", sigla: "AL" },
  { nome: "Amapá", sigla: "AP" }, { nome: "Amazonas", sigla: "AM" },
  { nome: "Bahia", sigla: "BA" }, { nome: "Ceará", sigla: "CE" },
  { nome: "Distrito Federal", sigla: "DF" }, { nome: "Espírito Santo", sigla: "ES" },
  { nome: "Goiás", sigla: "GO" }, { nome: "Maranhão", sigla: "MA" },
  { nome: "Mato Grosso", sigla: "MT" }, { nome: "Mato Grosso do Sul", sigla: "MS" },
  { nome: "Minas Gerais", sigla: "MG" }, { nome: "Pará", sigla: "PA" },
  { nome: "Paraíba", sigla: "PB" }, { nome: "Paraná", sigla: "PR" },
  { nome: "Pernambuco", sigla: "PE" }, { nome: "Piauí", sigla: "PI" },
  { nome: "Rio de Janeiro", sigla: "RJ" }, { nome: "Rio Grande do Norte", sigla: "RN" },
  { nome: "Rio Grande do Sul", sigla: "RS" }, { nome: "Rondônia", sigla: "RO" },
  { nome: "Roraima", sigla: "RR" }, { nome: "Santa Catarina", sigla: "SC" },
  { nome: "São Paulo", sigla: "SP" }, { nome: "Sergipe", sigla: "SE" },
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

const citiesByState: Record<string, string[]> = {
  SP: ["São Paulo", "Campinas", "Guarulhos", "Santos", "Osasco"],
  RJ: ["Rio de Janeiro", "Niterói", "Duque de Caxias"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem"],
  PR: ["Curitiba", "Londrina", "Maringá"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista"],
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

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
    const cities = citiesByState[String(params.uf).toUpperCase()] ?? ["Capital", "Centro"]
    return HttpResponse.json(cities.map((city) => ({ label: city, value: city })))
  }),
  http.get("/mock-api/lookup/cep/:cep", ({ params }) => {
    const cep = String(params.cep)
    return HttpResponse.json({
      cep: `${cep.slice(0, 5)}-${cep.slice(5)}`,
      logradouro: "Rua Exemplo",
      complemento: "",
      bairro: "Centro",
      cidade: "São Paulo",
      uf: "SP",
    })
  }),
  http.all("/mock-api/*", async ({ request }) => {
    const url = new URL(request.url)
    const path = url.pathname.toLowerCase()
    const isArrolamento = path.includes("arrolamento")
    const collection = isArrolamento ? arrolamentos : selagens
    const collectionName = isArrolamento ? "arrolamentos" : "selagens"
    const recordName = isArrolamento ? "arrolamento" : "selagem"
    const pathSegments = path.split("/").filter(Boolean)
    const collectionPathIndex = pathSegments.indexOf(collectionName)
    const requestedRecordId = collectionPathIndex >= 0 ? pathSegments[collectionPathIndex + 1] : undefined
    const recordId = collection.find((record) => record.id === requestedRecordId)?.id

    if (path.includes("/attachments")) {
      if (request.method === "GET") return HttpResponse.json({ attachments: [] })
      if (request.method === "POST" || request.method === "DELETE") {
        return HttpResponse.json({ status: "OK", mode: "demo" })
      }
    }

    if (request.method === "GET") {
      if (requestedRecordId && requestedRecordId !== "new-visit" && requestedRecordId !== "attachments") {
        const record = collection.find((item) => item.id === recordId)
        return record
          ? HttpResponse.json({ [recordName]: responseFor(record), ...responseFor(record) })
          : HttpResponse.json({ message: "Registro demonstrativo não encontrado." }, { status: 404 })
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
        return (!requestedId || record.id === requestedId)
          && (!requestedNumber || number === requestedNumber)
      })

      return HttpResponse.json({ [collectionName]: records.map(responseFor) })
    }

    const contentType = request.headers.get("content-type") ?? ""
    const body = contentType.includes("application/json")
      ? await request.clone().json() as unknown
      : undefined
    const payload = isRecord(body) ? body : {}

    if (path.includes("/new-visit") && request.method === "POST") {
      const originalId = requestedRecordId
      const original = collection.find((record) => record.id === originalId)
      if (!original) return HttpResponse.json({ message: "Registro demonstrativo não encontrado." }, { status: 404 })

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
      return HttpResponse.json({ [recordName]: responseFor(newRecord), ...responseFor(newRecord) })
    }

    if (request.method === "DELETE") {
      if (!recordId) {
        return HttpResponse.json({ message: "Registro demonstrativo não encontrado." }, { status: 404 })
      }
      if (isArrolamento) arrolamentos = arrolamentos.filter((record) => record.id !== recordId)
      else selagens = selagens.filter((record) => record.id !== recordId)
      return HttpResponse.json({})
    }

    if (request.method === "POST" || request.method === "PUT" || request.method === "PATCH") {
      if (path.includes("/upload")) {
        return HttpResponse.json({ id: `arquivo-demo-${Date.now()}`, name: "arquivo-demonstracao.jpg" })
      }

      if (recordId) {
        const record = collection.find((item) => item.id === recordId)
        if (record) {
          record.updated_at = new Date().toISOString()
          record.survey = { ...record.survey, ...payload }
          return HttpResponse.json({ [recordName]: responseFor(record), ...responseFor(record) })
        }
      }

      if (request.method === "POST" && path.endsWith(`/${collectionName}`)) {
        const now = new Date().toISOString()
        const created: DemoRecord = {
          id: `${recordName}-demo-${Date.now()}`,
          survey_id: `${isArrolamento ? "ARR" : "SEL"}-2026-DEMO`,
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
        return HttpResponse.json({ [recordName]: responseFor(created), ...responseFor(created), id: created.id })
      }
    }

    if (path.includes("arrolamento") || path.includes("selag") || path.includes("/file-input/")) {
      return HttpResponse.json({ status: "OK", mode: "demo" })
    }

    return HttpResponse.json(
      { message: `Rota demonstrativa não configurada: ${request.method} ${url.pathname}` },
      { status: 501 },
    )
  }),
]
