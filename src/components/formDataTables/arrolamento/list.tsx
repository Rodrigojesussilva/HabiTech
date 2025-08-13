import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Arrolamento, columns } from "./columns"
import { DataTable } from "./data-table"
import survey_resource from "../../../service/survey_resource.api"
import { SURVEY_RESOURCE_URL } from "../../../service/constants"
import Loader from "../../loader/Loader"

function isGetArrolamentoResponse(response: any): response is { arrolamentos: any[] } {
  return response && (Array.isArray(response.arrolamentos) || response.arrolamentos === undefined)
}

export default function ArrolamentoList() {
  const navigate = useNavigate()
  const [data, setData] = useState<Arrolamento[]>([])
  const [loading, setLoading] = useState(false)
  const [initialDate, setInitialDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [createdBy, setCreatedBy] = useState("")

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

      await fetchData(true)
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
      await fetchData(true)
      alert('Arrolamento removido com sucesso!')
    } catch (e) {
      console.error('Erro ao remover arrolamento:', e)
      alert('Erro ao remover arrolamento. Verifique os logs.')
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async (_ignoreCreatedByFilter: boolean = false) => {
    setLoading(true)
    try {
      let request: any = {}
      if (createdBy.trim()) {
        request = { created_by: createdBy.trim() }
      } else {
        const initial = initialDate || '1900-01-01'
        const end = endDate || '2100-01-01'
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

  useEffect(() => { fetchData(true) /* auto load */ }, [])

  return (
    <>
      <div className="flex flex-col text-left ml-10 mt-10 gap-4">
        <h1 className="text-2xl font-bold">Listagem de Formulários de Arrolamento</h1>
        <div className="flex flex-row gap-4 items-end">
          <div className="flex flex-col">
            <label htmlFor="created-by" className="text-sm font-medium text-gray-700">Criado por</label>
            <input type="text" id="created-by" className="border border-gray-300 rounded px-3 py-1 mt-1" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} placeholder="Nome do criador" />
          </div>
          <button onClick={() => fetchData(true)} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{loading ? "Carregando..." : "Filtrar"}</button>
          <button onClick={() => { setData([]); setCreatedBy(""); setInitialDate(""); setEndDate("") }} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">🗑️ Limpar</button>
          {loading && <Loader />}
        </div>
        <p className="text-sm text-gray-500">Visualize ou modifique os dados de arrolamento.</p>
      </div>
      <div className="container mx-auto p-10">
        <DataTable columns={columns as any} data={data} onView={handleView} onEdit={handleEdit} onNewVisit={handleNewVisit} onDelete={handleDelete} />
      </div>
    </>
  )
}
