import { createSignal } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Tabs, TabsContent, TabsList, TabsTrigger, type TabsProps } from ".";
import { ThemePanels } from "../../stories/theme-panels";

const meta = {
	title: "Solid/Tabs",
	component: Tabs,
	tags: ["autodocs"],
	args: {
		variant: "default",
	},
	argTypes: {
		variant: {
			control: "radio",
			options: ["default", "pills"],
		},
	},
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const Basic = (props: TabsProps) => (
	<Tabs {...props}>
		<TabsList>
			<TabsTrigger value="react">React</TabsTrigger>
			<TabsTrigger value="vue">Vue</TabsTrigger>
			<TabsTrigger value="solid">Solid</TabsTrigger>
		</TabsList>
		<TabsContent value="react">React Content</TabsContent>
		<TabsContent value="vue">Vue Content</TabsContent>
		<TabsContent value="solid">Solid Content</TabsContent>
	</Tabs>
);

export const Default: Story = {
	render: (props: TabsProps) => <Basic {...props} />,
};

export const Pills: Story = {
	render: (props: TabsProps) => <Basic {...props} variant="pills" />,
};

export const Controlled: Story = {
	render: (props: TabsProps) => {
		const [value, setValue] = createSignal<string>("vue");
		return (
			<Tabs {...props} value={value()} onValueChange={setValue}>
				<TabsList>
					<TabsTrigger value="react">React</TabsTrigger>
					<TabsTrigger value="vue">Vue</TabsTrigger>
					<TabsTrigger value="solid">Solid</TabsTrigger>
				</TabsList>
			</Tabs>
		);
	},
};

export const States: Story = {
	render: () => (
		<ThemePanels>
			{() => (
				<div class="flex flex-col gap-6">
					<Basic defaultValue="react" />
					<Basic variant="pills" defaultValue="react" />
				</div>
			)}
		</ThemePanels>
	),
};
