import { fireEvent, render, screen } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import {
	DataTable,
	dataTableFeatures,
	type AccessorKeyColumnDef,
	type ColumnDef,
	type VisibilityState,
} from "./DataTable";

type Person = { id: number; name: string; email: string };

// Mock data for testing
const mockData: Person[] = [
	{ id: 1, name: "John Doe", email: "john@example.com" },
	{ id: 2, name: "Jane Smith", email: "jane@example.com" },
];

const mockColumns: ColumnDef<Person>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
];

describe("DataTable", () => {
	it("declares the fixed feature set", () => {
		expect(Object.keys(dataTableFeatures)).toEqual([
			"columnVisibilityFeature",
			"rowSelectionFeature",
			"columnFilteringFeature",
			"filteredRowModel",
			"filterFns",
		]);
	});

	it("renders table elements properly", () => {
		render(() => <DataTable data={mockData} columns={mockColumns} testId="test-table" />);

		expect(screen.getByTestId("test-table--container")).toBeInTheDocument();
		expect(screen.getByTestId("test-table--table")).toBeInTheDocument();

		// Check data rows
		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("john@example.com")).toBeInTheDocument();
		expect(screen.getByText("Jane Smith")).toBeInTheDocument();
		expect(screen.getByText("jane@example.com")).toBeInTheDocument();
	});

	it("renders loading state when loading is true", () => {
		render(() => (
			<DataTable data={mockData} columns={mockColumns} loading={true} testId="test-table" />
		));

		expect(screen.getByTestId("test-table--loading")).toBeInTheDocument();
	});

	it("does not render loading state when loading is false", () => {
		render(() => (
			<DataTable data={mockData} columns={mockColumns} loading={false} testId="test-table" />
		));

		expect(screen.queryByTestId("test-table--loading")).not.toBeInTheDocument();
	});

	it("renders the empty row when there is no data", () => {
		render(() => <DataTable data={[]} columns={mockColumns} testId="test-table" />);

		expect(screen.getByTestId("test-table--empty")).toHaveTextContent("No results.");
	});

	it("updates rows when the data prop changes", () => {
		const [data, setData] = createSignal(mockData);
		render(() => <DataTable data={data()} columns={mockColumns} testId="test-table" />);

		expect(screen.getByTestId("test-table--table")).toHaveAttribute("data-rows", "2");

		setData(mockData.slice(1));

		expect(screen.getByTestId("test-table--table")).toHaveAttribute("data-rows", "1");
		expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
		expect(screen.getByText("Jane Smith")).toBeInTheDocument();
	});

	it("supports controlled column visibility through a state getter", () => {
		const columns: AccessorKeyColumnDef<Person>[] = [
			{
				accessorKey: "name",
				header: ({ column }) => (
					<button
						type="button"
						data-testid="hide-name"
						onClick={() => column.toggleVisibility(false)}
					>
						Name
					</button>
				),
			},
			{ accessorKey: "email", header: "Email" },
		];
		const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>({
			name: true,
			email: false,
		});
		const onColumnVisibilityChange = vi.fn(setColumnVisibility);

		render(() => (
			<DataTable
				data={mockData}
				columns={columns}
				testId="test-table"
				state={{
					get columnVisibility() {
						return columnVisibility();
					},
				}}
				onColumnVisibilityChange={onColumnVisibilityChange}
			/>
		));

		expect(screen.getByTestId("test-table--header-cell-name")).toBeInTheDocument();
		expect(screen.queryByTestId("test-table--header-cell-email")).not.toBeInTheDocument();
		expect(screen.queryByText("john@example.com")).not.toBeInTheDocument();

		setColumnVisibility({ name: true, email: true });

		expect(screen.getByTestId("test-table--header-cell-email")).toBeInTheDocument();
		expect(screen.getByText("john@example.com")).toBeInTheDocument();

		fireEvent.click(screen.getByTestId("hide-name"));

		expect(onColumnVisibilityChange).toHaveBeenCalledTimes(1);
		expect(columnVisibility()).toEqual({ name: false, email: true });
		expect(screen.queryByTestId("test-table--header-cell-name")).not.toBeInTheDocument();
		expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
	});

	it("marks selected rows with data-state", () => {
		render(() => (
			<DataTable
				data={mockData}
				columns={mockColumns}
				testId="test-table"
				state={{ rowSelection: { "1": true } }}
			/>
		));

		expect(screen.getByTestId("test-table--row-0")).not.toHaveAttribute("data-state", "selected");
		expect(screen.getByTestId("test-table--row-1")).toHaveAttribute("data-state", "selected");
	});

	it("filters rows by column filter state", () => {
		render(() => (
			<DataTable
				data={mockData}
				columns={mockColumns}
				testId="test-table"
				state={{ columnFilters: [{ id: "name", value: "jane" }] }}
			/>
		));

		expect(screen.getByTestId("test-table--table")).toHaveAttribute("data-rows", "1");
		expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
		expect(screen.getByText("Jane Smith")).toBeInTheDocument();
	});
});
