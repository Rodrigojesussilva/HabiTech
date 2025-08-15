import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Selagem } from "../shared/types";
import { StatusBadge } from "../shared/status-badge";

export const desktopColumns: ColumnDef<Selagem>[] = [
  {
    accessorKey: "survey_id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    meta: { 
      headerClassName: "w-24", 
      cellClassName: "w-24 font-mono text-xs" 
    },
  },
  {
    accessorFn: row => row.survey.main_metadata.numero_sei,
    id: "numero_sei",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        SEI
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    meta: { 
      headerClassName: "w-28", 
      cellClassName: "w-28 font-mono text-xs" 
    },
  },
  {
    accessorKey: "visit_count",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Visita
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    meta: { 
      headerClassName: "w-16 text-center", 
      cellClassName: "w-16 text-center font-medium" 
    },
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
      const isCompleted = row.getValue("completed") as boolean;
      return <StatusBadge completed={isCompleted} />;
    },
    meta: { 
      headerClassName: "w-32", 
      cellClassName: "w-32" 
    },
  },
  {
    accessorKey: "created_by",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Criado por
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    meta: { 
      headerClassName: "w-40", 
      cellClassName: "w-40 truncate" 
    },
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
      const rawDate = row.getValue("created_at") as string;
      const date = new Date(rawDate);
      const formattedDate = date.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit", 
        month: "2-digit", 
        year: "numeric", 
        hour: "2-digit", 
        minute: "2-digit",
      });
      return <span className="text-xs font-mono">{formattedDate}</span>;
    },
    meta: { 
      headerClassName: "w-36", 
      cellClassName: "w-36" 
    },
  },
]; 