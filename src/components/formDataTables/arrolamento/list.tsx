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
			<div className="flex flex-col text-left ml-10 mt-10 gap-4">
				<h1 className="text-2xl font-bold">Arrolamentos</h1>
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
