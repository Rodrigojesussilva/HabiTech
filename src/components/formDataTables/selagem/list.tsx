import { Selagem, columns } from "./columns"
import { DataTable } from "./data-table"

function getData(): Selagem[] {
  // Fetch data from your API here.
  return [
    {

      Data: '07/03/2025',
      numeroFormulario: 50,
      numeroSelo: 132,
      status: "pendente",
      nomeEspacoHabitado: "03/03/2025",
    },
    {
      Data: '07/03/2025',
      numeroFormulario: 50,
      numeroSelo: 132,
      status: "pendente",
      nomeEspacoHabitado: "03/03/2025",
    },
    {
      Data: '07/03/2025',
      numeroFormulario: 50,
      numeroSelo: 132,
      status: "pendente",
      nomeEspacoHabitado: "03/03/2025",
    },
  ]
}

export default function DemoPage() {
  const data = getData()

  return (
    <>
      <div className="flex flex-col text-left ml-10 mt-10 gap-4">
        <h1 className="text-2xl font-bold">Listagem de Fomulários de Selagens</h1>

        {/* Campos de data para pesquisa */}
        <div className="flex flex-row gap-4 items-center">
          <div className="flex flex-col">
            <label htmlFor="data-inicial" className="text-sm font-medium text-gray-700">
              Data inicial
            </label>
            <input
              type="date"
              id="data-inicial"
              name="data-inicial"
              className="border border-gray-300 rounded px-3 py-1 mt-1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="data-final" className="text-sm font-medium text-gray-700">
              Data final
            </label>
            <input
              type="date"
              id="data-final"
              name="data-final"
              className="border border-gray-300 rounded px-3 py-1 mt-1"
            />
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Visualize ou modifique os dados de selagens.
        </p>
      </div>

      <div className="container mx-auto p-10">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  )
}
