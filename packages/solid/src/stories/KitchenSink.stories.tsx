// noinspection JSUnusedGlobalSymbols

import { BoldIcon, ChevronDownIcon, ItalicIcon, UnderlineIcon } from "lucide-solid";
import type { JSX } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
	Accordion,
	AccordionItem,
	AccordionItemContent,
	AccordionItemIndicator,
	AccordionItemTrigger,
} from "../components/accordion";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { Checkbox } from "../components/checkbox";
import { ColorInput } from "../components/color-input";
import { DateInput } from "../components/date-input";
import { Menu, MenuItem, MenuItemSeparator } from "../components/menu";
import { NumberInput } from "../components/number-input";
import { RadioGroup } from "../components/radio-group";
import { createListCollection, Select } from "../components/select";
import { Slider } from "../components/slider";
import { Stack } from "../components/stack";
import { Switch } from "../components/switch";
import { Table } from "../components/table";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "../components/tabs";
import { TextInput } from "../components/text-input";
import { Textarea } from "../components/textarea";
import { Toggle, ToggleGroup, ToggleGroupItem } from "../components/toggle";

const fruitCollection = createListCollection({
	items: [
		{ value: "apple", label: "Apple" },
		{ value: "banana", label: "Banana" },
		{ value: "cherry", label: "Cherry" },
		{ value: "mango", label: "Mango" },
	],
});

function ThemeFrame(props: { theme: "light" | "dark"; children: JSX.Element }) {
	return (
		<div
			class={`${props.theme} min-h-screen bg-background text-foreground p-6`}
			style={{ "color-scheme": props.theme }}
		>
			{props.children}
		</div>
	);
}

function Section(props: { title: string; children: JSX.Element }) {
	return (
		<Stack gap={3}>
			<h2 class="text-lg font-semibold tracking-tight">{props.title}</h2>
			{props.children}
		</Stack>
	);
}

