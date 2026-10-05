// noinspection JSUnusedGlobalSymbols

import { For } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { ThemePanels } from "../../stories/theme-panels";
import { Table } from "./Table";

const meta = {
	title: "Solid/Table",
	component: Table,
	tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const data = [
	{ name: "Liam Johnson", title: "Software Engineer", email: "liam@example.com", role: "Admin" },
	{ name: "Olivia Smith", title: "Product Manager", email: "olivia@example.com", role: "Editor" },
	{ name: "Noah Williams", title: "UX Designer", email: "noah@example.com", role: "Viewer" },
	{ name: "Emma Brown", title: "Data Analyst", email: "emma@example.com", role: "Viewer" },
];

export const Default: Story = {
	render: () => (
		<Table>
			<caption>A list of users.</caption>
			<thead>
				<tr>
					<th>Name</th>
					<th>Title</th>
					<th>Email</th>
					<th>Role</th>
				</tr>
			</thead>
			<tbody>
				<For each={data}>
					{(item) => (
						<tr>
							<td>{item.name}</td>
							<td>{item.title}</td>
							<td>{item.email}</td>
							<td>{item.role}</td>
						</tr>
					)}
				</For>
			</tbody>
			<tfoot>
				<tr>
					<td colSpan={4}>
						Showing {data.length} of {data.length}
					</td>
				</tr>
			</tfoot>
		</Table>
	),
};

export const States: Story = {
	render: () => (
		<ThemePanels>
			{() => (
				<Table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Role</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Liam Johnson</td>
							<td>Admin</td>
						</tr>
						<tr data-state="selected">
							<td>Olivia Smith</td>
							<td>Editor</td>
						</tr>
					</tbody>
				</Table>
			)}
		</ThemePanels>
	),
};
