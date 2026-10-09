import { cleanup, render, screen, waitFor } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { Menu } from "./Menu";
import { MenuItem } from "./MenuItem";
import { Button } from "../button";
import type { JSX } from "solid-js";

describe("Menu Component", () => {
	const MenuWrapper = (props: {
		children?: JSX.Element;
		onSelect?: (value: string) => void;
		closeOnSelect?: boolean;
		className?: string;
	}) => (
		<Menu
			trigger={(triggerProps: Record<string, unknown>) => (
				<Button {...triggerProps}>Open Menu</Button>
			)}
			{...props}
		>
			{props.children || (
				<>
					<MenuItem value="item1">Item 1</MenuItem>
					<MenuItem value="item2">Item 2</MenuItem>
				</>
			)}
		</Menu>
	);

	beforeEach(() => {
		cleanup();
	});

	it("renders trigger correctly", () => {
		render(() => <MenuWrapper />);
		expect(screen.getByRole("button", { name: "Open Menu" })).toBeInTheDocument();
	});

	it("opens menu when trigger is clicked", async () => {
		const user = userEvent.setup();
		render(() => <MenuWrapper />);

		const trigger = screen.getByRole("button", { name: "Open Menu" });
		await user.click(trigger);

		await waitFor(() => {
			expect(screen.getByRole("menu")).toBeVisible();
		});
	});

	it("renders menu items when opened", async () => {
		const user = userEvent.setup();
		render(() => <MenuWrapper />);

		const trigger = screen.getByRole("button", { name: "Open Menu" });
		await user.click(trigger);

		await waitFor(() => {
			expect(screen.getByRole("menuitem", { name: "Item 1" })).toBeVisible();
		});

		expect(screen.getByRole("menuitem", { name: "Item 2" })).toBeVisible();
	});

	it("calls onSelect when menu item is clicked", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		render(() => <MenuWrapper onSelect={onSelect} />);

		const trigger = screen.getByRole("button", { name: "Open Menu" });
		await user.click(trigger);

		await waitFor(() => {
			expect(screen.getByRole("menu")).toBeVisible();
		});

		const menuItem = screen.getByRole("menuitem", { name: "Item 1" });
		await user.click(menuItem);

		expect(onSelect).toHaveBeenCalledWith("item1");
	});

	it("calls onSelect with the clicked item when another item is keyboard-highlighted", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		render(() => <MenuWrapper onSelect={onSelect} />);

		screen.getByRole("button", { name: "Open Menu" }).focus();
		await user.keyboard("{ArrowDown}");

		await waitFor(() => {
			expect(screen.getByRole("menuitem", { name: "Item 1" })).toHaveAttribute("data-highlighted");
		});

		await user.click(screen.getByRole("menuitem", { name: "Item 2" }));

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onSelect).toHaveBeenCalledWith("item2");
	});

	it("closes menu after item selection when closeOnSelect is true", async () => {
		const user = userEvent.setup();
		render(() => <MenuWrapper closeOnSelect />);

		const trigger = screen.getByRole("button", { name: "Open Menu" });
		await user.click(trigger);

		await waitFor(() => {
			expect(screen.getByRole("menu")).toBeVisible();
		});

		const menuItem = screen.getByRole("menuitem", { name: "Item 1" });
		await user.click(menuItem);

		await waitFor(() => {
			expect(screen.queryByRole("menu")).not.toBeInTheDocument();
		});
	});

	it("keeps menu open after item selection when closeOnSelect is false", async () => {
		const user = userEvent.setup();
		render(() => <MenuWrapper closeOnSelect={false} />);

		const trigger = screen.getByRole("button", { name: "Open Menu" });
		await user.click(trigger);

		await waitFor(() => {
			expect(screen.getByRole("menu")).toBeVisible();
		});

		const menuItem = screen.getByRole("menuitem", { name: "Item 1" });
		await user.click(menuItem);

		// Menu should still be visible
		expect(screen.getByRole("menu")).toBeVisible();
	});

	it("applies custom className to menu content", async () => {
		const user = userEvent.setup();
		render(() => <MenuWrapper className="custom-menu-class" />);

		const trigger = screen.getByRole("button", { name: "Open Menu" });
		await user.click(trigger);

		await waitFor(() => {
			const menu = screen.getByRole("menu");
			expect(menu).toHaveClass("custom-menu-class");
		});
	});
});
