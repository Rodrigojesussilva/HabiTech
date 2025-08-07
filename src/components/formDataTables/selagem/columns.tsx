import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export type Selagem = {
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

export const columns: ColumnDef<Selagem>[] = [
  
  {
    accessorKey: "survey_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Survey ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "created_by",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Criado por
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "visit_count",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Contagem de Visitas
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Criado em
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorFn: row => row.survey.main_metadata.numero_sei,
    id: "numero_sei",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Número SEI
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "completed",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const isCompleted = row.getValue("completed") as boolean
      return (
        <div className="flex items-center justify-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isCompleted 
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
          }`}>
            {isCompleted ? '✅ Concluída' : '⏳ Em Andamento'}
          </span>
        </div>
      )
    },
  },
]
