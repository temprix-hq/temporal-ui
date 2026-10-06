// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { fn } from "storybook/test";
import { ThemePanels } from "../../stories/theme-panels";
import { Button } from "./Button";

const meta = {
	title: "Solid/Button",
	component: Button,
	tags: ["autodocs"],
	args: { onClick: fn() },
	argTypes: {
		variant: {
			control: "radio",
			options: ["primary", "secondary", "outline", "ghost", "destructive"],
		},
		size: {
			control: "radio",
			options: ["xs", "sm", "md", "lg", "xl"],
		},
		disabled: {
			control: "boolean",
		},
		loading: {
			control: "boolean",
		},
		icon: {
			control: "boolean",
		},
		className: {
			control: "text",
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		children: "Button",
		variant: "primary",
		size: "md",
		disabled: false,
		loading: false,
	},
};

export const Secondary: Story = {
	args: {
		...Primary.args,
		variant: "secondary",
	},
};

export const Destructive: Story = {
	args: {
		...Primary.args,
		variant: "destructive",
	},
};

export const Outline: Story = {
	args: {
		...Primary.args,
		variant: "outline",
	},
};

export const Ghost: Story = {
	args: {
		...Primary.args,
		variant: "ghost",
	},
};

export const Disabled: Story = {
	args: {
		...Primary.args,
		disabled: true,
	},
};

export const DisabledWithTooltip: Story = {
	args: {
		...Primary.args,
		disabled: true,
		disabledTooltip: "You cannot perform this action right now",
	},
	parameters: {
		docs: {
			description: {
				story: "Shows an explanatory tooltip when the button is disabled.",
			},
		},
	},
};

export const Loading: Story = {
	args: {
		...Primary.args,
		loading: true,
	},
};

export const SizeXS: Story = {
	args: {
		...Primary.args,
		size: "xs",
	},
};

export const SizeSM: Story = {
	args: {
		...Primary.args,
		size: "sm",
	},
};

export const SizeLG: Story = {
	args: {
		...Primary.args,
		size: "lg",
	},
};

export const SizeXL: Story = {
	args: {
		...Primary.args,
		size: "xl",
	},
};

export const Icon: Story = {
	args: {
		...Primary.args,
		icon: true,
		children: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<title>Test Icon</title>
				<path d="m9 18 6-6-6-6"></path>
			</svg>
		),
	},
};

export const States: Story = {
	render: () => (
		<ThemePanels>
			{() => (
				<div class="flex flex-wrap items-center gap-2">
					<Button>Primary</Button>
					<Button aria-pressed="true">Primary pressed</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="secondary" aria-pressed="true">
						Secondary pressed
					</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="ghost" aria-pressed="true">
						Ghost pressed
					</Button>
					<Button variant="destructive">Destructive</Button>
					<Button disabled>Disabled</Button>
				</div>
			)}
		</ThemePanels>
	),
};
