import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ColorInput } from "./ColorInput";

describe("ColorInput", () => {
	beforeEach(() => {
		cleanup();
	});

	it("renders the field, trigger, hex input and swatch", () => {
		render(<ColorInput testId="ci" label="Color" defaultValue="#2563eb" className="extra" />);

		expect(screen.getByTestId("ci-field--root")).toBeInTheDocument();
		expect(screen.getByTestId("ci--root")).toHaveAttribute("data-scope", "color-input");
		expect(screen.getByTestId("ci--trigger")).toHaveClass("extra");
		expect(screen.getByTestId("ci--channel-input")).toHaveValue("#2563EB");
		expect(screen.getByTestId("ci--swatch")).toBeInTheDocument();
		expect(screen.getByTestId("ci--input")).toHaveValue("rgba(37, 99, 235, 1)");
	});

	it("renders the shared area and hue slider inside its popover content", async () => {
		const user = userEvent.setup();
		render(<ColorInput testId="ci" label="Color" defaultValue="#2563eb" />);

		await user.click(screen.getByTestId("ci--trigger"));

		const content = await waitFor(() => screen.getByTestId("ci--content"));
		expect(content).toHaveAttribute("data-part", "content");
		expect(screen.getByTestId("ci--positioner")).toContainElement(content);
		for (const id of [
			"ci--area",
			"ci--area-background",
			"ci--area-thumb",
			"ci--channel-slider",
			"ci--channel-slider-track",
			"ci--channel-slider-thumb",
		]) {
			expect(content).toContainElement(screen.getByTestId(id));
		}
		// The popover has no panel hex field; the hex input stays in the trigger.
		expect(screen.queryByTestId("ci--hex-input")).toBeNull();
	});

	it("emits the hex value from the trigger input", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<ColorInput testId="ci" label="Color" defaultValue="#000000" onValueChange={onValueChange} />,
		);

		const input = screen.getByTestId("ci--channel-input");
		await user.clear(input);
		await user.type(input, "#ff0000{Enter}");

		expect(onValueChange).toHaveBeenLastCalledWith("#FF0000");
	});
});
