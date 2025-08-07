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
import { Selagem } from "./columns"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	onView?: (row: TData) => void
	onEdit?: (row: TData) => void
	onNewVisit?: (row: TData) => void
}

export function DataTable<TData, TValue>({
	columns,
	data,
	onView,
	onEdit,
	onNewVisit,
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
		<div className="rounded-lg border bg-white">
			<Table className="rounded-lg border bg-white">
				<TableHeader className="rounded-lg border bg-white">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow className="rounded-lg border bg-white" key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead className="bg-secondary border text-center text-primary" key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
								</TableHead>
							))}
							<TableHead className="bg-secondary border text-center text-primary" key="actions">
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
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
								<TableCell className="flex items-center justify-center gap-2">
									{(() => {
										const item = row.original as Selagem
										const isCompleted = item.completed
										
										return (
											<>
												<Button 
													className="cursor-pointer p-2" 
													variant="ghost"
													onClick={() => onView?.(row.original)}
													title="Visualizar selagem"
												>
													<EyeIcon className="w-4 h-4" />
												</Button>
												<Button 
													className={`p-2 ${isCompleted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
													variant="ghost"
													onClick={() => onEdit?.(row.original)}
													disabled={isCompleted}
													title={isCompleted ? 'Esta selagem já foi concluída e não pode ser editada' : 'Editar selagem'}
												>
													<PencilIcon className="w-4 h-4" />
												</Button>
												<Button 
													className={`p-2 ${isCompleted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
													variant="ghost"
													onClick={() => onNewVisit?.(row.original)}
													disabled={isCompleted}
													title={isCompleted ? 'Esta selagem já foi concluída' : 'Nova visita'}
												>
													<PlusIcon className="w-4 h-4" />
												</Button>
												<Button 
													className="cursor-pointer p-2" 
													variant="ghost"
													title="Deletar selagem"
												>
													<TrashIcon className="w-4 h-4" />
												</Button>
											</>
										)
									})()}
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length + 1} className="h-24 text-center">
								Nenhum resultado encontrado.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	)
}
