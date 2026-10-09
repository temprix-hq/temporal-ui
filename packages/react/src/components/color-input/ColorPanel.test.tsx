import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ColorPanel } from "./ColorPanel";

const hexInput = () => screen.getByTestId<HTMLInputElement>("cp--hex-input");

describe("ColorPanel", () => {
	beforeEach(() => {
		cleanup();
	});

	it("renders the hex field, area and hue slider inline", () => {
		render(<ColorPanel testId="cp" defaultValue="#2563eb" className="extra" />);

		const root = screen.getByTestId("cp--root");
		expect(root).toHaveAttribute("data-scope", "color-input");
		expect(root).toHaveAttribute("data-part", "panel");
		expect(root).toHaveClass("extra");
		expect(screen.getByTestId("cp--area")).toBeInTheDocument();
		expect(screen.getByTestId("cp--area-thumb")).toHaveAttribute("role", "slider");
		expect(screen.getByTestId("cp--channel-slider")).toHaveAttribute("data-channel", "hue");
		expect(screen.getByTestId("cp--channel-slider-thumb")).toHaveAttribute("role", "slider");
		expect(hexInput()).toHaveValue("#2563eb");
		expect(hexInput()).toHaveAttribute("data-part", "hex-input");
		expect(screen.getByTestId("cp--root").querySelector('[data-part="trigger"]')).toBeNull();
	});

	it("labels the hex field with hexLabel and renders actions in the hex row", () => {
		render(<ColorPanel testId="cp" hexLabel="HEX" actions={<button type="button">Done</button>} />);

		expect(screen.getByLabelText("HEX")).toBe(hexInput());
		expect(screen.getByTestId("cp--hex-row")).toContainElement(
			screen.getByRole("button", { name: "Done" }),
		);
	});

	it("defaults to black and the Hex label", () => {
		render(<ColorPanel testId="cp" />);
		expect(screen.getByLabelText("Hex")).toHaveValue("#000000");
	});

	it("normalizes value input to lowercase #rrggbb", () => {
		render(<ColorPanel testId="cp" defaultValue="ABC" />);
		expect(hexInput()).toHaveValue("#aabbcc");
	});

	it("commits hex text on Enter as lowercase #rrggbb (uncontrolled)", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(<ColorPanel testId="cp" defaultValue="#000000" onValueChange={onValueChange} />);

		await user.clear(hexInput());
		await user.type(hexInput(), "FF8800{Enter}");

		expect(onValueChange).toHaveBeenLastCalledWith("#ff8800");
		expect(hexInput()).toHaveValue("#ff8800");
	});

	it("accepts 3-digit shorthand and commits on blur", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(<ColorPanel testId="cp" defaultValue="#000000" onValueChange={onValueChange} />);

		await user.clear(hexInput());
		await user.type(hexInput(), "#0f0");
		expect(onValueChange).not.toHaveBeenCalled();
		await user.tab();

		expect(onValueChange).toHaveBeenLastCalledWith("#00ff00");
		expect(hexInput()).toHaveValue("#00ff00");
	});

	it("ignores invalid text and restores the last valid value on blur", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(<ColorPanel testId="cp" defaultValue="#2563eb" onValueChange={onValueChange} />);

		await user.clear(hexInput());
		await user.type(hexInput(), "red{Enter}");
		expect(hexInput()).toHaveValue("red");
		await user.tab();

		expect(onValueChange).not.toHaveBeenCalled();
		expect(hexInput()).toHaveValue("#2563eb");
	});

	it("keeps Enter from submitting a surrounding form", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
		render(
			<form onSubmit={onSubmit}>
				<ColorPanel testId="cp" defaultValue="#000000" />
			</form>,
		);

		await user.type(hexInput(), "{Enter}");
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("follows a controlled value", async () => {
		const user = userEvent.setup();
		const seen: string[] = [];
		function Controlled() {
			const [value, setValue] = useState("#2563eb");
			seen.push(value);
			return (
				<>
					<ColorPanel testId="cp" value={value} onValueChange={setValue} />
					<button type="button" onClick={() => setValue("#10b981")}>
						set
					</button>
				</>
			);
		}
		render(<Controlled />);

		expect(hexInput()).toHaveValue("#2563eb");
		await user.click(screen.getByRole("button", { name: "set" }));
		await waitFor(() => expect(hexInput()).toHaveValue("#10b981"));

		await user.clear(hexInput());
		await user.type(hexInput(), "#ff0000{Enter}");
		expect(seen.at(-1)).toBe("#ff0000");
		expect(hexInput()).toHaveValue("#ff0000");
	});

	it("keeps a controlled value when the owner does not update it", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(<ColorPanel testId="cp" value="#2563eb" onValueChange={onValueChange} />);

		await user.clear(hexInput());
		await user.type(hexInput(), "#ff0000{Enter}");

		expect(onValueChange).toHaveBeenLastCalledWith("#ff0000");
		expect(hexInput()).toHaveValue("#2563eb");
	});

	it("changes saturation and brightness with arrow keys on the area", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(<ColorPanel testId="cp" defaultValue="#808080" onValueChange={onValueChange} />);

		screen.getByTestId("cp--area-thumb").focus();
		await user.keyboard("{ArrowUp}");

		expect(onValueChange).toHaveBeenCalledTimes(1);
		const [brighter] = onValueChange.mock.lastCall ?? [];
		expect(brighter).toMatch(/^#[0-9a-f]{6}$/);
		expect(brighter).not.toBe("#808080");
		expect(hexInput()).toHaveValue(brighter);
	});

	it("changes the hue with arrow keys on the slider", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(<ColorPanel testId="cp" defaultValue="#ff0000" onValueChange={onValueChange} />);

		const thumb = screen.getByTestId("cp--channel-slider-thumb");
		thumb.focus();
		await user.keyboard("{ArrowRight}");

		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange.mock.lastCall?.[0]).toMatch(/^#ff[0-9a-f]{2}00$/);
		expect(thumb).toHaveAttribute("aria-valuenow", "1");
	});

	it("lets Escape propagate to the host from the hex field, area and slider", async () => {
		const user = userEvent.setup();
		const onHostKeyDown = vi.fn((event: React.KeyboardEvent) => event.defaultPrevented);
		render(
			<div onKeyDown={(event) => onHostKeyDown(event)}>
				<ColorPanel testId="cp" defaultValue="#2563eb" />
			</div>,
		);

		for (const id of ["cp--hex-input", "cp--area-thumb", "cp--channel-slider-thumb"]) {
			screen.getByTestId(id).focus();
			await user.keyboard("{Escape}");
		}

		expect(onHostKeyDown).toHaveBeenCalledTimes(3);
		// Not prevented by the panel either.
		for (const result of onHostKeyDown.mock.results) expect(result.value).toBe(false);
	});

	it("still lets the host stop Escape after the panel let it through", async () => {
		const user = userEvent.setup();
		const outer = vi.fn();
		render(
			<div onKeyDown={outer}>
				<div onKeyDown={(event) => event.stopPropagation()}>
					<ColorPanel testId="cp" defaultValue="#2563eb" />
				</div>
			</div>,
		);

		screen.getByTestId("cp--area-thumb").focus();
		await user.keyboard("{Escape}");
		expect(outer).not.toHaveBeenCalled();
	});

	it("disables every control", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<ColorPanel testId="cp" defaultValue="#2563eb" disabled onValueChange={onValueChange} />,
		);

		expect(hexInput()).toBeDisabled();
		expect(screen.getByTestId("cp--root")).toHaveAttribute("data-disabled");
		expect(screen.getByTestId("cp--area-thumb")).not.toHaveAttribute("tabindex");
		expect(screen.getByTestId("cp--channel-slider-thumb")).toHaveAttribute("aria-disabled");

		screen.getByTestId("cp--area-thumb").focus();
		await user.keyboard("{ArrowUp}");
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it("is read-only: shows the value but ignores edits", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<ColorPanel testId="cp" defaultValue="#2563eb" readOnly onValueChange={onValueChange} />,
		);

		expect(hexInput()).toHaveAttribute("readonly");
		await user.type(hexInput(), "000{Enter}");
		screen.getByTestId("cp--area-thumb").focus();
		await user.keyboard("{ArrowUp}");
		screen.getByTestId("cp--channel-slider-thumb").focus();
		await user.keyboard("{ArrowRight}");

		expect(onValueChange).not.toHaveBeenCalled();
		expect(hexInput()).toHaveValue("#2563eb");
	});

	it("focuses the hex field with autoFocus", () => {
		render(<ColorPanel testId="cp" autoFocus />);
		expect(hexInput()).toHaveFocus();
	});

	it("does not take focus without autoFocus", () => {
		render(<ColorPanel testId="cp" />);
		expect(hexInput()).not.toHaveFocus();
	});
});
