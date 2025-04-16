import { columns, SelagemItem } from "./columns";
import { DataTable } from "./data-table";

const mockData: SelagemItem[] = [
  {
    questionario: "Sehab-001",
    sei: "12545",
    selo: "9281",
    status: "pendente",
    dataVisita: "10/01/2025",
  },
  {
    questionario: "Sehab-002",
    sei: "45612",
    selo: "8132",
    status: "finalizado",
    dataVisita: "02/03/2025",
  },
];

export default function ListSelagem() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Selagens</h2>
      <p className="text-muted-foreground mb-6">Visualize ou modifique os dados de selagem.</p>
      <DataTable columns={columns} data={mockData} />
    </div>
  );
}
