// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Slider } from "./Slider";

const meta = {
	title: "Solid/Slider",
	component: Slider,
	tags: ["autodocs"],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteExample: Story = {
	args: {
		label: "Your productivity",
		min: 0,
		max: 100,
		step: 1,
		hint: "We'll never share your productivity with anyone else.",
	},
};

export const WithValue: Story = {
	args: {
		...CompleteExample.args,
		showValue: true,
	},
};

export const WithMarks: Story = {
	args: {
		...CompleteExample.args,
		showValue: false,
		showMarkDashes: true,
		marks: {
			0: "0",
			10: "10",
			20: "20",
			30: "30",
			40: "40",
			50: "50",
			60: "60",
			70: "70",
			80: "80",
			90: "90",
			100: "100",
		},
	},
};

export const Invalid: Story = {
	args: {
		...CompleteExample.args,
		error: "Invalid productivity",
	},
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
