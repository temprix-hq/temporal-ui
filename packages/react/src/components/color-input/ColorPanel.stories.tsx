// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from "@storybook/react-vite";
import type React from "react";
import { useState } from "react";
import { fn } from "storybook/test";
import { ThemePanels } from "../../stories/theme-panels";
import { Button } from "../button";
import { ColorPanel } from "./ColorPanel";

const meta = {
	title: "React/Color Panel",
	component: ColorPanel,
	tags: ["autodocs"],
	args: { onValueChange: fn() },
	render: (args) => (
		<div className="w-96">
			<ColorPanel {...args} />
		</div>
	),
} satisfies Meta<typeof ColorPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteExample: Story = {
	args: {
		defaultValue: "#2563eb",
		testId: "color-panel",
	},
};

function ControlledPanel() {
	const [value, setValue] = useState("#6876e7");
	return (
		<div className="flex flex-col gap-3">
			<ColorPanel value={value} onValueChange={setValue} />
			<p className="text-sm text-muted-foreground">
				Value: <code data-testid="color-panel-value">{value}</code>
			</p>
		</div>
	);
}

export const Controlled: Story = {
	render: () => <ControlledPanel />,
};

/** Inline in a fixed 352px container, with an app-level Done button in the hex row. */
export const InSmallContainer: Story = {
	render: () => (
		<div className="w-88 rounded-md border bg-popover p-3 text-popover-foreground shadow-md">
			<ColorPanel
				defaultValue="#6876e7"
				hexLabel="HEX"
				autoFocus
				actions={
					<Button variant="ghost" size="xs">
						Done
					</Button>
				}
				testId="color-panel"
			/>
		</div>
	),
};

/** `--color-input-area-height` resizes the area. */
export const TallerArea: Story = {
	render: () => (
		<div className="w-88">
			<ColorPanel
				defaultValue="#10b981"
				style={{ "--color-input-area-height": "260px" } as React.CSSProperties}
			/>
		</div>
	),
};

export const Disabled: Story = {
	args: {
		...CompleteExample.args,
		disabled: true,
	},
};

export const ReadOnly: Story = {
	args: {
		...CompleteExample.args,
		readOnly: true,
	},
};

export const States: Story = {
	render: () => (
		<ThemePanels>
			<div className="flex flex-col gap-6">
				<ColorPanel defaultValue="#2563eb" />
				<ColorPanel defaultValue="#2563eb" disabled />
			</div>
		</ThemePanels>
	),
};
