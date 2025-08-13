import * as React from "react"

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PencilIcon, TrashIcon, EyeIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onView?: (row: TData) => void
  onEdit?: (row: TData) => void
  onNewVisit?: (row: TData) => void
  onDelete?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onView,
  onEdit,
  onNewVisit,
  onDelete,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-lg border bg-white overflow-x-auto">
      <Table className="rounded-lg border bg-white min-w-[640px] text-xs md:text-sm">
        <TableHeader className="rounded-lg border bg-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="rounded-lg border bg-white" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead className="bg-secondary border text-center text-primary px-1 py-1 md:px-2 md:py-1" key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
              <TableHead className="bg-secondary border text-center text-primary px-1 py-1 md:px-2 md:py-1" key="actions">
                Ações
              </TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="px-1 py-1 md:px-2 md:py-1" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell className="flex items-center justify-center gap-0.5 md:gap-1 px-1 py-1 md:px-2 md:py-1">
                  <Button className="cursor-pointer p-0.5 md:p-1" variant="ghost" onClick={() => onView?.(row.original)} title="Visualizar">
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                  <Button className="p-0.5 md:p-1" variant="ghost" onClick={() => onEdit?.(row.original)} title={ (row.original as any).completed ? 'Edição indisponível para visitas concluídas' : 'Editar' } disabled={(row.original as any).completed}>
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button className="p-0.5 md:p-1" variant="ghost" onClick={() => onNewVisit?.(row.original)} title={(row.original as any).completed ? 'Criar nova visita' : 'Finalize a visita atual para liberar nova visita'} disabled={!((row.original as any).completed)}>
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                  <Button className="cursor-pointer p-0.5 md:p-1" variant="ghost" title="Deletar" onClick={() => onDelete?.(row.original)}>
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
