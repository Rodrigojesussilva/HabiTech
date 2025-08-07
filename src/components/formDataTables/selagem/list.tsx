import  { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Selagem, columns } from "./columns"
import { DataTable } from "./data-table"
import survey_resource from "../../../service/survey_resource.api"
import { SURVEY_RESOURCE_BASE_URL } from "../../../service/constants"
import Loader from "../../loader/Loader"

// Type guard para validar se o response é do tipo esperado
function isGetSelagemResponse(response: any): response is { selagens: any[] } {
  return response && (Array.isArray(response.selagens) || response.selagens === undefined)
}


export default function DemoPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<Selagem[]>([])
  const [loading, setLoading] = useState(false)
  const [initialDate, setInitialDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [createdBy, setCreatedBy] = useState("")

  const handleView = (selagem: Selagem) => {
    console.log("👁️ Visualizando selagem:", selagem)
    navigate(`/view-selagem/${selagem.id}`)
  }

  const handleEdit = (selagem: Selagem) => {
    console.log("🚀 Tentando editar selagem:", selagem)
    
    // Verificar se a selagem está concluída
    if (selagem.completed) {
      alert(`❌ Esta selagem já foi concluída e não pode ser editada!\n\nSelagem: ${selagem.id}\nCriada por: ${selagem.created_by}\nNúmero SEI: ${selagem.survey.main_metadata.numero_sei}\nConcluída em: ${selagem.completed_at ? new Date(selagem.completed_at).toLocaleString('pt-BR') : 'Data não disponível'}`)
      return
    }
    
    console.log("✅ Selagem disponível para edição")
    navigate(`/edit-selagem/${selagem.id}`)
  }

  const handleNewVisit = async (selagem: Selagem) => {
    if (selagem.completed) {
      alert("Esta selagem já foi concluída e não pode receber novas visitas.")
      return
    }

    const confirm = window.confirm(`Criar nova visita para a selagem ${selagem.id}?\n\nA nova visita será criada com base nos dados da última visita.`)
    if (!confirm) return

    try {
      setLoading(true)
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
    setCreatedBy("")
    setInitialDate("")
    setEndDate("")
  }

  const fetchData = async () => {
    if (!createdBy.trim()) {
      setData([])
      setInitialDate("")
      setEndDate("")
      return
    }

    setLoading(true)
    try {
      const request = {
        created_by: createdBy.trim(),
        initial_date: initialDate,
        end_date: endDate,
      }

      const response = await survey_resource.GetSelagem(request, async (req) => {
        const searchParams = new URLSearchParams()
        for (const [key, value] of Object.entries(req.query_parameters ?? {})) {
          if (value !== undefined && value !== "") {
            searchParams.append(key, String(value))
          }
        }

        const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
        const res = await fetch(url, {
          method: req.method,
          headers: {
            "Content-Type": "application/json",
            ...(req.headers || {}),
          },
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
            },
          },
        }))

        setData(mapped)
      } else if (response && Object.keys(response).length === 0) {
        // Resposta vazia, mas sem erro
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

  return (
    <>
      <div className="flex flex-col text-left ml-10 mt-10 gap-4">
        <h1 className="text-2xl font-bold">Listagem de Formulários de Selagens</h1>
        
        <div className="flex flex-row gap-4 items-end">
          <div className="flex flex-col">
            <label htmlFor="created-by" className="text-sm font-medium text-gray-700">
              Criado por
            </label>
            <input
              type="text"
              id="created-by"
              className="border border-gray-300 rounded px-3 py-1 mt-1"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              placeholder="Nome do criador"
            />
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Carregando..." : "Filtrar"}
          </button>

          <button
            onClick={clearData}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            🗑️ Limpar
          </button>

          {loading && <Loader />}
        </div>

        <p className="text-sm text-gray-500">
          Visualize ou modifique os dados de selagens. 
        </p>
      </div>

      <div className="container mx-auto p-10">
        <DataTable columns={columns} data={data} onView={handleView} onEdit={handleEdit} onNewVisit={handleNewVisit} />
      </div>
    </>
  )
}
