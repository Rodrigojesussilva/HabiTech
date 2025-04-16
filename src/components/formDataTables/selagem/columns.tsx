// src/components/formDataTables/selagem/columns.tsx
import { ColumnDef } from "@tanstack/react-table";

export type SelagemItem = {
  questionario: string;
  sei: string;
  selo: string;
  status: string;
  dataVisita: string;
};

export const columns: ColumnDef<SelagemItem>[] = [
  {
    accessorKey: "questionario",
    header: "Questionário",
  },
  {
    accessorKey: "sei",
    header: "SEI",
  },
  {
    accessorKey: "selo",
    header: "Selo",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "dataVisita",
    header: "Data da Visita",
  },
];
