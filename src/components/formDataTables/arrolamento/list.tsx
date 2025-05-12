import { Arrolamento, columns } from "./columns"
import { DataTable } from "./data-table"

function getData(): Arrolamento[] {
	// Fetch data from your API here.
	return [
		{

			questionario: "Sehab-023",
			sei: 50,
			selo: 132,
			status: "pendente",
			dataVisita: "03/03/2025",
		},
		{
			questionario: "Sehab-224",
			sei: 10451,
			selo: 2933,
			status: "finalizado",
			dataVisita: "04/01/2024",
		},
		{
			questionario: "Sehab-3325",
			sei: 452,
			selo: 94,
			status: "pendente",
			dataVisita: "05/11/2024",
		},
	]
}

export default function DemoPage() {
	const data = getData()

	return (
		<>
			<>
				  <div className="flex flex-col text-left ml-10 mt-10 gap-4">
					<h1 className="text-2xl font-bold">Listagem de Fomulários de Arrolamento</h1>
			
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
					  Visualize ou modifique os dados de arrolamento.
					</p>
				  </div>
			
				  <div className="container mx-auto p-10">
					<DataTable columns={columns} data={data} />
				  </div>
				</>
		</>
	)
}
