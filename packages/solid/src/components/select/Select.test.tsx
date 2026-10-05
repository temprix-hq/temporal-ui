import { fireEvent, render, screen, waitFor } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createListCollection, Select, type SelectItem } from ".";

const collection = createListCollection<SelectItem<unknown>>({
	items: [
		{ value: "a", label: "Alpha" },
		{ value: "b", label: "Beta" },
	],
});

describe("Select", () => {
	it("merges classes.control with class prop on the control element", () => {
		render(() => (
			<Select
				testId="sel"
				label="Pick"
				collection={collection}
				placeholder="Choose"
				portal={false}
				class="from-prop"
				classes={{ control: "from-classes" }}
			/>
		));
		const control = screen.getByTestId("sel--control");
		expect(control).toHaveClass("from-prop");
		expect(control).toHaveClass("from-classes");
	});

	it("applies trigger and valueText class slots", () => {
		render(() => (
			<Select
				testId="sel2"
				label="Pick"
				collection={collection}
				placeholder="Choose"
				portal={false}
				classes={{ trigger: "slot-trigger", valueText: "slot-value" }}
			/>
		));
		expect(screen.getByTestId("sel2--trigger")).toHaveClass("slot-trigger");
		expect(screen.getByTestId("sel2--value-text")).toHaveClass("slot-value");
	});

	it("sets data-align-item-with-trigger when alignItemWithTrigger is enabled", () => {
		render(() => (
			<Select
				testId="sel3"
				label="Pick"
				collection={collection}
				placeholder="Choose"
				portal={false}
				alignItemWithTrigger
			/>
		));
		expect(screen.getByTestId("sel3--root")).toHaveAttribute("data-align-item-with-trigger");
	});

	it("reopens after closing when alignItemWithTrigger is enabled", async () => {
		const user = userEvent.setup();
		render(() => (
			<Select
				testId="sel4"
				label="Pick"
				collection={collection}
				placeholder="Choose"
				portal={false}
				alignItemWithTrigger
				defaultValue={["a"]}
			/>
		));

		await user.click(screen.getByTestId("sel4--trigger"));
		expect(screen.getByTestId("sel4--trigger")).toHaveAttribute("aria-expanded", "true");
		expect(await screen.findByTestId("sel4--content")).toBeVisible();

		await user.click(screen.getByTestId("sel4--trigger"));
		await waitFor(() => {
			expect(screen.getByTestId("sel4--trigger")).toHaveAttribute("aria-expanded", "false");
		});

		await user.click(screen.getByTestId("sel4--trigger"));
		await waitFor(() => {
			expect(screen.getByTestId("sel4--trigger")).toHaveAttribute("aria-expanded", "true");
		});
		expect(await screen.findByTestId("sel4--content")).toBeVisible();
	});

	it("shows dropdown when alignItemWithTrigger is enabled with no selection", async () => {
		const user = userEvent.setup();
		render(() => (
			<Select
				testId="sel5"
				label="Pick"
				collection={collection}
				placeholder="Choose"
				portal={false}
				alignItemWithTrigger
			/>
		));

		await user.click(screen.getByTestId("sel5--trigger"));

		expect(await screen.findByTestId("sel5--content")).toBeVisible();
		await waitFor(() => {
			expect(screen.getByTestId("sel5--positioner")).not.toHaveAttribute(
				"data-align-item-with-trigger-pending",
			);
		});
	});

	it("skips alignment when opened via touch", async () => {
		render(() => (
			<Select
				testId="sel6"
				label="Pick"
				collection={collection}
				placeholder="Choose"
				portal={false}
				alignItemWithTrigger
				defaultValue={["a"]}
			/>
		));

		const trigger = screen.getByTestId("sel6--trigger");
		fireEvent.pointerDown(trigger, { pointerType: "touch" });
		fireEvent.click(trigger);

		await waitFor(() => {
			expect(screen.getByTestId("sel6--content")).toHaveAttribute("data-state", "open");
		});
		expect(screen.getByTestId("sel6--positioner")).not.toHaveAttribute(
			"data-align-item-with-trigger",
		);
	});

	it("preserves custom ids when alignItemWithTrigger is disabled", async () => {
		render(() => (
			<Select
				testId="sel7"
				label="Pick"
				collection={collection}
				placeholder="Choose"
				portal={false}
				ids={{ trigger: "custom-trigger", content: "custom-content" }}
			/>
		));

		expect(screen.getByTestId("sel7--trigger")).toHaveAttribute("id", "custom-trigger");
		await userEvent.setup().click(screen.getByTestId("sel7--trigger"));
		expect(await screen.findByTestId("sel7--content")).toHaveAttribute("id", "custom-content");
	});

	describe("positioner z-index", () => {
		const cleanups: Array<() => void> = [];

		afterEach(() => {
			for (const cleanup of cleanups) {
				cleanup();
			}
			cleanups.length = 0;
		});

		it.each([
			{ portal: false, zIndex: "50", testId: "z-std" },
			{ portal: true, zIndex: "50", testId: "z-std-portal" },
			{ portal: false, zIndex: "200", testId: "z-override" },
		])(
			"standard placement follows content z-index $zIndex (portal=$portal)",
			async ({ portal, zIndex, testId }) => {
				cleanups.push(installContentZIndex(zIndex));
				const user = userEvent.setup();
				render(() => (
					<Select
						testId={testId}
						label="Pick"
						collection={collection}
						placeholder="Choose"
						portal={portal}
					/>
				));

				await user.click(screen.getByTestId(`${testId}--trigger`));

				const positioner = await screen.findByTestId(`${testId}--positioner`);
				await waitFor(() => {
					const content = screen.getByTestId(`${testId}--content`);
					expect(getComputedStyle(content).zIndex).toBe(zIndex);
					expect(positioner.style.getPropertyValue("--z-index")).toBe(zIndex);
					expect(positioner.firstElementChild).toBe(content);
				});
			},
		);

		it.each([
			{ portal: false, zIndex: "50", testId: "z-align" },
			{ portal: true, zIndex: "50", testId: "z-align-portal" },
			{ portal: true, zIndex: "200", testId: "z-override-align" },
		])(
			"aligned placement follows content z-index $zIndex (portal=$portal)",
			async ({ portal, zIndex, testId }) => {
				cleanups.push(installContentZIndex(zIndex));
				cleanups.push(stubAlignGeometry());
				const user = userEvent.setup();
				render(() => (
					<Select
						testId={testId}
						label="Pick"
						collection={collection}
						placeholder="Choose"
						portal={portal}
						alignItemWithTrigger
						defaultValue={["a"]}
					/>
				));

				await user.click(screen.getByTestId(`${testId}--trigger`));

				const positioner = await screen.findByTestId(`${testId}--positioner`);
				await waitFor(() => {
					const content = screen.getByTestId(`${testId}--content`);
					const popup = positioner.querySelector("[data-align-item-with-trigger-active]");
					expect(getComputedStyle(content).zIndex).toBe(zIndex);
					expect(positioner.style.getPropertyValue("--z-index")).toBe(zIndex);
					expect(popup).toBeInstanceOf(HTMLElement);
					expect(getComputedStyle(popup as HTMLElement).zIndex).toBe(zIndex);
				});
			},
		);
	});
});

