import { cleanup, render, screen } from "@solidjs/testing-library";
import { beforeEach, describe, expect, it } from "vitest";
// The built package, as an app consumes it (run `bun run build` first).
import { ColorPanel } from "../dist/index.jsx";

describe("built ColorPanel", () => {
	beforeEach(() => {
		cleanup();
	});

	it("focuses the hex field with autoFocus", () => {
		render(() => <ColorPanel testId="cp" defaultValue="#2563eb" autoFocus />);
		const input = screen.getByTestId("cp--hex-input");
		expect(input).toHaveValue("#2563eb");
		expect(input).toHaveFocus();
	});

	it("does not take focus without autoFocus", () => {
		render(() => <ColorPanel testId="cp" defaultValue="#2563eb" />);
		expect(screen.getByTestId("cp--hex-input")).not.toHaveFocus();
	});
});
