// noinspection JSUnusedGlobalSymbols

import { BoldIcon } from "lucide-solid";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { fn } from "storybook/test";
import { ThemePanels } from "../../stories/theme-panels";
import { Toggle, ToggleIndicator, type ToggleProps } from "./Toggle";
import { ToggleGroup, ToggleGroupItem } from ".";

const meta = {
	title: "Solid/Toggle",
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

const iconToggle = (args: ToggleProps) => (
	<div class="w-fit">
		<Toggle {...args}>
			<BoldIcon size={16} />
		</Toggle>
	</div>
);

export const Default: Story = {
	render: iconToggle,
};

export const Pressed: Story = {
	args: { pressed: true },
	render: iconToggle,
};

export const Disabled: Story = {
	args: { disabled: true },
	render: iconToggle,
};

export const WithText: Story = {
	render: (args: ToggleProps) => (
		<div class="w-fit">
			<Toggle {...args}>Bold</Toggle>
		</div>
	),
};

export const WithIndicator: Story = {
	render: () => (
		<div class="w-fit">
			<Toggle>
				<ToggleIndicator fallback={<BoldIcon size={16} />}>
					<BoldIcon size={16} stroke-width={3} />
				</ToggleIndicator>
			</Toggle>
		</div>
	),
};

export const WithField: Story = {
	render: (args: ToggleProps) => (
		<div class="w-fit">
			<Toggle {...args} label="Bold" hint="Toggles bold formatting for the selection.">
				<BoldIcon size={16} />
			</Toggle>
		</div>
	),
};

export const WithFieldError: Story = {
	render: (args: ToggleProps) => (
		<div class="w-fit">
			<Toggle
				{...args}
				label="Bold"
				hint="Toggles bold formatting for the selection."
				error="Bold formatting is not available in this context."
			>
				<BoldIcon size={16} />
			</Toggle>
		</div>
	),
};

export const States: Story = {
	render: () => (
		<ThemePanels>
			{() => (
				<div class="flex flex-col gap-4">
					<div class="flex flex-wrap items-center gap-2">
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
			)}
		</ThemePanels>
	),
};
