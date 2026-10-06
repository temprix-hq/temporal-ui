// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Trash } from "lucide-react";
import { ThemePanels } from "../../stories/theme-panels";
import { Badge } from "./Badge";

const meta = {
	title: "React/Badge",
	component: Badge,
	tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		children: "Primary",
	},
};

export const Secondary: Story = {
	args: {
		variant: "secondary",
		children: "Secondary",
	},
};

export const Destructive: Story = {
	args: {
		variant: "destructive",
		children: "Destructive",
	},
};

export const Outline: Story = {
	args: {
		variant: "outline",
		children: "Outline",
	},
};

export const StartIcon: Story = {
	args: {
		variant: "destructive",
		children: (
			<>
				<Trash />
				Delete
			</>
		),
	},
};

export const EndIcon: Story = {
	args: {
		variant: "outline",
		children: (
			<>
				Open
				<ArrowRight />
			</>
		),
	},
};

export const States: Story = {
	render: () => (
		<ThemePanels>
			<div className="flex flex-wrap items-center gap-2">
				<Badge>Primary</Badge>
				<Badge variant="secondary">Secondary</Badge>
				<Badge variant="destructive">Destructive</Badge>
				<Badge variant="outline">Outline</Badge>
				<a href="#states">
					<Badge>Primary as link</Badge>
				</a>
				<a href="#states">
					<Badge variant="outline">Outline as link</Badge>
				</a>
			</div>
		</ThemePanels>
	),
};
