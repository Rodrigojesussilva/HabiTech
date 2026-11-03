import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "@/lib/router-compat"
import { MobileFilters } from "@/components/formDataTables/arrolamento/mobile/mobile-filters"
import { DesktopFilters } from "@/components/formDataTables/arrolamento/desktop/desktop-filters"
import { CardList } from "@/components/formDataTables/arrolamento/mobile/card-list"
import { DesktopDataTable } from "@/components/formDataTables/arrolamento/desktop/data-table"
import Loader from "@/components/loader/Loader"
import type { Arrolamento } from "@/components/formDataTables/arrolamento/shared/types"
import survey_resource from "@/service/survey_resource.api"
import { SURVEY_RESOURCE_BASE_URL } from "@/service/constants"
import {
  createDemoInstrumentVisit,
  deleteDemoInstrumentRecord,
  findDemoInstrumentRecord,
  getCreatePath,
  getDemoUser,
  getEditPath,
  getViewPath,
  migrateEmptyUserDemoRecords,
  readDemoInstrumentRecords,
  type DemoInstrumentRecord,
  type DemoInstrumentType,
} from "@/lib/demo-form-records"
import type { FilterState } from "@/components/formDataTables/arrolamento/shared/types"

type DemoInstrumentListProps = { instrument: DemoInstrumentType; title: string }
type BackendVisitSummary = { id: string; visit_count?: number; completed?: boolean }

function getBackendVisits(response: unknown): BackendVisitSummary[] {
  if (!response || typeof response !== "object" || !("selagens" in response)) return []
  const visits = (response as { selagens?: unknown }).selagens
  if (!Array.isArray(visits)) return []
  return visits.filter((visit): visit is BackendVisitSummary =>
    typeof visit === "object" && visit !== null && typeof (visit as { id?: unknown }).id === "string",
  )
}

function valueText(values: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = values[key]
    if (typeof value === "string" || typeof value === "number") {
      if (String(value).trim()) return String(value)
    }
    const families = values.families
    if (Array.isArray(families) && families.length) {
      const first = families[0]
      if (first && typeof first === "object") {
        const nested = (first as Record<string, unknown>)[key]
        if (typeof nested === "string" || typeof nested === "number") {
          if (String(nested).trim()) return String(nested)
        }
      }
    }
  }
  return ""
}

function recordTitle(record: DemoInstrumentRecord): string {
  return valueText(record.values, "survey_id", "surveyId", "nomeEstabelecimento", "nomePredio", "nomeEspacoHabitado", "questionario", "seiNumber", "numeroSei")
    || `Registro ${record.id.slice(0, 8)}`
}

function recordSei(record: DemoInstrumentRecord): string {
  return valueText(record.values, "seiNumber", "numero_sei", "numeroSei") || "999999"
}

function recordVisit(record: DemoInstrumentRecord): number {
  return Number(valueText(record.values, "visitNumber", "visit_count")) || 1
}

