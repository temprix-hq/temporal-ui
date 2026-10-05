import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
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
	title: "React/Accordion",
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
			<AccordionItem key={item.value} value={item.value}>
				<AccordionItemTrigger>
					{item.title}
					<AccordionItemIndicator>
						<ChevronDownIcon />
					</AccordionItemIndicator>
				</AccordionItemTrigger>
				<AccordionItemContent>
					<div style={{ paddingBottom: "1rem" }}>{item.content}</div>
				</AccordionItemContent>
			</AccordionItem>
		))}
	</Accordion>
);

export const Default: Story = {
	render: (props) => <AccordionDemo {...props} />,
};

export const DefaultOpen: Story = {
	render: (props) => <AccordionDemo {...props} defaultValue={["item-1"]} />,
};

export const Multiple: Story = {
	render: (props) => <AccordionDemo {...props} multiple defaultValue={["item-1", "item-2"]} />,
};

export const Disabled: Story = {
	render: (props) => <AccordionDemo {...props} disabled />,
};

export const Boxed: Story = {
	render: (props) => <AccordionDemo {...props} variant="boxed" defaultValue={["item-1"]} />,
};

export const Controlled: Story = {
	render: (props) => {
		const [value, setValue] = useState<string[]>(["item-1"]);
		return <AccordionDemo {...props} value={value} onValueChange={setValue} />;
	},
};

export const States: Story = {
	render: () => (
		<ThemePanels>
			<AccordionDemo variant="boxed" defaultValue={["item-1"]} />
		</ThemePanels>
	),
};
