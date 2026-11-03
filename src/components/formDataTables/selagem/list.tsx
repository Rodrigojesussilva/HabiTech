import { useEffect, useState } from "react"
import { useNavigate } from "@/lib/router-compat"
import survey_resource from "../../../service/survey_resource.api"
import { SURVEY_RESOURCE_BASE_URL } from "../../../service/constants"
import Loader from "../../loader/Loader"

// Mobile and Desktop Components
import { CardList } from "./mobile/card-list"
import { MobileFilters } from "./mobile/mobile-filters"
import { DesktopDataTable } from "./desktop/data-table"
import { DesktopFilters } from "./desktop/desktop-filters"

// Shared Types
import { Selagem, FilterState } from "./shared/types"

// Type guard para validar se o response é do tipo esperado
function isGetSelagemResponse(response: any): response is { selagens: any[] } {
  return response && (Array.isArray(response.selagens) || response.selagens === undefined)
}


export default function SelagemList() {
  const navigate = useNavigate()
  const [data, setData] = useState<Selagem[]>([])
  const [loading, setLoading] = useState(false)
  
  // Unified Filter State
  const [filters, setFilters] = useState<FilterState>({
    createdBy: "",
    initialDate: "",
    endDate: "",
    searchQuery: ""
  })

  const handleView = (selagem: Selagem) => {
    console.log("👁️ Visualizando selagem:", selagem)
    navigate(`/view-selagem/${selagem.id}`)
  }

  const handleEdit = (selagem: Selagem) => {
    console.log("🚀 Tentando editar selagem:", selagem)
    
    // Verificar se o usuário pode editar (apenas o criador)
    const currentUserEmail = localStorage.getItem('userEmail') || ''
    if (selagem.created_by !== currentUserEmail) {
      alert(`❌ Você não tem permissão para editar esta selagem!\n\nSelagem: ${selagem.survey_id}\nCriada por: ${selagem.created_by}\nNúmero SEI: ${selagem.survey.main_metadata.numero_sei}`)
      return
    }
    
    console.log("✅ Selagem disponível para edição")
    navigate(`/edit-selagem/${selagem.id}`)
  }

  const handleDelete = async (selagem: Selagem) => {
    // Verificar se o usuário pode deletar (apenas o criador)
    const currentUserEmail = localStorage.getItem('userEmail') || ''
    if (selagem.created_by !== currentUserEmail) {
      alert(`❌ Você não tem permissão para deletar esta selagem!\n\nSelagem: ${selagem.survey_id}\nCriada por: ${selagem.created_by}\nNúmero SEI: ${selagem.survey.main_metadata.numero_sei}`)
      return
    }

    const confirm = window.confirm(`Tem certeza que deseja deletar a selagem ${selagem.id}?`)
    if (!confirm) return

    try {
      setLoading(true)
      const token = localStorage.getItem('authToken') || ''
      await survey_resource.DeleteSelagem({ id: selagem.id, authorization_token: token }, async (req: any) => {
        const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}`
        const res = await fetch(url, {
          method: req.method,
          headers: {
            'Content-Type': 'application/json',
            ...(req.headers || {}),
          },
          body: JSON.stringify(req.body || {}),
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(`HTTP ${res.status}: ${text}`)
        }

        return res.json()
      })

      await fetchData()
      alert('Selagem deletada com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar selagem:', error)
      alert('Erro ao deletar selagem. Verifique os logs.')
    } finally {
      setLoading(false)
    }
  }

  const handleNewVisit = async (selagem: Selagem) => {
    if (!selagem.completed) {
      alert("Apenas selagens concluídas podem receber nova visita.")
      return
    }

    // Verificar se esta linha representa a visita mais recente
    // Estratégia: buscar TODAS as visitas pelo mesmo número SEI e comparar o visit_count máximo
    try {
      setLoading(true)
      const numeroSei = selagem.survey?.main_metadata?.numero_sei
      if (!numeroSei) {
        alert('Número SEI não encontrado para validação da visita mais recente.')
        setLoading(false)
        return
      }

      const token = localStorage.getItem('authToken') || ''
      const response = await survey_resource.GetSelagem({ numero_sei: numeroSei, authorization_token: token }, async (req) => {
        const searchParams = new URLSearchParams()
        for (const [key, value] of Object.entries(req.query_parameters ?? {})) {
          if (value !== undefined && value !== "") {
            searchParams.append(key, String(value))
          }
        }

        const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
        const headersToSend: Record<string, string> = {
          "Content-Type": "application/json",
        }
        const tokenFromReq = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
        if (tokenFromReq) headersToSend['Authorization'] = `Bearer ${tokenFromReq}`

        const res = await fetch(url, {
          method: req.method,
          headers: headersToSend,
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(`HTTP ${res.status}: ${text}`)
        }

        return res.json()
      })

      if (isGetSelagemResponse(response)) {
        const selagensMesmoSei = (response.selagens ?? [])
        if (selagensMesmoSei.length > 0) {
          const latest = selagensMesmoSei.reduce((acc: any, cur: any) => {
            if (!acc) return cur
            return (cur.visit_count ?? 0) > (acc.visit_count ?? 0) ? cur : acc
          }, null)

          if (latest && latest.id !== selagem.id) {
            alert(`Já existe uma visita mais recente (visita ${latest.visit_count}). Selecione a última visita para criar uma nova.`)
            setLoading(false)
            return
          }

          if (latest && !latest.completed) {
            alert('A visita mais recente ainda não está concluída. Conclua-a antes de criar uma nova visita.')
            setLoading(false)
            return
          }
          if (latest && (Number(latest.visit_count) ?? 0) >= 3) {
            alert('Limite de visitas atingido.')
            setLoading(false)
            return
          }
        }
      }
    } catch (e) {
      console.error('Erro ao validar visita mais recente:', e)
      // Em caso de erro de validação, não prosseguir
      setLoading(false)
      return
    }

    const confirm = window.confirm(`Criar nova visita para a selagem ${selagem.survey_id}?\n\nA nova visita será criada com base nos dados da última visita.`)
    if (!confirm) { setLoading(false); return }

    try {
      const token = localStorage.getItem('authToken') || ''

      const response = await survey_resource.CreateFromSelagem({
        id: selagem.id,
        created_by: localStorage.getItem('userEmail') || selagem.created_by,
        authorization_token: token,
      }, async (req: any) => {
        const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}`
        const res = await fetch(url, {
          method: req.method,
          headers: {
            'Content-Type': 'application/json',
            ...(req.headers || {}),
          },
          body: JSON.stringify(req.body || {}),
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(`HTTP ${res.status}: ${text}`)
        }

        return res.json()
      })

      console.log('✅ Nova visita criada:', response)

      // Garantir que a nova visita fique em andamento (não concluída)
      try {
        const newId = (response as any)?.selagem?.id
        const createdBy = localStorage.getItem('userEmail') || selagem.created_by
        if (newId && createdBy) {
          const url = `${SURVEY_RESOURCE_BASE_URL}/v1/selagens/${newId}`
          const res = await fetch(url, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              created_by: createdBy,
              status_notas: {
                status: null,
                justificativa: "",
                nome_supervisor: "",
                observacao: "",
              },
            }),
          })
          if (!res.ok) {
            const text = await res.text()
            throw new Error(`HTTP ${res.status}: ${text}`)
          }
          await res.json()

          // Redirecionar imediatamente para edição da nova visita
          navigate(`/edit-selagem/${newId}`)
        }
      } catch (e) {
        console.warn('Aviso: não foi possível marcar a nova visita como em andamento automaticamente.', e)
      }

      await fetchData()
      alert('Nova visita criada com sucesso!')
    } catch (error) {
      console.error('Erro ao criar nova visita:', error)
      alert('Erro ao criar nova visita. Verifique os logs.')
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
      const token = localStorage.getItem('authToken') || ''

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
      if (token) request.authorization_token = token

      const response = await survey_resource.GetSelagem(request, async (req) => {
        const searchParams = new URLSearchParams()
        for (const [key, value] of Object.entries(req.query_parameters ?? {})) {
          if (value !== undefined && value !== "") {
            searchParams.append(key, String(value))
          }
        }

        const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
        const headersToSend: Record<string, string> = {
          "Content-Type": "application/json",
        }
        const tokenFromReq = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
        if (tokenFromReq) headersToSend['Authorization'] = `Bearer ${tokenFromReq}`

        const res = await fetch(url, {
          method: req.method,
          headers: headersToSend,
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(`HTTP ${res.status}: ${text}`)
        }

        return res.json()
      })

      if (isGetSelagemResponse(response)) {
        const mapped = (response.selagens ?? []).map((item: any): Selagem => ({
          id: item.id,
          survey_id: item.survey_id,
          created_by: item.created_by,
          visit_count: item.visit_count,
          created_at: item.created_at,
          completed: item.completed ?? false,
          completed_at: item.completed_at,
          survey: {
            main_metadata: {
              numero_sei: item.survey?.main_metadata?.numero_sei ?? "",
              numero_sei_nao_aplicavel: Boolean(item.survey?.main_metadata?.numero_sei_nao_aplicavel),
            },
          },
        }))

        setData(mapped)
      } else if (response && Object.keys(response).length === 0) {
        console.warn("Resposta vazia: nenhuma selagem encontrada.")
        setData([])
      } else {
        console.error("Resposta inesperada da API:", response)
        setData([])
      }

    } catch (error) {
      console.error("Erro ao buscar selagens:", error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  // Buscar automaticamente ao montar, sem filtro
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="px-3 py-4 sm:px-6 md:px-10 w-full overflow-x-hidden">
      {/* HEADER RESPONSIVO */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">
          Selagens
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
          Visualize ou modifique os dados de selagens. Use os filtros por criador ou por período de datas.
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
