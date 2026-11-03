import * as React from "react";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ArrolamentoListProps } from "../shared/types";
import { ActionButtons } from "../shared/action-buttons";
import { desktopColumns } from "./columns";

export function DesktopDataTable({ data, onView, onEdit, onNewVisit, onDelete }: ArrolamentoListProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns: desktopColumns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border bg-white">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium mb-2">Nenhum arrolamento encontrado</h3>
          <p className="text-sm text-center">
            Tente ajustar os filtros ou criar um novo arrolamento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table className="rounded-lg border bg-white">
        <TableHeader className="rounded-lg border bg-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="rounded-lg border bg-white" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  className={`bg-secondary border text-center text-primary px-2 py-2 ${
                    (header.column.columnDef as any).meta?.headerClassName ?? ''
                  }`}
                  key={header.id}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
              <TableHead className="bg-secondary border text-center text-primary px-2 py-2 w-32" key="actions">
                Ações
              </TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  className={`px-2 py-2 ${
                    (cell.column.columnDef as any).meta?.cellClassName ?? ''
                  }`}
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
              <TableCell className="px-2 py-2 w-32">
                <ActionButtons
                  item={row.original}
                  onView={onView}
                  onEdit={onEdit}
                  onNewVisit={onNewVisit}
                  onDelete={onDelete}
                  layout="horizontal"
                  size="sm"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 