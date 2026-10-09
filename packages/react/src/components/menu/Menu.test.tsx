import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { Button } from "../button";
import { Menu } from "./Menu";
import { MenuItem } from "./MenuItem";

describe("Menu Component", () => {
	const defaultProps = {
		trigger: <Button>Open Menu</Button>,
		children: (
			<>
				<MenuItem value="item1">Item 1</MenuItem>
				<MenuItem value="item2">Item 2</MenuItem>
			</>
		),
	};

	beforeEach(() => {
		cleanup();
	});

	it("renders trigger correctly", () => {
		render(<Menu {...defaultProps} />);
		expect(screen.getByRole("button", { name: "Open Menu" })).toBeInTheDocument();
	});

	it("opens menu when trigger is clicked", async () => {
		const user = userEvent.setup();
		render(<Menu {...defaultProps} />);

		const trigger = screen.getByRole("button", { name: "Open Menu" });
		await user.click(trigger);

		await waitFor(() => {
			expect(screen.getByRole("menu")).toBeVisible();
		});
	});

	it("renders menu items when opened", async () => {
		const user = userEvent.setup();
		render(<Menu {...defaultProps} />);

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
		render(<Menu {...defaultProps} onSelect={onSelect} />);

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
		render(<Menu {...defaultProps} onSelect={onSelect} />);

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
		render(<Menu {...defaultProps} closeOnSelect />);

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
		render(<Menu {...defaultProps} closeOnSelect={false} />);

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
		render(<Menu {...defaultProps} className="custom-menu-class" />);

		const trigger = screen.getByRole("button", { name: "Open Menu" });
		await user.click(trigger);

		await waitFor(() => {
			const menu = screen.getByRole("menu");
			expect(menu).toHaveClass("custom-menu-class");
		});
	});

	it("closes menu on escape key", async () => {
		const user = userEvent.setup();
		render(<Menu {...defaultProps} />);

		const trigger = screen.getByRole("button", { name: "Open Menu" });
		await user.click(trigger);

		await waitFor(() => {
			expect(screen.getByRole("menu")).toBeVisible();
		});

		await user.keyboard("{Escape}");

		await waitFor(() => {
			expect(screen.queryByRole("menu")).not.toBeInTheDocument();
		});
	});
});
