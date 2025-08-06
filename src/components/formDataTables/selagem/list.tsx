import  { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Selagem, columns } from "./columns"
import { DataTable } from "./data-table"
import survey_resource from "../../../service/survey_resource.api"
import { SURVEY_RESOURCE_BASE_URL } from "../../../service/constants"
import Loader from "../../loader/Loader"
import ApiEnvironmentSwitcher from "../../debug/ApiEnvironmentSwitcher"

// Type guard para validar se o response é do tipo esperado
function isGetSelagemResponse(response: any): response is { selagens: any[] } {
  return response && (Array.isArray(response.selagens) || response.selagens === undefined)
}

// Mock data para testes
const mockSelagens: Selagem[] = [
  {
    id: "sel_12345abc",
    survey_id: "survey_001",
    created_by: "João Silva",
    visit_count: 1,
    created_at: "2024-01-15T10:30:00Z",
    survey: {
      main_metadata: {
        numero_sei: "SEI001234567"
      }
    }
  },
  {
    id: "sel_67890def",
    survey_id: "survey_002", 
    created_by: "Maria Santos",
    visit_count: 2,
    created_at: "2024-01-16T14:15:00Z",
    survey: {
      main_metadata: {
        numero_sei: "SEI987654321"
      }
    }
  },
  {
    id: "sel_11111ghi",
    survey_id: "survey_003",
    created_by: "Pedro Costa",
    visit_count: 1,
    created_at: "2024-01-17T09:45:00Z",
    survey: {
      main_metadata: {
        numero_sei: "SEI555666777"
      }
    }
  }
]

export default function DemoPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<Selagem[]>([])
  const [loading, setLoading] = useState(false)
  const [initialDate, setInitialDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [createdBy, setCreatedBy] = useState("")

  const handleEdit = (selagem: Selagem) => {
    console.log("🚀 Editando selagem:", selagem)
    alert(`Navegando para edição da selagem: ${selagem.id}\nCriada por: ${selagem.created_by}\nNúmero SEI: ${selagem.survey.main_metadata.numero_sei}`)
    navigate(`/edit-selagem/${selagem.id}`)
  }

  const loadMockData = () => {
    console.log("📊 Carregando dados mockados...")
    setData(mockSelagens)
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
        
        {/* API Environment Switcher for Development */}
        <ApiEnvironmentSwitcher className="mb-4" />

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

          {/* Botões de teste */}
          <button
            onClick={loadMockData}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            🧪 Carregar Mock
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
          Visualize ou modifique os dados de selagens. <strong>Use o botão "🧪 Carregar Mock" para testar a edição!</strong>
        </p>
      </div>

      <div className="container mx-auto p-10">
        <DataTable columns={columns} data={data} onEdit={handleEdit} />
      </div>
    </>
  )
}
