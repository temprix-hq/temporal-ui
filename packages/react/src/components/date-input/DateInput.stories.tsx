import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { ThemePanels } from "../../stories/theme-panels";
import { Calendar, DateInput, type DateInputProps } from ".";

const rangePresets = {
	last7Days: "Last 7 days",
	last30Days: "Last 30 days",
	thisMonth: "This month",
} satisfies NonNullable<DateInputProps["presets"]>;

const meta = {
	title: "React/Date Input",
	component: DateInput,
	tags: ["autodocs"],
	argTypes: {
		selectionMode: {
			control: "select",
			options: ["single", "multiple", "range"],
		},
	},
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		fixedWeeks: true,
		closeOnSelect: true,
		disabled: false,
		numOfMonths: 1,
		outsideDaySelectable: false,
		selectionMode: "single",
	},
};

export const Controlled: Story = {
	...Default.args,
	render: (args) => {
		const [value, setValue] = React.useState<string[]>(["2024-01-01"]);
		return <DateInput {...args} value={value} onValueChange={setValue} />;
	},
};

export const InputRange: Story = {
	args: {
		selectionMode: "range",
		numOfMonths: 2,
		fixedWeeks: true,
		outsideDaySelectable: true,
	},
};

export const RangeWithPresets: Story = {
	args: {
		...InputRange.args,
		label: "Booking range",
		defaultOpen: true,
		presets: rangePresets,
	},
};

export const WithStartSection: Story = {
	args: {
		startSection: <CalendarIcon className="size-5" />,
	},
};

export const WithEndSection: Story = {
	args: {
		endSection: <CalendarIcon className="size-5" />,
	},
};

export const CalendarSingle: Story = {
	args: {
		className: "w-[250px]",
	},
	render: (args) => <Calendar {...args} />,
};

export const CalendarRange: Story = {
	args: {
		selectionMode: "range",
		numOfMonths: 2,
		className: "w-[550px]",
		fixedWeeks: true,
		outsideDaySelectable: true,
	},
	render: (args) => <Calendar {...args} />,
};

export const States: Story = {
	render: () => (
		<ThemePanels>
			<div className="flex flex-col gap-4">
				<DateInput label="Date" placeholder="Pick a date" fixedWeeks />
				<Calendar className="w-[250px]" fixedWeeks />
			</div>
		</ThemePanels>
	),
};