function KitchenSinkPage() {
	return (
		<Stack gap={8} className="max-w-4xl">
			<Stack gap={1}>
				<h1 class="text-2xl font-semibold tracking-tight">Kitchen sink</h1>
				<p class="text-muted-foreground text-sm">
					Interactive controls for comparing rest, hover, pressed, and selected states.
				</p>
			</Stack>

			<Section title="Buttons">
				<Stack row gap={2} className="flex-wrap">
					<Button variant="primary">Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="destructive">Destructive</Button>
				</Stack>
			</Section>

			<Section title="Toggle">
				<Stack row gap={2} className="flex-wrap">
					<Toggle>
						<BoldIcon size={16} />
					</Toggle>
					<Toggle pressed>
						<ItalicIcon size={16} />
					</Toggle>
					<Toggle>
						<UnderlineIcon size={16} />
					</Toggle>
				</Stack>
			</Section>

			<Section title="Toggle group">
				<Stack gap={3}>
					<ToggleGroup defaultValue={["bold"]}>
						<ToggleGroupItem value="bold">
							<BoldIcon size={16} />
						</ToggleGroupItem>
						<ToggleGroupItem value="italic">
							<ItalicIcon size={16} />
						</ToggleGroupItem>
						<ToggleGroupItem value="underline">
							<UnderlineIcon size={16} />
						</ToggleGroupItem>
					</ToggleGroup>
					<ToggleGroup variant="segmented" defaultValue={["bold"]}>
						<ToggleGroupItem value="bold">
							<BoldIcon size={16} />
						</ToggleGroupItem>
						<ToggleGroupItem value="italic">
							<ItalicIcon size={16} />
						</ToggleGroupItem>
						<ToggleGroupItem value="underline">
							<UnderlineIcon size={16} />
						</ToggleGroupItem>
					</ToggleGroup>
				</Stack>
			</Section>

			<Section title="Inputs">
				<Stack gap={3} className="max-w-sm">
					<TextInput label="Email" placeholder="you@example.com" />
					<Textarea label="Message" placeholder="Type a message…" />
					<NumberInput label="Quantity" defaultValue={3} min={0} max={99} />
					<Select
						className="min-w-[250px]"
						label="Fruit"
						placeholder="Select a fruit"
						collection={fruitCollection}
					/>
					<DateInput label="Date" />
					<ColorInput label="Accent color" defaultValue="#3b82f6" />
				</Stack>
			</Section>

			<Section title="Selection">
				<Stack gap={3}>
					<Checkbox label="Accept terms" defaultChecked />
					<Checkbox label="Subscribe to updates" />
					<Switch label="Enable notifications" defaultChecked />
					<RadioGroup
						defaultValue="apple"
						items={[
							{ label: "Apple", value: "apple" },
							{ label: "Banana", value: "banana" },
							{ label: "Cherry", value: "cherry" },
						]}
					/>
				</Stack>
			</Section>

			<Section title="Tabs">
				<Stack gap={4}>
					<Tabs defaultValue="react">
						<TabsList>
							<TabsTrigger value="react">React</TabsTrigger>
							<TabsTrigger value="vue">Vue</TabsTrigger>
							<TabsTrigger value="solid">Solid</TabsTrigger>
							<TabsIndicator />
						</TabsList>
						<TabsContent value="react">React content</TabsContent>
						<TabsContent value="vue">Vue content</TabsContent>
						<TabsContent value="solid">Solid content</TabsContent>
					</Tabs>
					<Tabs variant="pills" defaultValue="react">
						<TabsList>
							<TabsTrigger value="react">React</TabsTrigger>
							<TabsTrigger value="vue">Vue</TabsTrigger>
							<TabsTrigger value="solid">Solid</TabsTrigger>
							<TabsIndicator />
						</TabsList>
						<TabsContent value="react">React content</TabsContent>
						<TabsContent value="vue">Vue content</TabsContent>
						<TabsContent value="solid">Solid content</TabsContent>
					</Tabs>
				</Stack>
			</Section>

			<Section title="Slider">
				<div class="max-w-sm">
					<Slider label="Intensity" min={0} max={100} />
				</div>
			</Section>

			<Section title="Accordion">
				<Accordion variant="boxed" defaultValue={["item-1"]}>
					<AccordionItem value="item-1">
						<AccordionItemTrigger>
							Is it accessible?
							<AccordionItemIndicator>
								<ChevronDownIcon />
							</AccordionItemIndicator>
						</AccordionItemTrigger>
						<AccordionItemContent>
							<div class="pb-4">Yes. It adheres to the WAI-ARIA design pattern.</div>
						</AccordionItemContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionItemTrigger>
							Is it styled?
							<AccordionItemIndicator>
								<ChevronDownIcon />
							</AccordionItemIndicator>
						</AccordionItemTrigger>
						<AccordionItemContent>
							<div class="pb-4">Yes. Styles match the rest of the system.</div>
						</AccordionItemContent>
					</AccordionItem>
				</Accordion>
			</Section>

			<Section title="Menu">
				<Menu
					trigger={(props) => (
						<Button variant="outline" {...props}>
							Open menu
						</Button>
					)}
					className="min-w-40"
				>
					<MenuItem value="new">New file</MenuItem>
					<MenuItem value="open">Open file</MenuItem>
					<MenuItemSeparator />
					<MenuItem value="exit">Exit</MenuItem>
				</Menu>
			</Section>

			<Section title="Badges">
				<Stack row gap={2} className="flex-wrap">
					<Badge>Primary</Badge>
					<Badge variant="secondary">Secondary</Badge>
					<Badge variant="destructive">Destructive</Badge>
					<Badge variant="outline">Outline</Badge>
				</Stack>
			</Section>

			<Section title="Table">
				<Table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Role</th>
						</tr>
					</thead>
					<tbody>
						<tr data-state="selected">
							<td>Liam Johnson</td>
							<td>Admin</td>
						</tr>
						<tr>
							<td>Olivia Smith</td>
							<td>Editor</td>
						</tr>
						<tr>
							<td>Noah Williams</td>
							<td>Viewer</td>
						</tr>
					</tbody>
				</Table>
			</Section>
		</Stack>
	);
}

const meta = {
	title: "Solid/Kitchen Sink",
	parameters: {
		layout: "fullscreen",
		backgrounds: { disable: true },
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
	parameters: {
		themes: { themeOverride: "light" },
	},
	render: () => (
		<ThemeFrame theme="light">
			<KitchenSinkPage />
		</ThemeFrame>
	),
};

export const Dark: Story = {
	parameters: {
		themes: { themeOverride: "dark" },
	},
	render: () => (
		<ThemeFrame theme="dark">
			<KitchenSinkPage />
		</ThemeFrame>
	),
};
