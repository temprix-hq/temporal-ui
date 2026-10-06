// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from "@storybook/react-vite";
import { BoldIcon } from "lucide-react";
import { fn } from "storybook/test";
import { ThemePanels } from "../../stories/theme-panels";
import { Toggle, ToggleGroup, ToggleGroupItem, ToggleIndicator } from ".";

const meta = {
	title: "React/Toggle",
	component: Toggle,
	tags: ["autodocs"],
	args: { onPressedChange: fn() },
	argTypes: {
		pressed: {
			control: "boolean",
		},
		disabled: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: <BoldIcon size={16} />,
	},
};

export const Pressed: Story = {
	args: {
		...Default.args,
		pressed: true,
	},
};

export const Disabled: Story = {
	args: {
		...Default.args,
		disabled: true,
	},
};

export const WithText: Story = {
	args: {
		children: "Bold",
	},
};

export const WithIndicator: Story = {
	render: () => (
		<Toggle>
			<ToggleIndicator fallback={<BoldIcon size={16} />}>
				<BoldIcon size={16} strokeWidth={3} />
			</ToggleIndicator>
		</Toggle>
	),
};

export const WithField: Story = {
	args: {
		...Default.args,
		label: "Bold",
		hint: "Toggles bold formatting for the selection.",
	},
};

export const WithFieldError: Story = {
	args: {
		...WithField.args,
		error: "Bold formatting is not available in this context.",
	},
};

export const States: Story = {
	render: () => (
		<ThemePanels>
			<div className="flex flex-col gap-4">
				<div className="flex flex-wrap items-center gap-2">
					<Toggle>
						<BoldIcon size={16} />
					</Toggle>
					<Toggle pressed>
						<BoldIcon size={16} />
					</Toggle>
					<Toggle disabled>
						<BoldIcon size={16} />
					</Toggle>
					<Toggle pressed disabled>
						<BoldIcon size={16} />
					</Toggle>
				</div>
				<ToggleGroup variant="segmented" defaultValue={["two"]}>
					<ToggleGroupItem value="one">One</ToggleGroupItem>
					<ToggleGroupItem value="two">Two</ToggleGroupItem>
					<ToggleGroupItem value="three">Three</ToggleGroupItem>
				</ToggleGroup>
			</div>
		</ThemePanels>
	),
};
