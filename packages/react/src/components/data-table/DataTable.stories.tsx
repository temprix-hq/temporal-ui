// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef, DataTableProps } from "./DataTable";
import { DataTable } from "./DataTable";

type Person = {
	name: string;
	title: string;
	email: string;
	role: string;
};

const DataTablePerson = (props: DataTableProps<Person>) => <DataTable<Person> {...props} />;

const meta = {
	title: "React/Data Table",
	component: DataTablePerson,
	tags: ["autodocs"],
} satisfies Meta<typeof DataTablePerson>;

export default meta;
type Story = StoryObj<typeof meta>;

const data: Person[] = [
	{ name: "Liam Johnson", title: "Software Engineer", email: "liam@example.com", role: "Admin" },
	{ name: "Olivia Smith", title: "Product Manager", email: "olivia@example.com", role: "Editor" },
	{ name: "Noah Williams", title: "UX Designer", email: "noah@example.com", role: "Viewer" },
	{ name: "Emma Brown", title: "Data Analyst", email: "emma@example.com", role: "Viewer" },
];

const columns: ColumnDef<Person>[] = [
	{ accessorKey: "name", header: "Name", cell: (info) => info.getValue() as string },
	{ accessorKey: "title", header: "Title", cell: (info) => info.getValue() as string },
	{ accessorKey: "email", header: "Email", cell: (info) => info.getValue() as string },
	{ accessorKey: "role", header: "Role", cell: (info) => info.getValue() as string },
];

export const Default: Story = {
	args: { columns, data },
};

export const Loading: Story = {
	args: { columns, data, loading: true },
};
