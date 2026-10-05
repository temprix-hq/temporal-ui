// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home } from "lucide-react";
import { Avatar } from "../avatar";
import { Box } from "../box";
import { NavMain } from "./examples/NavMain";
import { NavProjects } from "./examples/NavProjects";
import { NavUser } from "./examples/NavUser";
import { TeamSwitcher } from "./examples/TeamSwitcher";
import { Sidebar } from "./Sidebar";
import {
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
} from "./SidebarComponent";
import { SidebarMenu, SidebarMenuItem, SidebarMenuLink } from "./SidebarMenu";
import { ThemePanels } from "../../stories/theme-panels";
import { SidebarProvider } from "./SidebarProvider";
import { SidebarRail } from "./SidebarRail";
import { SidebarTrigger } from "./SidebarTrigger";
import { data } from "./examples/data";

const meta = {
	title: "React/Sidebar",
	component: Sidebar,
	tags: ["autodocs"],
	args: {
		side: "left",
		variant: "sidebar",
		collapsible: "icon",
	},
	argTypes: {
		side: {
			control: "inline-radio",
			options: ["left", "right"],
		},
		variant: {
			control: "inline-radio",
			options: ["sidebar", "inset", "floating"],
		},
		collapsible: {
			control: "inline-radio",
			options: ["icon", "none", "offcanvas"],
		},
	},
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

export const Default: Story = {
	args: {
		side: "left",
		variant: "sidebar",
		collapsible: "icon",
	},
	render: (args) => (
		<Box className="">
			<SidebarProvider className="">
				<AppSidebar {...args} />
				<SidebarInset>
					<SidebarTrigger />
					{args.children}
				</SidebarInset>
			</SidebarProvider>
		</Box>
	),
};

export const Inset: Story = {
	args: {
		side: "left",
		variant: "inset",
		collapsible: "icon",
	},
	render: (args) => (
		<Box className="">
			<SidebarProvider className="">
				<AppSidebar {...args} />
				<SidebarInset>
					<SidebarTrigger />
					{args.children}
				</SidebarInset>
			</SidebarProvider>
		</Box>
	),
};

/**
 * Collapsed icon mode comparison for menu links.
 *
 * - Default rows keep `p-2` padding for small lucide icons.
 * - Use `flush` when the collapsed representation should fill the 32×32 slot (avatars, large icons).
 * - Do not use `size="lg"` just for collapsed padding — use `flush` instead.
 */
export const FlushCollapsed: Story = {
	args: {
		side: "left",
		variant: "sidebar",
		collapsible: "icon",
	},
	render: (args) => (
		<Box className="">
			<SidebarProvider className="" defaultOpen={false}>
				<Sidebar {...args}>
					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupLabel>Collapsed icon mode</SidebarGroupLabel>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuLink href="#default">
										<Home />
										<span>Default icon link</span>
									</SidebarMenuLink>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuLink href="#avatar" flush>
										<Avatar name="Jane Doe" size="md" />
										<span>Flush avatar link</span>
									</SidebarMenuLink>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuLink href="#emoji" flush>
										<span aria-hidden="true" className="text-lg leading-none">
											🚀
										</span>
										<span>Flush emoji link</span>
									</SidebarMenuLink>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroup>
					</SidebarContent>
					<SidebarRail />
				</Sidebar>
				<SidebarInset>
					<SidebarTrigger />
				</SidebarInset>
			</SidebarProvider>
		</Box>
	),
};

export const States: Story = {
	render: () => (
		<ThemePanels>
			<div
				data-component="sidebar"
				className="bg-sidebar text-sidebar-foreground w-60 rounded-lg p-2"
			>
				<SidebarMenu>
					<SidebarGroupLabel className="px-2">Navigation</SidebarGroupLabel>
					<SidebarMenuItem>
						<SidebarMenuLink href="#states">
							<Home />
							<span>Default item</span>
						</SidebarMenuLink>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuLink href="#states" isActive>
							<Home />
							<span>Active item</span>
						</SidebarMenuLink>
					</SidebarMenuItem>
				</SidebarMenu>
			</div>
		</ThemePanels>
	),
};
