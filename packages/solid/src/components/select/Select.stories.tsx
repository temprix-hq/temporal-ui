import { Banana } from "lucide-solid";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createListCollection } from ".";
import { ThemePanels } from "../../stories/theme-panels";
import { Button } from "../button";
import { Popover } from "../popover";
import { Select } from "./Select";

const meta = {
	title: "Solid/Select",
	component: Select,
	tags: ["autodocs"],
	args: {},
	argTypes: {},
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const collection = createListCollection({
	items: [
		{ value: "apple", label: "Apple" },
		{ value: "banana", label: "Banana", icon: () => <Banana /> },
		{ value: "cherry", label: "Cherry" },
		{ value: "tomato", label: "Tomato" },
		{ value: "orange", label: "Orange" },
		{ value: "strawberry", label: "Strawberry" },
		{ value: "pineapple", label: "Pineapple" },
		{ value: "mango", label: "Mango" },
		{ value: "grape", label: "Grape" },
		{ value: "watermelon", label: "Watermelon" },
		{ value: "kiwi", label: "Kiwi" },
		{ value: "peach", label: "Peach" },
		{ value: "pear", label: "Pear" },
		{ value: "blueberry", label: "Blueberry" },
		{ value: "raspberry", label: "Raspberry" },
		{ value: "blackberry", label: "Blackberry" },
		{ value: "lemon", label: "Lemon" },
		{ value: "lime", label: "Lime" },
		{ value: "coconut", label: "Coconut" },
		{ value: "papaya", label: "Papaya" },
		{ value: "plum", label: "Plum" },
		{ value: "pomegranate", label: "Pomegranate" },
		{ value: "apricot", label: "Apricot" },
		{ value: "guava", label: "Guava" },
		{ value: "fig", label: "Fig" },
		{ value: "dragonfruit", label: "Dragon fruit" },
		{ value: "passionfruit", label: "Passion fruit" },
	],
});
export const Default: Story = {
	args: {
		className: "min-w-[250px]",
		collection,
		placeholder: "Select a fruit",
		label: "Fruits",
		portal: true,
	},
};

export const States: Story = {
	render: () => (
		<ThemePanels>
			{() => (
				<Select
					className="min-w-[250px]"
					collection={createListCollection({
						items: [
							{ value: "apple", label: "Apple" },
							{ value: "banana", label: "Banana" },
							{ value: "cherry", label: "Cherry" },
						],
					})}
					placeholder="Select a fruit"
					label="Fruits"
					portal={false}
				/>
			)}
		</ThemePanels>
	),
};

export const MaxDropdownHeight: Story = {
	...Default,
	args: {
		...Default.args,
		maxDropdownHeight: 150,
	},
};

export const Deselectable: Story = {
	...Default,
	args: {
		...Default.args,
		deselectable: true,
	},
};

export const AlignItemWithTrigger: Story = {
	args: {
		className: "min-w-[250px]",
		collection: createListCollection({
			items: [
				{ value: "small", label: "Small" },
				{ value: "medium", label: "Medium" },
				{ value: "large", label: "Large" },
				{ value: "xlarge", label: "Extra large" },
				{ value: "huge", label: "Unbelievably, comically, ridiculously large" },
			],
		}),
		placeholder: "Select a size",
		label: "Size",
		portal: true,
		alignItemWithTrigger: true,
		defaultValue: ["medium"],
	},
	render: (args: Story["args"]) => (
		<div class="flex min-h-screen items-center justify-center p-8">
			<Select {...args} />
		</div>
	),
};

export const AlignItemWithTriggerLongList: Story = {
	args: {
		className: "min-w-[250px]",
		collection,
		placeholder: "Select a fruit",
		label: "Fruits",
		portal: true,
		alignItemWithTrigger: true,
		defaultValue: ["raspberry"],
	},
	render: (args: Story["args"]) => (
		<div class="flex min-h-screen items-center justify-center p-8">
			<Select {...args} />
		</div>
	),
};

export const InsidePopover: Story = {
	args: {
		className: "min-w-[250px]",
		placeholder: "None",
		collection,
		label: "Group Members",
		portal: true,
		defaultOpen: true,
	},
	render: (args: Story["args"]) => (
		<div class="relative min-h-[480px] p-8">
			<div class="pointer-events-none absolute top-28 right-8 left-8 z-10 h-48 rounded-md border border-dashed bg-muted/80" />
			<Popover
				defaultOpen
				title="View options"
				trigger={(props) => <Button {...props}>View options</Button>}
			>
				<Select {...args} />
			</Popover>
		</div>
	),
};

export const Invalid: Story = {
	...Default,
	args: {
		...Default.args,
		error: "This is an error",
	},
};

export const LargeDataset: Story = {
	args: {
		...Default.args,
		searchable: true,
		searchPlaceholder: "Search items...",
		collection: createListCollection({
			items: Array.from({ length: 1000 }, (_, index) => ({
				value: `item-${index}`,
				label: `Item ${index}`,
			})),
		}),
	},
};

export const LargeDatasetWithGroups: Story = {
	args: {
		...Default.args,
		searchable: true,
		searchPlaceholder: "Search items...",
		collection: createListCollection({
			items: Array.from({ length: 1000 }, (_, index) => ({
				value: `item-${index}`,
				label: `Item ${index}`,
				group: `Group ${Math.floor(index / 10) + 1}`,
			})),
			groupBy: (item) => item.group,
		}),
	},
};
