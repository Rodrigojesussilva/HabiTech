
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export type Arrolamento = {
  id: string
  survey_id: string
  created_by: string
  visit_count: number
  created_at: string
  completed: boolean
  completed_at?: string
  survey: {
    main_metadata: {
      numero_sei: string
    }
  }
}

export const columns: ColumnDef<Arrolamento>[] = [
  {
    accessorKey: "survey_id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Survey ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    meta: { headerClassName: "", cellClassName: "" },
  },
  {
    accessorFn: row => row.survey.main_metadata.numero_sei,
    id: "numero_sei",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Número SEI
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    meta: { headerClassName: "", cellClassName: "" },
  },
  {
    accessorKey: "visit_count",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Visita
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    meta: { headerClassName: "hidden md:table-cell", cellClassName: "hidden md:table-cell" },
  },
  {
    accessorKey: "completed",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const isCompleted = row.getValue("completed") as boolean
      return (
        <div className="flex items-center justify-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${isCompleted
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
            }`}>
            {isCompleted ? '✅ Concluída' : '⏳ Em Andamento'}
          </span>
        </div>
      )
    },
    meta: { headerClassName: "", cellClassName: "" },
  },
  {
    accessorKey: "created_by",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Criado por
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    meta: { headerClassName: "hidden lg:table-cell", cellClassName: "hidden lg:table-cell" },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Criado em
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue("created_at") as string
      const date = new Date(rawDate)
      const formattedDate = date.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
      })
      return <span>{formattedDate}</span>
    },
    meta: { headerClassName: "hidden xl:table-cell", cellClassName: "hidden xl:table-cell" },
  },
]