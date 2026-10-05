/**
 * @vitest-environment happy-dom
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	ALIGN_ITEM_WITH_TRIGGER_EDGE_THRESHOLD,
	computeAlignItemWithTrigger,
	querySelectedItemEl,
} from "./align-item-with-trigger";

function mockRect(top: number, height = 36, left = 0, width = 200): DOMRect {
	return {
		top,
		left,
		bottom: top + height,
		right: left + width,
		width,
		height,
		x: left,
		y: top,
		toJSON: () => ({}),
	} as DOMRect;
}

const computedStyleMocks = new Map<HTMLElement, Partial<CSSStyleDeclaration>>();

function mockComputedStyle(
	element: HTMLElement,
	styles: Partial<CSSStyleDeclaration> & Record<string, string>,
) {
	computedStyleMocks.set(element, styles);
	vi.spyOn(window, "getComputedStyle").mockImplementation((target) => {
		const matched = computedStyleMocks.get(target as HTMLElement);
		if (matched) {
			return matched as CSSStyleDeclaration;
		}
		return {
			borderBottomWidth: "0",
			marginTop: "10",
			marginBottom: "10",
			minHeight: "100",
			zIndex: "auto",
		} as CSSStyleDeclaration;
	});
}

function createAlignFixture(opts?: {
	triggerTop?: number;
	itemTextTop?: number;
	valueTextTop?: number;
	positionerTop?: number;
	scrollHeight?: number;
	viewportWidth?: number;
	contentZIndex?: string;
}) {
	const triggerTop = opts?.triggerTop ?? 100;
	const valueTextTop = opts?.valueTextTop ?? triggerTop + 10;
	const itemTextTop = opts?.itemTextTop ?? valueTextTop + 40;
	const positionerTop = opts?.positionerTop ?? triggerTop + 8;

	const controlEl = document.createElement("div");
	const triggerEl = document.createElement("button");
	const valueTextEl = document.createElement("span");
	valueTextEl.setAttribute("data-part", "value-text");
	const contentEl = document.createElement("div");
	const positionerEl = document.createElement("div");
	const selectedItemEl = document.createElement("div");
	const itemTextEl = document.createElement("span");
	itemTextEl.setAttribute("data-part", "item-text");

	selectedItemEl.appendChild(itemTextEl);
	contentEl.appendChild(selectedItemEl);

	vi.spyOn(controlEl, "getBoundingClientRect").mockReturnValue(mockRect(triggerTop, 36, 0, 250));
	vi.spyOn(triggerEl, "getBoundingClientRect").mockReturnValue(mockRect(triggerTop));
	vi.spyOn(valueTextEl, "getBoundingClientRect").mockReturnValue(mockRect(valueTextTop, 16, 12));
	vi.spyOn(itemTextEl, "getBoundingClientRect").mockReturnValue(mockRect(itemTextTop, 16, 12));
	vi.spyOn(positionerEl, "getBoundingClientRect").mockReturnValue(
		mockRect(positionerTop, 200, 0, 220),
	);
	vi.spyOn(contentEl, "getBoundingClientRect").mockReturnValue(mockRect(positionerTop, 200));

	Object.defineProperty(contentEl, "scrollTop", {
		writable: true,
		value: 0,
	});
	Object.defineProperty(contentEl, "scrollHeight", {
		configurable: true,
		value: opts?.scrollHeight ?? 400,
	});
	Object.defineProperty(contentEl, "clientHeight", {
		configurable: true,
		value: 200,
	});

	Object.defineProperty(document.documentElement, "clientWidth", {
		configurable: true,
		value: opts?.viewportWidth ?? 1024,
	});

	mockComputedStyle(positionerEl, {
		marginTop: "10",
		marginBottom: "10",
		minHeight: "100",
		zIndex: "7",
	});
	mockComputedStyle(contentEl, {
		borderBottomWidth: "1",
		borderLeftWidth: "0",
		borderRightWidth: "0",
		borderTopWidth: "0",
		zIndex: opts?.contentZIndex ?? "50",
	});

	return {
		controlEl,
		triggerEl,
		valueTextEl,
		contentEl,
		positionerEl,
		selectedItemEl,
	};
}

describe("computeAlignItemWithTrigger", () => {
	afterEach(() => {
		computedStyleMocks.clear();
		vi.restoreAllMocks();
	});

	it("returns fallback when there is no selected item", () => {
		Object.defineProperty(document.documentElement, "clientHeight", {
			configurable: true,
			value: 800,
		});

		const fixture = createAlignFixture();
		const result = computeAlignItemWithTrigger({
			...fixture,
			selectedItemEl: null,
		});

		expect(result.status).toBe("fallback");
	});

	it("returns fallback when trigger is too close to the viewport edge", () => {
		Object.defineProperty(document.documentElement, "clientHeight", {
			configurable: true,
			value: 800,
		});

		const fixture = createAlignFixture({
			triggerTop: ALIGN_ITEM_WITH_TRIGGER_EDGE_THRESHOLD - 1,
		});

		const result = computeAlignItemWithTrigger(fixture);

		expect(result.status).toBe("fallback");
	});

	it("returns fixed positioner styles that override ark transform positioning", () => {
		Object.defineProperty(document.documentElement, "clientHeight", {
			configurable: true,
			value: 800,
		});

		const fixture = createAlignFixture();
		const result = computeAlignItemWithTrigger(fixture);

		expect(result.status).toBe("aligned");
		if (result.status !== "aligned") {
			return;
		}

		expect(result.styles.popup.position).toBe("fixed");
		expect(result.styles.popup.transform).toBe("none");
		expect(result.styles.popup.width).toBe("250px");
		expect(result.styles.popup.zIndex).toBe("50");
		expect(result.styles.positioner.position).toBe("static");
		expect(result.styles.content.maxHeight).toBe("100%");
		expect(result.styles.scrollTop).toBeGreaterThanOrEqual(0);
	});

	it("offsets the popup from the viewport by the margin alone", () => {
		Object.defineProperty(document.documentElement, "clientHeight", {
			configurable: true,
			value: 800,
		});

		const fixture = createAlignFixture();
		const result = computeAlignItemWithTrigger(fixture);

		expect(result.status).toBe("aligned");
		if (result.status !== "aligned") {
			return;
		}

		// idealHeight = 722 -> topOffset = 780 - 722 = 58; the 10px gap to the
		// viewport must come from the margin, not be baked into `top` as well.
		expect(result.styles.popup.top).toBe("58px");
		expect(result.styles.popup.marginTop).toBe("10px");
	});

	it("widens the popup to fit the widest item and cover the control", () => {
		Object.defineProperty(document.documentElement, "clientHeight", {
			configurable: true,
			value: 800,
		});

		const fixture = createAlignFixture();
		Object.defineProperty(fixture.contentEl, "scrollWidth", {
			configurable: true,
			value: 320,
		});

		const result = computeAlignItemWithTrigger(fixture);

		expect(result.status).toBe("aligned");
		if (result.status !== "aligned") {
			return;
		}

		// 320px of natural item width wins over the 250px control width.
		expect(result.styles.popup.width).toBe("320px");
	});

	it("extends the popup to fully cover the control when shifted left", () => {
		Object.defineProperty(document.documentElement, "clientHeight", {
			configurable: true,
			value: 800,
		});

		const fixture = createAlignFixture();
		// Item text sits 40px to the right of the value text (indicator gutter),
		// so the popup shifts 40px left of the control.
		vi.spyOn(
			fixture.selectedItemEl.querySelector("[data-part='item-text']")!,
			"getBoundingClientRect",
		).mockReturnValue(mockRect(150, 16, 52));

		const result = computeAlignItemWithTrigger(fixture);

		expect(result.status).toBe("aligned");
		if (result.status !== "aligned") {
			return;
		}

		// Control spans 0..250, popup left is clamped to 5 -> width must still
		// reach the control's right edge when possible (250 - (-40) = 290).
		expect(result.styles.popup.width).toBe("290px");
	});

	it("uses the content z-index for the aligned popup", () => {
		Object.defineProperty(document.documentElement, "clientHeight", {
			configurable: true,
			value: 800,
		});

		const fixture = createAlignFixture({ contentZIndex: "200" });
		const result = computeAlignItemWithTrigger(fixture);

		expect(result.status).toBe("aligned");
		if (result.status !== "aligned") {
			return;
		}

		expect(result.styles.popup.zIndex).toBe("200");
	});

	it("falls back to 50 when the content z-index is auto", () => {
		Object.defineProperty(document.documentElement, "clientHeight", {
			configurable: true,
			value: 800,
		});

		const fixture = createAlignFixture({ contentZIndex: "auto" });
		const result = computeAlignItemWithTrigger(fixture);

		expect(result.status).toBe("aligned");
		if (result.status !== "aligned") {
			return;
		}

		expect(result.styles.popup.zIndex).toBe("50");
	});

	it("queries the checked item element", () => {
		const contentEl = document.createElement("div");
		const unchecked = document.createElement("div");
		unchecked.setAttribute("data-part", "item");
		unchecked.setAttribute("data-state", "unchecked");
		const checked = document.createElement("div");
		checked.setAttribute("data-part", "item");
		checked.setAttribute("data-state", "checked");
		const highlighted = document.createElement("div");
		highlighted.setAttribute("data-part", "item");
		highlighted.setAttribute("data-highlighted", "");
		contentEl.append(unchecked, highlighted, checked);

		expect(querySelectedItemEl(contentEl)).toBe(checked);
	});
});
