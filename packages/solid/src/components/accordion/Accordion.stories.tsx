import { ChevronDownIcon } from "lucide-solid";
import { createSignal } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { ThemePanels } from "../../stories/theme-panels";
import {
	Accordion,
	AccordionItem,
	AccordionItemContent,
	AccordionItemIndicator,
	AccordionItemTrigger,
	type AccordionProps,
} from "./Accordion";

const meta = {
	title: "Solid/Accordion",
	component: Accordion,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "radio",
			options: ["default", "boxed"],
		},
		collapsible: {
			control: "boolean",
		},
		multiple: {
			control: "boolean",
		},
		disabled: {
			control: "boolean",
		},
		orientation: {
			control: "radio",
			options: ["horizontal", "vertical"],
		},
	},
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
	{
		value: "item-1",
		title: "Is it accessible?",
		content: "Yes. It adheres to the WAI-ARIA design pattern.",
	},
	{
		value: "item-2",
		title: "Is it styled?",
		content: "Yes. It comes with default styles that match the other components' aesthetic.",
	},
	{
		value: "item-3",
		title: "Is it animated?",
		content: "Yes. It's animated by default, but you can disable it if you prefer.",
	},
];

const AccordionDemo = (props: AccordionProps) => (
	<Accordion {...props}>
		{items.map((item) => (
			<AccordionItem value={item.value}>
				<AccordionItemTrigger>
					{item.title}
					<AccordionItemIndicator>
						<ChevronDownIcon />
					</AccordionItemIndicator>
				</AccordionItemTrigger>
				<AccordionItemContent>
					<div style={{ "padding-bottom": "1rem" }}>{item.content}</div>
				</AccordionItemContent>
			</AccordionItem>
		))}
	</Accordion>
);

export const Default: Story = {
	render: (props: AccordionProps) => <AccordionDemo {...props} />,
};

export const DefaultOpen: Story = {
	render: (props: AccordionProps) => <AccordionDemo {...props} defaultValue={["item-1"]} />,
};

export const Multiple: Story = {
	render: (props: AccordionProps) => (
		<AccordionDemo {...props} multiple defaultValue={["item-1", "item-2"]} />
	),
};

export const Disabled: Story = {
	render: (props: AccordionProps) => <AccordionDemo {...props} disabled />,
};

export const Boxed: Story = {
	render: (props: AccordionProps) => (
		<AccordionDemo {...props} variant="boxed" defaultValue={["item-1"]} />
	),
};

export const Controlled: Story = {
	render: (props: AccordionProps) => {
		const [value, setValue] = createSignal<string[]>(["item-1"]);
		return <AccordionDemo {...props} value={value()} onValueChange={setValue} />;
	},
};

export const States: Story = {
	render: () => (
		<ThemePanels>{() => <AccordionDemo variant="boxed" defaultValue={["item-1"]} />}</ThemePanels>
	),
};
