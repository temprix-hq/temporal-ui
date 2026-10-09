import {
	columnFilteringFeature,
	columnVisibilityFeature,
	createFilteredRowModel,
	createTable,
	filterFns,
	flexRender,
	rowSelectionFeature,
	tableFeatures,
	type AccessorKeyColumnDef as TanstackAccessorKeyColumnDef,
	type CellData,
	type ColumnDef as TanstackColumnDef,
	type ColumnVisibilityState,
	type RowData,
	type TableOptions,
} from "@tanstack/solid-table";
import type { DataTableProps as CoreDataTableProps } from "@temporal-ui/core/data-table";
import { testId } from "@temporal-ui/core/utils/string";
import { For, mergeProps, Show, splitProps, type JSX } from "solid-js";
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

export type DataTableProps<TData extends RowData> = CoreDataTableProps<JSX.Element> &
	Omit<TableOptions<DataTableFeatures, TData>, "features">;

export function DataTable<TData extends RowData>(props: DataTableProps<TData>) {
	const [controlProps, tableProps] = splitProps(props, ["loading", "testId"]);

	const table = createTable(mergeProps(tableProps, { features: dataTableFeatures }));

	const tid = testId(props.testId);

	return (
		<div data-component="data-table" data-slot="container" data-testid={tid("--container")}>
			<Table
				testId={tid("--table")}
				data-rows={controlProps.loading ? undefined : table.getRowModel().rows?.length}
			>
				<thead data-testid={tid("--head")}>
					<For each={table.getHeaderGroups()}>
						{(headerGroup, index) => (
							<tr
								data-testid={tid(`--header-row-${headerGroup.id}`)}
								data-row-id={headerGroup.id}
								data-row-index={index()}
							>
								<For each={headerGroup.headers}>
									{(header) => (
										<th data-testid={tid(`--header-cell-${header.id}`)}>
											<Show when={!header.isPlaceholder} fallback={null}>
												{flexRender(header.column.columnDef.header, header.getContext())}
											</Show>
										</th>
									)}
								</For>
							</tr>
						)}
					</For>
				</thead>
				<tbody data-testid={tid("--body")}>
					<Show when={table.getRowModel().rows?.length}>
						<For each={table.getRowModel().rows}>
							{(row, rowIndex) => (
								<tr
									data-state={row.getIsSelected() && "selected"}
									data-testid={tid(`--row-${row.id}`)}
									data-row-id={row.id}
									data-row-index={rowIndex()}
								>
									<For each={row.getVisibleCells()}>
										{(cell, cellIndex) => (
											<td
												data-testid={tid(`--cell-${cell.id}`)}
												data-cell-id={cell.id}
												data-cell-index={cellIndex()}
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</td>
										)}
									</For>
								</tr>
							)}
						</For>
					</Show>
					<Show when={!table.getRowModel().rows?.length}>
						<tr data-testid={tid("--empty-row")}>
							<td
								colSpan={props.columns.length}
								data-component="data-table"
								data-slot="empty"
								data-testid={tid("--empty")}
							>
								<Show when={controlProps.loading}>Loading...</Show>
								<Show when={!controlProps.loading}>No results.</Show>
							</td>
						</tr>
					</Show>
				</tbody>
			</Table>
			<Show when={controlProps.loading}>
				<div data-component="data-table" data-slot="loading" data-testid={tid("--loading")}>
					<Loader size="xl" testId={tid("--loader")} />
				</div>
			</Show>
		</div>
	);
}
