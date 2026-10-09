import { CalendarIcon } from "lucide-solid";
import { createSignal } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { ThemePanels } from "../../stories/theme-panels";
import { Calendar, DateInput, type DateInputProps } from ".";

const rangePresets = {
	last7Days: "Last 7 days",
	last30Days: "Last 30 days",
	thisMonth: "This month",
} satisfies NonNullable<DateInputProps["presets"]>;

const meta = {
	title: "Solid/Date Input",
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
	render: (args: DateInputProps) => {
		const [value, setValue] = createSignal<string[]>(["2024-01-01"]);
		return <DateInput {...args} value={value()} onValueChange={setValue} />;
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
		startSection: <CalendarIcon class="size-5" />,
	},
};

export const WithEndSection: Story = {
	args: {
		endSection: <CalendarIcon class="size-5" />,
	},
};

export const CalendarSingle: Story = {
	render: () => <Calendar className="w-[250px]" />,
};

export const CalendarRange: Story = {
	render: () => (
		<Calendar
			selectionMode="range"
			numOfMonths={2}
			className="w-[550px]"
			fixedWeeks
			outsideDaySelectable
		/>
	),
};

export const States: Story = {
	render: () => (
		<ThemePanels>
			{() => (
				<div class="flex flex-col gap-4">
					<DateInput label="Date" placeholder="Pick a date" fixedWeeks />
					<Calendar className="w-[250px]" fixedWeeks />
				</div>
			)}
		</ThemePanels>
	),
};
