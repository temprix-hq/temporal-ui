// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { fn } from "storybook/test";
import { ThemePanels } from "../../stories/theme-panels";
import { Checkbox } from "./Checkbox";

const meta = {
	title: "Solid/Checkbox",
	component: Checkbox,
	tags: ["autodocs"],
	args: { onCheckedChange: fn() },
	argTypes: {
		disabled: {
			type: "boolean",
			control: "boolean",
		},
		checked: {
			control: {
				type: "select",
			},
			options: [undefined, true, false, "indeterminate"],
		},
	},
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Accept terms and conditions",
	},
};

export const Disabled: Story = {
	args: {
		...Default.args,
		disabled: true,
	},
};

export const WithHint: Story = {
	args: {
		...Default.args,
		hint: "You must accept the terms and conditions to continue.",
	},
};

export const WithError: Story = {
	args: {
		...Default.args,
		error: "This field is required.",
	},
};

export const Indeterminate: Story = {
	args: {
		...Default.args,
		checked: "indeterminate",
	},
};

export const States: Story = {
	render: () => (
		<ThemePanels>
			{() => (
				<div class="flex flex-col gap-3">
					<Checkbox label="Unchecked" />
					<Checkbox label="Checked" defaultChecked />
					<Checkbox label="Indeterminate" checked="indeterminate" />
					<Checkbox label="Disabled" disabled />
					<Checkbox label="Disabled checked" defaultChecked disabled />
				</div>
			)}
		</ThemePanels>
	),
};
