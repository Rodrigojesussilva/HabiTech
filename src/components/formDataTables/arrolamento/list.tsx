import { useState } from "react"
import { Arrolamento, columns } from "./columns"
import { DataTable } from "./data-table"
import survey_resource from "../../../service/survey_resource.api"
import { SURVEY_RESOURCE_URL } from "../../../service/constants"
import Loader from "../../loader/Loader"

function isGetArrolamentoResponse(
  response: any
): response is { arrolamentos: any[] } {
  return response && Array.isArray(response.arrolamentos)
}

export default function DemoPage() {
  const [data, setData] = useState<Arrolamento[]>([])
  const [loading, setLoading] = useState(false)
  const [initialDate, setInitialDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [createdBy, setCreatedBy] = useState("")

  const fetchData = async () => {
    // Se o campo "Criado por" estiver vazio, limpar resultados e sair
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

      const response = await survey_resource.GetArrolamento(request, async (req) => {
        const searchParams = new URLSearchParams()
        for (const [key, value] of Object.entries(req.query_parameters ?? {})) {
          if (value !== undefined && value !== "") {
            searchParams.append(key, String(value))
          }
        }

        const url = `${SURVEY_RESOURCE_URL}${req.path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
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

      if (isGetArrolamentoResponse(response)) {
        const mapped = response.arrolamentos.map((item: any): Arrolamento => {
          const sei = Number(item.survey?.main_metadata?.numero_sei ?? 0)
          const selo = Number(item.survey?.main_metadata?.numero_selo ?? 0)
          const rawDate = new Date(item.created_at)
          const dataVisita = rawDate.toLocaleDateString("pt-BR")

          return {
            questionario: item.survey_id ?? "Desconhecido",
            sei,
            selo,
            status: "pendente",
            dataVisita,
          }
        })

        setData(mapped)
      } else if (response && Object.keys(response).length === 0) {
        // resposta vazia, mas válida (sem resultados)
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


  return (
    <>
      <div className="flex flex-col text-left ml-10 mt-10 gap-4">
        <h1 className="text-2xl font-bold">Listagem de Formulários de Arrolamento</h1>

        <div className="flex flex-row gap-4 items-end">
          {/* Campo "Criado por" */}
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

          {/* Botão + Loader em linha */}
          <div className="flex flex-row items-center gap-2 mt-5">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Carregando..." : "Filtrar"}
            </button>

            {/* Mostra loader ao lado do botão */}
            {loading && <Loader />}
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Visualize ou modifique os dados de arrolamento.
        </p>
      </div>

      <div className="container mx-auto p-10">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  )
}