function installContentZIndex(zIndex: string) {
	const style = document.createElement("style");
	style.textContent = `[data-scope="select"][data-part="content"] { z-index: ${zIndex}; }`;
	document.head.append(style);
	return () => style.remove();
}

function stubAlignGeometry() {
	const rect = (top: number, height: number, left = 0, width = 200): DOMRect =>
		({
			top,
			left,
			bottom: top + height,
			right: left + width,
			width,
			height,
			x: left,
			y: top,
			toJSON: () => ({}),
		}) as DOMRect;

	const spy = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
		this: HTMLElement,
	) {
		const part = this.getAttribute("data-part");
		if (part === "control" || part === "trigger") {
			return rect(100, 36, 0, 250);
		}
		if (part === "value-text") {
			return rect(110, 16, 12, 80);
		}
		if (part === "item-text") {
			return rect(150, 16, 12, 80);
		}
		if (part === "item") {
			return rect(140, 36, 0, 220);
		}
		if (part === "positioner" || part === "content") {
			return rect(108, 200, 0, 220);
		}
		return rect(0, 0, 0, 0);
	});

	const viewport = document.documentElement;
	const previousHeight = Object.getOwnPropertyDescriptor(viewport, "clientHeight");
	const previousWidth = Object.getOwnPropertyDescriptor(viewport, "clientWidth");
	Object.defineProperty(viewport, "clientHeight", { configurable: true, value: 800 });
	Object.defineProperty(viewport, "clientWidth", { configurable: true, value: 1024 });

	return () => {
		spy.mockRestore();
		if (previousHeight) {
			Object.defineProperty(viewport, "clientHeight", previousHeight);
		}
		if (previousWidth) {
			Object.defineProperty(viewport, "clientWidth", previousWidth);
		}
	};
}
