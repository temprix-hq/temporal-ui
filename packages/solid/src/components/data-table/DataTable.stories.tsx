import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { DataTable, type ColumnDef, type DataTableProps } from "./";

type Person = {
	name: string;
	title: string;
	email: string;
	role: string;
};

const meta = {
	title: "Solid/Data Table",
	component: DataTable<Person>,
	tags: ["autodocs"],
} satisfies Meta<typeof DataTable<Person>>;

export default meta;
type Story = StoryObj<typeof meta>;

const data: Person[] = [
	{ name: "Liam Johnson", title: "Software Engineer", email: "liam@example.com", role: "Admin" },
	{ name: "Olivia Smith", title: "Product Manager", email: "olivia@example.com", role: "Editor" },
	{ name: "Noah Williams", title: "UX Designer", email: "noah@example.com", role: "Viewer" },
	{ name: "Emma Brown", title: "Data Analyst", email: "emma@example.com", role: "Viewer" },
];

const columns: ColumnDef<Person>[] = [
	{ accessorKey: "name", header: "Name" },
	{ accessorKey: "title", header: "Title" },
	{ accessorKey: "email", header: "Email" },
	{ accessorKey: "role", header: "Role" },
];

export const Default: Story = {
	args: { columns, data },
	render: (args: DataTableProps<Person>) => <DataTable<Person> {...args} />,
};

export const Loading: Story = {
	...Default.args,
	args: { columns, data, loading: true },
};
