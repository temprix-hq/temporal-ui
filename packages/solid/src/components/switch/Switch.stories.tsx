// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { fn } from "storybook/test";
import { ThemePanels } from "../../stories/theme-panels";
import { Switch } from "./Switch";

const meta = {
	title: "Solid/Switch",
	component: Switch,
	tags: ["autodocs"],
	args: { onCheckedChange: fn() },
	argTypes: {
		disabled: {
			type: "boolean",
			control: "boolean",
		},
		checked: {
			type: "boolean",
			control: "boolean",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
		},
	},
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Enable notifications",
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
		hint: "Receive email updates about your account activity.",
	},
};

export const WithError: Story = {
	args: {
		...Default.args,
		error: "This field is required.",
	},
};

export const Checked: Story = {
	args: {
		...Default.args,
		checked: true,
	},
};

export const Small: Story = {
	args: {
		...Default.args,
		size: "sm",
	},
};

export const Large: Story = {
	args: {
		...Default.args,
		size: "lg",
	},
};

export const States: Story = {
	render: () => (
		<ThemePanels>
			{() => (
				<div class="flex flex-col gap-3">
					<Switch label="Off" />
					<Switch label="On" defaultChecked />
					<Switch label="Disabled" disabled />
					<Switch label="Disabled on" defaultChecked disabled />
					<Switch label="Small on" size="sm" defaultChecked />
					<Switch label="Large on" size="lg" defaultChecked />
				</div>
			)}
		</ThemePanels>
	),
};
