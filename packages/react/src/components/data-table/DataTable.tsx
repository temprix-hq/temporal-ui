import {
	columnFilteringFeature,
	columnVisibilityFeature,
	createFilteredRowModel,
	filterFns,
	flexRender,
	rowSelectionFeature,
	tableFeatures,
	useTable,
	type AccessorKeyColumnDef as TanstackAccessorKeyColumnDef,
	type CellData,
	type ColumnDef as TanstackColumnDef,
	type ColumnVisibilityState,
	type RowData,
	type TableOptions,
} from "@tanstack/react-table";
import type { DataTableProps as CoreDataTableProps } from "@temporal-ui/core/data-table";
import { testId as createTestId } from "@temporal-ui/core/utils/string";
import type { ReactNode } from "react";
import { Loader } from "../loader";
import { Table } from "../table";

/** The fixed TanStack Table feature set every DataTable is created with. */
export const dataTableFeatures = tableFeatures({
	columnVisibilityFeature,
	rowSelectionFeature,
	columnFilteringFeature,
	filteredRowModel: createFilteredRowModel(),
	filterFns,
});

export type DataTableFeatures = typeof dataTableFeatures;

export type ColumnDef<
	TData extends RowData,
	TValue extends CellData = CellData,
> = TanstackColumnDef<DataTableFeatures, TData, TValue>;

export type AccessorKeyColumnDef<
	TData extends RowData,
	TValue extends CellData = CellData,
> = TanstackAccessorKeyColumnDef<DataTableFeatures, TData, TValue>;

export type VisibilityState = ColumnVisibilityState;

export type { RowData };

export type DataTableProps<TData extends RowData> = CoreDataTableProps<ReactNode> &
	Omit<TableOptions<DataTableFeatures, TData>, "features">;

export function DataTable<TData extends RowData>(props: DataTableProps<TData>) {
	const { loading, testId, ...tableProps } = props;
	const tid = createTestId(testId);

	const table = useTable({
		...tableProps,
		features: dataTableFeatures,
	});

	return (
		<div data-component="data-table" data-slot="container" data-testid={tid("--container")}>
			<Table
				testId={tid("--table")}
				data-rows={loading ? undefined : table.getRowModel().rows?.length}
			>
				<thead data-testid={tid("--head")}>
					{table.getHeaderGroups().map((headerGroup, index) => (
						<tr
							key={headerGroup.id}
							data-testid={tid(`--header-row-${headerGroup.id}`)}
							data-row-id={headerGroup.id}
							data-row-index={index}
						>
							{headerGroup.headers.map((header) => {
								return (
									<th key={header.id} data-testid={tid(`--header-cell-${header.id}`)}>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</th>
								);
							})}
						</tr>
					))}
				</thead>
				<tbody data-testid={tid("--body")}>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row, rowIndex) => (
							<tr
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
								data-testid={tid(`--row-${row.id}`)}
								data-row-id={row.id}
								data-row-index={rowIndex}
							>
								{row.getVisibleCells().map((cell, cellIndex) => (
									<td
										key={cell.id}
										data-testid={tid(`--cell-${cell.id}`)}
										data-cell-id={cell.id}
										data-cell-index={cellIndex}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))
					) : (
						<tr data-testid={tid("--empty-row")}>
							<td
								colSpan={props.columns.length}
								data-component="data-table"
								data-slot="empty"
								data-testid={tid("--empty")}
							>
								{loading ? "Loading..." : "No results."}
							</td>
						</tr>
					)}
				</tbody>
			</Table>
			{loading && (
				<div data-component="data-table" data-slot="loading" data-testid={tid("--loading")}>
					<Loader size="xl" testId={tid("--loader")} />
				</div>
			)}
		</div>
	);
}