export default function DemoInstrumentList({ instrument, title }: DemoInstrumentListProps) {
  const navigate = useNavigate()
  const user = getDemoUser()
  const createPath = getCreatePath(instrument)
  const [records, setRecords] = useState<DemoInstrumentRecord[]>([])
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [filters, setFilters] = useState<FilterState>({ createdBy: "", initialDate: "", endDate: "", searchQuery: "" })
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({ createdBy: "", initialDate: "", endDate: "", searchQuery: "" })

  const loadRecords = useCallback(() => {
    try {
      setRecords(readDemoInstrumentRecords(instrument, user).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)))
      setError("")
    } catch (loadError) {
      console.error(`Não foi possível carregar a lista de ${title}:`, loadError)
      setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar os registros deste navegador.")
    }
  }, [instrument, title, user])

  useEffect(() => {
    migrateEmptyUserDemoRecords()
    loadRecords()
    const handleRecordsUpdated = (event: Event) => {
      if ((event as CustomEvent<DemoInstrumentType>).detail === instrument) loadRecords()
    }
    window.addEventListener("habitech-demo-records-updated", handleRecordsUpdated)
    window.addEventListener("storage", loadRecords)
    return () => {
      window.removeEventListener("habitech-demo-records-updated", handleRecordsUpdated)
      window.removeEventListener("storage", loadRecords)
    }
  }, [instrument, loadRecords])

  const filteredRecords = useMemo(() => {
    const query = appliedFilters.searchQuery.trim().toLocaleLowerCase("pt-BR")
    const creator = appliedFilters.createdBy.trim().toLocaleLowerCase("pt-BR")
    return records.filter((record) =>
      (!query || `${recordTitle(record)} ${JSON.stringify(record.values)} ${record.status}`.toLocaleLowerCase("pt-BR").includes(query))
      && (!creator || user.toLocaleLowerCase("pt-BR").includes(creator))
      && (!appliedFilters.initialDate || record.createdAt.slice(0, 10) >= appliedFilters.initialDate)
      && (!appliedFilters.endDate || record.createdAt.slice(0, 10) <= appliedFilters.endDate),
    )
  }, [records, appliedFilters, user])

  // Reutiliza os mesmos cards, status e ações usados pela lista de arrolamento.
  const cardRecords = useMemo<Arrolamento[]>(() => filteredRecords.map((record) => ({
    id: record.id,
    survey_id: recordTitle(record),
    visit_count: recordVisit(record),
    completed: record.status === "Concluído",
    // ActionButtons checks the unnormalized localStorage value, just like the source lists.
    created_by: localStorage.getItem("userEmail") || "",
    created_at: record.createdAt,
    survey: { main_metadata: { numero_sei: recordSei(record) } },
  })), [filteredRecords])

  const applyFilters = () => setAppliedFilters(filters)
  const clearFilters = () => {
    const empty: FilterState = { createdBy: "", initialDate: "", endDate: "", searchQuery: "" }
    setFilters(empty)
    setAppliedFilters(empty)
  }

  const handleView = (item: Arrolamento) => {
    if (instrument === "residencial") {
      navigate(`${createPath}?continuar=${encodeURIComponent(item.id)}&visualizar=true`)
      return
    }
    navigate(getViewPath(instrument, item.id))
  }

  const handleEdit = (item: Arrolamento) => {
    if (instrument === "residencial") {
      navigate(`${createPath}?continuar=${encodeURIComponent(item.id)}`)
      return
    }
    navigate(getEditPath(instrument, item.id))
  }

  const handleNewVisit = async (item: Arrolamento) => {
    const record = findDemoInstrumentRecord(instrument, user, item.id)
    if (!record) return
    if (!item.completed) {
      window.alert("Apenas formulários concluídos podem receber uma nova visita.")
      return
    }
    setBusy(true)
    try {
      let backendId = ""
      let visitCount = item.visit_count + 1
      const sei = recordSei(record)
      if (instrument === "residencial") {
        const sourceId = valueText(record.values, "backendSelagemId")
        if (!sourceId) throw new Error("Este residencial não está vinculado a uma selagem no servidor. Não é possível criar uma visita sincronizada.")
        const token = localStorage.getItem("authToken") || ""
        const latestResponse = await survey_resource.GetSelagem({ numero_sei: sei === "999999" ? undefined : sei, authorization_token: token }, async (request) => {
          const params = new URLSearchParams()
          for (const [key, value] of Object.entries(request.query_parameters ?? {})) {
            if (value !== undefined && value !== "") params.append(key, String(value))
          }
          const result = await fetch(`${SURVEY_RESOURCE_BASE_URL}${request.path}${params.size ? `?${params}` : ""}`, {
            method: request.method,
            headers: {
              "Content-Type": "application/json",
              ...((request.headers?.authorization_token) ? { Authorization: `Bearer ${request.headers.authorization_token}` } : {}),
            },
          })
          if (!result.ok) throw new Error(await result.text())
          return result.json()
        })
        const sameSeiVisits = getBackendVisits(latestResponse)
        const latest = sameSeiVisits.reduce<BackendVisitSummary | undefined>((current, next) => !current || Number(next.visit_count) > Number(current.visit_count) ? next : current, undefined)
        if (latest && latest.id !== sourceId) throw new Error(`Já existe uma visita mais recente (visita ${latest.visit_count}). Selecione a última visita para criar uma nova.`)
        if (latest && !latest.completed) throw new Error("A visita mais recente ainda não está concluída. Conclua-a antes de criar uma nova visita.")
        if (latest && Number(latest.visit_count) >= 3) throw new Error("Limite de visitas atingido.")
      } else {
        const sameSeiVisits = records.filter((candidate) => sei !== "999999" && recordSei(candidate) === sei)
        const latest = sameSeiVisits.reduce((current, next) => !current || recordVisit(next) > recordVisit(current) ? next : current, undefined as DemoInstrumentRecord | undefined)
        if (latest && latest.id !== record.id) throw new Error(`Já existe uma visita mais recente (visita ${recordVisit(latest)}). Selecione a última visita para criar uma nova.`)
        if (latest && latest.status !== "Concluído") throw new Error("A visita mais recente ainda não está concluída. Conclua-a antes de criar uma nova visita.")
        if (latest && recordVisit(latest) >= 3) throw new Error("Limite de visitas atingido.")
      }
      if (!window.confirm(`Criar nova visita para ${item.survey_id}?\n\nA nova visita será criada com base nos dados da última visita.`)) return

      if (instrument === "residencial") {
        const sourceId = valueText(record.values, "backendSelagemId")
        const token = localStorage.getItem("authToken") || ""
        const response = await survey_resource.CreateFromSelagem({ id: sourceId, created_by: user, authorization_token: token }, async (request) => {
          const result = await fetch(`${SURVEY_RESOURCE_BASE_URL}${request.path}`, {
            method: request.method,
            headers: { "Content-Type": "application/json", ...(request.headers || {}) },
            body: JSON.stringify(request.body || {}),
          })
          if (!result.ok) throw new Error(await result.text())
          return result.json()
        })
        const created = response && typeof response === "object" && "selagem" in response ? response.selagem : undefined
        if (!created?.id) throw new Error("O servidor não retornou o identificador da nova visita.")
        backendId = created.id
        visitCount = Number(created.visit_count) || visitCount
        const createdBy = localStorage.getItem("userEmail") || user
        const statusResult = await fetch(`${SURVEY_RESOURCE_BASE_URL}/v1/selagens/${backendId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({
            created_by: createdBy,
            status_notas: { status: null, justificativa: "", nome_supervisor: "", observacao: "" },
          }),
        })
        if (!statusResult.ok) throw new Error(await statusResult.text())
        await statusResult.json()
        localStorage.setItem("selagemId", backendId)
        localStorage.setItem("selagemCreated_by", createdBy)
      }
      const newId = createDemoInstrumentVisit(instrument, user, item.id, backendId, visitCount)
      navigate(instrument === "residencial" ? `${createPath}?continuar=${encodeURIComponent(newId)}` : getEditPath(instrument, newId))
    } catch (visitError) {
      console.error(`Não foi possível criar visita para ${title}:`, visitError)
      window.alert(visitError instanceof Error ? visitError.message : "Não foi possível criar uma nova visita.")
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (item: Arrolamento) => {
    const record = findDemoInstrumentRecord(instrument, user, item.id)
    if (!record) return
    const backendId = instrument === "residencial" ? valueText(record.values, "backendSelagemId") : ""
    const confirmText = backendId
      ? `Tem certeza que deseja deletar a selagem ${backendId}?`
      : `Deseja remover o cadastro ${item.survey_id}?`
    if (!window.confirm(confirmText)) return
    try {
      setBusy(true)
      if (backendId) {
        const token = localStorage.getItem("authToken") || ""
        await survey_resource.DeleteSelagem({ id: backendId, authorization_token: token }, async (request) => {
          const result = await fetch(`${SURVEY_RESOURCE_BASE_URL}${request.path}`, {
            method: request.method,
            headers: {
              "Content-Type": "application/json",
              ...((request.headers?.authorization_token) ? { Authorization: `Bearer ${request.headers.authorization_token}` } : {}),
            },
            body: JSON.stringify(request.body || {}),
          })
          if (!result.ok) throw new Error(await result.text())
          const responseText = await result.text()
          return responseText ? JSON.parse(responseText) : {}
        })
      }
      deleteDemoInstrumentRecord(instrument, user, item.id)
      loadRecords()
      window.alert(backendId ? "Selagem deletada com sucesso!" : "Cadastro removido com sucesso!")
    } catch (deleteError) {
      console.error(`Não foi possível excluir o registro de ${title}:`, deleteError)
      window.alert(backendId ? "Erro ao deletar selagem. Verifique os logs." : "Erro ao remover o cadastro. Verifique os logs.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="px-3 py-4 sm:px-6 md:px-10 w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">{title}</h1>
        <div className="block md:hidden">
          <MobileFilters filters={filters} onFiltersChange={setFilters} onFilter={applyFilters} onClear={clearFilters} loading={busy} />
        </div>
        <div className="hidden md:block">
          <DesktopFilters filters={filters} onFiltersChange={setFilters} onFilter={applyFilters} onClear={clearFilters} loading={busy} />
        </div>
        <p className="text-sm text-gray-500 mt-4">Visualize ou modifique os dados deste formulário. Use os filtros por criador ou por período de datas.</p>
        {busy && <div className="flex justify-center mt-4"><Loader /></div>}
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
          <p>{error}</p><Button variant="outline" className="mt-3" onClick={loadRecords}>Tentar novamente</Button>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
          <h2 className="font-semibold text-slate-900">{appliedFilters.searchQuery ? "Nenhum registro encontrado" : `Nenhum ${title.toLocaleLowerCase("pt-BR")} encontrado`}</h2>
          <p className="mt-1 text-sm text-slate-600">Tente ajustar os filtros ou criar um novo formulário.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500" aria-live="polite">{filteredRecords.length} {filteredRecords.length === 1 ? "registro" : "registros"}</p>
          <div className={busy ? "pointer-events-none opacity-60" : undefined}>
            <div className="block md:hidden">
              <CardList data={cardRecords} onView={handleView} onEdit={handleEdit} onNewVisit={handleNewVisit} onDelete={handleDelete} />
            </div>
            <div className="hidden md:block">
              <DesktopDataTable data={cardRecords} onView={handleView} onEdit={handleEdit} onNewVisit={handleNewVisit} onDelete={handleDelete} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
