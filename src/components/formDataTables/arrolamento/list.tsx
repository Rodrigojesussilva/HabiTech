import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import survey_resource from "../../../service/survey_resource.api"
import { SURVEY_RESOURCE_URL } from "../../../service/constants"
import Loader from "../../loader/Loader"

// Mobile and Desktop Components
import { CardList } from "./mobile/card-list"
import { MobileFilters } from "./mobile/mobile-filters"
import { DesktopDataTable } from "./desktop/data-table"
import { DesktopFilters } from "./desktop/desktop-filters"

// Shared Types
import { Arrolamento, FilterState } from "./shared/types"

function isGetArrolamentoResponse(response: any): response is { arrolamentos: any[] } {
  return response && (Array.isArray(response.arrolamentos) || response.arrolamentos === undefined)
}

export default function ArrolamentoList() {
  const navigate = useNavigate()
  const [data, setData] = useState<Arrolamento[]>([])
  const [loading, setLoading] = useState(false)
  
  // Unified Filter State
  const [filters, setFilters] = useState<FilterState>({
    createdBy: "",
    initialDate: "",
    endDate: "",
    searchQuery: ""
  })

  const handleView = (row: any) => {
    if (!row?.id) return
    navigate(`/view-arrolamento/${row.id}`)
  }

  const handleEdit = (row: any) => {
    if (!row?.id) return
    if (row.completed) {
      alert(`❌ Este arrolamento já foi concluído e não pode ser editado!\n\nArrolamento: ${row.survey_id}\nCriado por: ${row.created_by}\nNúmero SEI: ${row.survey?.main_metadata?.numero_sei ?? ''}`)
      return
    }
    navigate(`/edit-arrolamento/${row.id}`)
  }

  const handleNewVisit = async (row: any) => {
    try {
      setLoading(true)
      const numeroSei = row.survey?.main_metadata?.numero_sei
      const token = localStorage.getItem('authToken') || ''
      if (!numeroSei) {
        alert('Número SEI não encontrado.')
        return
      }
      const response = await survey_resource.GetArrolamento({ numero_sei: numeroSei, authorization_token: token }, async (req) => {
        const searchParams = new URLSearchParams()
        for (const [key, value] of Object.entries(req.query_parameters ?? {})) {
          if (value !== undefined && value !== "") {
            searchParams.append(key, String(value))
          }
        }
        const url = `${SURVEY_RESOURCE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
        const res = await fetch(url, { method: req.method, headers: { "Content-Type": "application/json", ...(req.headers || {}) } })
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      if (isGetArrolamentoResponse(response)) {
        const arrs = response.arrolamentos ?? []
        const latest = arrs.reduce((acc: any, cur: any) => (!acc || (cur.visit_count ?? 0) > (acc.visit_count ?? 0) ? cur : acc), null)
        if (latest && latest.id !== row.id) {
          alert(`Já existe uma visita mais recente (visita ${latest.visit_count}). Selecione a última visita para criar uma nova.`)
          return
        }
        if (latest && !latest.completed) {
          alert('A visita mais recente ainda não está concluída. Conclua-a antes de criar uma nova visita.')
          return
        }
      }
      const token2 = localStorage.getItem('authToken') || ''
      const respCreate = await survey_resource.CreateFromArrolamento({ id: row.id, created_by: localStorage.getItem('userEmail') || row.created_by, authorization_token: token2 }, async (req: any) => {
        const url = `${SURVEY_RESOURCE_URL}${req.path}`
        const res = await fetch(url, { method: req.method, headers: { 'Content-Type': 'application/json', ...(req.headers || {}) }, body: JSON.stringify(req.body || {}) })
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      console.log('✅ Nova visita criada para arrolamento:', respCreate)

      // Tentar forçar status Em Andamento (limpar status_notas)
      try {
        const newId = (respCreate as any)?.arrolamento?.id || (respCreate as any)?.id
        const createdBy = localStorage.getItem('userEmail') || row.created_by
        if (newId && createdBy) {
          const url = `${SURVEY_RESOURCE_URL}/survey-resource/v1/arrolamentos/${newId}`
          const res = await fetch(url, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token2}`,
            },
            body: JSON.stringify({
              created_by: createdBy,
              status_notas: { status: null, justificativa: "", nome_supervisor: "", observacao: "" },
            }),
          })
          if (!res.ok) throw new Error(await res.text())
          await res.json()
          // Redirecionar para edição da nova visita
          navigate(`/edit-arrolamento/${newId}`)
        }
      } catch (e) {
        console.warn('Aviso: não foi possível marcar a nova visita como em andamento automaticamente.', e)
      }

      await fetchData()
      alert('Nova visita criada com sucesso!')
    } catch (e) {
      console.error('Erro ao criar nova visita de arrolamento:', e)
      alert('Erro ao criar nova visita. Verifique os logs.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (row: any) => {
    if (!row?.id) return
    if (!confirm(`Deseja remover o arrolamento ${row.survey_id}?`)) return
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken') || ''
      await survey_resource.DeleteArrolamento({ id: row.id, authorization_token: token }, async (req: any) => {
        const url = `${SURVEY_RESOURCE_URL}${req.path}`
        const res = await fetch(url, { method: req.method, headers: { 'Content-Type': 'application/json', ...(req.headers || {}) }, body: JSON.stringify(req.body || {}) })
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      await fetchData()
      alert('Arrolamento removido com sucesso!')
    } catch (e) {
      console.error('Erro ao remover arrolamento:', e)
      alert('Erro ao remover arrolamento. Verifique os logs.')
    } finally {
      setLoading(false)
    }
  }

  const clearData = () => {
    setData([])
    setFilters({
      createdBy: "",
      initialDate: "",
      endDate: "",
      searchQuery: ""
    })
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      // Lógica de filtro: SOMENTE um parâmetro de filtro por vez
      // - Se houver created_by, NÃO enviar datas (filtro por criador)
      // - Caso contrário, enviar apenas intervalo de datas (com valores padrão amplos)
      // - searchQuery funciona como filtro geral para mobile
      let request: any = {}
      if (filters.createdBy.trim()) {
        request = { created_by: filters.createdBy.trim() }
      } else if (filters.searchQuery.trim()) {
        // Para mobile: busca geral (pode ser melhorada no backend)
        request = { created_by: filters.searchQuery.trim() }
      } else {
        const initial = filters.initialDate || '1900-01-01'
        const end = filters.endDate || '2100-01-01'
        request = { initial_date: initial, end_date: end }
      }
      const token = localStorage.getItem('authToken') || ''
      if (token) request.authorization_token = token

      const response = await survey_resource.GetArrolamento(request, async (req) => {
        const searchParams = new URLSearchParams()
        for (const [key, value] of Object.entries(req.query_parameters ?? {})) {
          if (value !== undefined && value !== "") {
            searchParams.append(key, String(value))
          }
        }
        const url = `${SURVEY_RESOURCE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
        const headers: Record<string, string> = { "Content-Type": "application/json" }
        const tokenFromReq = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
        if (tokenFromReq) headers['Authorization'] = `Bearer ${tokenFromReq}`
        const res = await fetch(url, { method: req.method, headers })
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })

      if (isGetArrolamentoResponse(response)) {
        const mapped = (response.arrolamentos ?? []).map((item: any): Arrolamento => ({
          id: item.id,
          survey_id: item.survey_id,
          created_by: item.created_by,
          visit_count: item.visit_count,
          created_at: item.created_at,
          completed: item.completed ?? false,
          completed_at: item.completed_at,
          survey: { main_metadata: { numero_sei: item.survey?.main_metadata?.numero_sei ?? "" } },
        })) as any
        setData(mapped)
      } else if (response && Object.keys(response).length === 0) {
        setData([])
      } else {
        console.error("Resposta inesperada da API:", response)
        setData([])
      }
    } catch (error) {
      console.error("Erro ao buscar arrolamentos:", error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() /* auto load */ }, [])

  return (
    <div className="px-4 py-6 sm:px-6 md:px-10">
      {/* HEADER RESPONSIVO */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">
          Arrolamentos
        </h1>
        
        {/* FILTROS MOBILE */}
        <div className="block md:hidden">
          <MobileFilters
            filters={filters}
            onFiltersChange={setFilters}
            onFilter={fetchData}
            onClear={clearData}
            loading={loading}
          />
        </div>
        
        {/* FILTROS DESKTOP */}
        <div className="hidden md:block">
          <DesktopFilters
            filters={filters}
            onFiltersChange={setFilters}
            onFilter={fetchData}
            onClear={clearData}
            loading={loading}
          />
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          Visualize ou modifique os dados de arrolamento. Use os filtros por criador ou por período de datas.
        </p>
        
        {loading && (
          <div className="flex justify-center mt-4">
            <Loader />
          </div>
        )}
      </div>
      
      {/* LISTAGEM MOBILE (CARDS) */}
      <div className="block md:hidden">
        <CardList
          data={data}
          onView={handleView}
          onEdit={handleEdit}
          onNewVisit={handleNewVisit}
          onDelete={handleDelete}
        />
      </div>
      
      {/* LISTAGEM DESKTOP (TABELA) */}
      <div className="hidden md:block">
        <DesktopDataTable
          data={data}
          onView={handleView}
          onEdit={handleEdit}
          onNewVisit={handleNewVisit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
