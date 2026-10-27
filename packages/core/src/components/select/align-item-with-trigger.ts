export const ALIGN_ITEM_WITH_TRIGGER_EDGE_THRESHOLD = 20;
export const ALIGN_ITEM_WITH_TRIGGER_DEFAULT_MIN_HEIGHT = 100;
export const ALIGN_ITEM_WITH_TRIGGER_MARGIN = 10;
export const ALIGN_ITEM_WITH_TRIGGER_VIEWPORT_PADDING = 5;
export const ALIGN_ITEM_WITH_TRIGGER_SCROLL_EDGE_TOLERANCE = 1;
/** Max layout passes to wait for portaled DOM nodes before falling back to standard placement. */
export const ALIGN_ITEM_WITH_TRIGGER_MAX_RETRIES = 10;

export const alignItemWithTriggerPositioning = {
	strategy: "fixed" as const,
	overlap: false,
	gutter: 0,
	sameWidth: true,
	fitViewport: false,
	placement: "bottom-start" as const,
	listeners: false,
};

export const alignItemWithTriggerFallbackPositioning = {
	placement: "bottom-start" as const,
	overlap: false,
	gutter: 8,
	listeners: true,
};

/** Neutralizes Ark popper transforms on the positioner while aligned. */
// Relative, not static: the positioner keeps the `z-index` zag copies onto it (static ignores it),
// so an unportaled aligned popup still stacks above later positioned content.
export const alignItemWithTriggerPositionerReset: Record<string, string> = {
	position: "relative",
	transform: "none",
	top: "auto",
	left: "auto",
	right: "auto",
	bottom: "auto",
	width: "auto",
	height: "auto",
	margin: "0",
	overflow: "visible",
};

export interface AlignItemWithTriggerOptions {
	controlEl: HTMLElement;
	triggerEl: HTMLElement;
	valueTextEl: HTMLElement;
	contentEl: HTMLElement;
	positionerEl: HTMLElement;
	selectedItemEl: HTMLElement | null;
	minHeight?: number;
}

export interface AlignItemWithTriggerStyles {
	positioner: Record<string, string>;
	popup: Record<string, string>;
	content: Record<string, string>;
	scrollTop: number;
}

export type AlignItemWithTriggerResult =
	| { status: "aligned"; styles: AlignItemWithTriggerStyles }
	| { status: "fallback" };

function getItemTextEl(itemEl: HTMLElement): HTMLElement | null {
	return itemEl.querySelector('[data-part="item-text"]');
}

function isPinchZoomed(): boolean {
	return (window.visualViewport?.scale ?? 1) !== 1;
}

/**
 * Computes fixed popup styles so the selected item text aligns with the trigger
 * value text. Adapted from Base UI's alignItemWithTrigger logic.
 *
 * Note on measurement: zag scrolls the selected item into view on open, so the
 * content may already be scrolled when this runs. `contentEl.scrollTop` is added
 * back to derive the unscrolled item geometry, and the popup width is derived
 * from the natural (unwrapped, `white-space: nowrap` in this mode) item widths
 * via `scrollWidth`, both of which are independent of the scroll/pending state.
 */
export function computeAlignItemWithTrigger(
	options: AlignItemWithTriggerOptions,
): AlignItemWithTriggerResult {
	const { controlEl, triggerEl, valueTextEl, contentEl, positionerEl, selectedItemEl } = options;

	if (!selectedItemEl) {
		return { status: "fallback" };
	}

	const itemTextEl = getItemTextEl(selectedItemEl);
	if (!itemTextEl) {
		return { status: "fallback" };
	}

	const positionerStyles = getComputedStyle(positionerEl);
	const contentStyles = getComputedStyle(contentEl);
	const triggerRect = triggerEl.getBoundingClientRect();
	const controlRect = controlEl.getBoundingClientRect();
	const positionerRect = positionerEl.getBoundingClientRect();

	const contentBordersX =
		(Number.parseFloat(contentStyles.borderLeftWidth) || 0) +
		(Number.parseFloat(contentStyles.borderRightWidth) || 0);
	const contentBordersY =
		(Number.parseFloat(contentStyles.borderTopWidth) || 0) +
		(Number.parseFloat(contentStyles.borderBottomWidth) || 0);
	const marginTop = Number.parseFloat(positionerStyles.marginTop) || ALIGN_ITEM_WITH_TRIGGER_MARGIN;
	const marginBottom =
		Number.parseFloat(positionerStyles.marginBottom) || ALIGN_ITEM_WITH_TRIGGER_MARGIN;
	const minHeight =
		options.minHeight ??
		(Number.parseFloat(positionerStyles.minHeight) || ALIGN_ITEM_WITH_TRIGGER_DEFAULT_MIN_HEIGHT);

	const viewportHeight = document.documentElement.clientHeight - marginTop - marginBottom;
	const viewportWidth = document.documentElement.clientWidth;
	const availableSpaceBeneathTrigger = viewportHeight - triggerRect.bottom + triggerRect.height;
	// Natural height of the list (unaffected by the pending max-height clamp).
	const scrollHeight = contentEl.scrollHeight;

	const valueRect = valueTextEl.getBoundingClientRect();
	const textRect = itemTextEl.getBoundingClientRect();

	const alignedLeft = positionerRect.left + (valueRect.left - textRect.left);
	const valueCenterFromTriggerTop = valueRect.top - triggerRect.top + valueRect.height / 2;
	const textCenterFromPositionerTop =
		textRect.top - positionerRect.top + textRect.height / 2 + contentEl.scrollTop;
	const offsetY = textCenterFromPositionerTop - valueCenterFromTriggerTop;

	const idealHeight = availableSpaceBeneathTrigger + offsetY + marginBottom;
	let height = Math.min(viewportHeight, idealHeight);
	const maxHeight = viewportHeight - marginTop - marginBottom;
	const scrollTop = idealHeight - height;

	// The popup is at least as wide as needed to fully cover the control, even
	// when shifted left by the item indicator gutter.
	// `scrollWidth` ends at the widest item text, so when the list overflows it misses the
	// items' end padding and the text would touch the popup edge.
	const itemPaddingEnd = Number.parseFloat(getComputedStyle(selectedItemEl).paddingRight) || 0;
	const overflowsX = contentEl.scrollWidth > contentEl.clientWidth;
	const naturalWidth = contentEl.scrollWidth + (overflowsX ? itemPaddingEnd : 0) + contentBordersX;
	const minWidth = Math.max(
		controlRect.width,
		controlRect.right - Math.min(alignedLeft, controlRect.left),
	);
	const width = Math.min(
		Math.max(naturalWidth, minWidth),
		viewportWidth - ALIGN_ITEM_WITH_TRIGGER_VIEWPORT_PADDING * 2,
	);

	const maxRight = viewportWidth - ALIGN_ITEM_WITH_TRIGGER_VIEWPORT_PADDING;
	const left = Math.min(
		Math.max(alignedLeft, ALIGN_ITEM_WITH_TRIGGER_VIEWPORT_PADDING),
		Math.max(ALIGN_ITEM_WITH_TRIGGER_VIEWPORT_PADDING, maxRight - width),
	);

	// Scroll bounds as they will be once `height` is applied (content max-height: 100%).
	const maxScrollTop = Math.max(0, scrollHeight - height + contentBordersY);
	const isTopPositioned = scrollTop >= maxScrollTop - ALIGN_ITEM_WITH_TRIGGER_SCROLL_EDGE_TOLERANCE;

	if (isTopPositioned) {
		height = Math.min(viewportHeight, scrollHeight + contentBordersY) - (scrollTop - maxScrollTop);
	}

	const fallbackToAlignPopupToTrigger =
		triggerRect.top < ALIGN_ITEM_WITH_TRIGGER_EDGE_THRESHOLD ||
		triggerRect.bottom >
			document.documentElement.clientHeight - ALIGN_ITEM_WITH_TRIGGER_EDGE_THRESHOLD ||
		Math.ceil(height) + ALIGN_ITEM_WITH_TRIGGER_SCROLL_EDGE_TOLERANCE <
			Math.min(scrollHeight, minHeight) ||
		isPinchZoomed();

	if (fallbackToAlignPopupToTrigger) {
		return { status: "fallback" };
	}

	const popup: Record<string, string> = {
		position: "fixed",
		left: `${left}px`,
		width: `${width}px`,
		height: `${height}px`,
		maxHeight: "none",
		marginTop: `${marginTop}px`,
		marginBottom: `${marginBottom}px`,
		right: "auto",
		transform: "none",
		top: "auto",
		bottom: "auto",
		// Stack with the content element. "50" matches the default content rule
		// only when that element itself resolves to auto.
		zIndex: contentStyles.zIndex === "auto" ? "50" : contentStyles.zIndex,
	};

	let contentScrollTop = scrollTop;

	if (isTopPositioned) {
		const topOffset = Math.max(0, viewportHeight - idealHeight);
		popup.top = scrollHeight + contentBordersY >= maxHeight ? "0px" : `${topOffset}px`;
		contentScrollTop = Math.max(0, scrollHeight - Math.min(scrollHeight, height - contentBordersY));
	} else {
		popup.bottom = "0px";
	}

	return {
		status: "aligned",
		styles: {
			positioner: { ...alignItemWithTriggerPositionerReset },
			popup,
			content: { maxHeight: "100%" },
			scrollTop: contentScrollTop,
		},
	};
}

/**
 * Gives the positioner of an alignable select the content's z-index.
 *
 * Zag isolates the positioner and copies its first child's computed z-index onto it once per open. For an
 * alignable select that child is the wrapper around the content, which can still be at `auto` when Zag reads
 * it, leaving the positioner at `z-index: auto` so later positioned content (sticky table headers, for one)
 * paints over the popup and takes its hovers. Run this whenever the select opens or switches placement.
 */
export function syncAlignWrapperZIndex(wrapperEl: HTMLElement): void {
	const contentEl = wrapperEl.firstElementChild;
	const positionerEl = wrapperEl.parentElement;
	if (!contentEl || !positionerEl) {
		return;
	}
	const zIndex = getComputedStyle(contentEl).zIndex;
	if (zIndex === "auto") {
		return;
	}
	wrapperEl.style.zIndex = zIndex;
	positionerEl.style.setProperty("--z-index", zIndex);
	positionerEl.style.setProperty("z-index", "var(--z-index)");
}

export function querySelectedItemEl(contentEl: HTMLElement): HTMLElement | null {
	return contentEl.querySelector('[data-part="item"][data-state="checked"]');
}

export interface AlignItemWithTriggerAnchor {
	triggerTop: number;
	triggerLeft: number;
	popupTop: number;
	popupLeft: number;
}

/**
 * Moves an aligned popup by the same amount the trigger moved, so a fixed popup
 * stays on the select while the page or a parent scrolls.
 *
 * `top` / `left` are the popup border box. Margins are cleared because the
 * original `top` insets the margin edge, and keeping them would shift the box.
 */
export function shiftAlignedPopupWithTrigger(
	styles: AlignItemWithTriggerStyles,
	anchor: AlignItemWithTriggerAnchor,
	triggerTop: number,
	triggerLeft: number,
	kebab = false,
): { styles: AlignItemWithTriggerStyles; anchor: AlignItemWithTriggerAnchor } | undefined {
	const dy = triggerTop - anchor.triggerTop;
	const dx = triggerLeft - anchor.triggerLeft;
	if (dy === 0 && dx === 0) {
		return undefined;
	}

	const popupTop = anchor.popupTop + dy;
	const popupLeft = anchor.popupLeft + dx;
	const popup: Record<string, string> = {
		...styles.popup,
		top: `${popupTop}px`,
		left: `${popupLeft}px`,
		bottom: "auto",
		right: "auto",
	};
	if (kebab) {
		delete popup.marginTop;
		delete popup.marginBottom;
		popup["margin-top"] = "0px";
		popup["margin-bottom"] = "0px";
	} else {
		delete popup["margin-top"];
		delete popup["margin-bottom"];
		popup.marginTop = "0px";
		popup.marginBottom = "0px";
	}

	return {
		styles: { ...styles, popup },
		anchor: { triggerTop, triggerLeft, popupTop, popupLeft },
	};
}

/**
 * Hides an aligned popup in place. Closing must not drop these styles: Zag keeps the
 * list mounted for a frame and would otherwise park it under the trigger.
 */
export function concealAlignItemWithTriggerStyles(
	styles: AlignItemWithTriggerStyles,
	kebab = false,
): AlignItemWithTriggerStyles {
	const popup: Record<string, string> = {
		...styles.popup,
		visibility: "hidden",
		animation: "none",
		transition: "none",
	};
	if (kebab) {
		delete popup.pointerEvents;
		popup["pointer-events"] = "none";
	} else {
		delete popup["pointer-events"];
		popup.pointerEvents = "none";
	}
	return { ...styles, popup };
}

/** True when the scroll came from the list itself, which must not move the popup. */
export function isScrollInsideContent(
	target: EventTarget | null,
	contentEl: HTMLElement | null,
): boolean {
	return !!contentEl && target instanceof Node && contentEl.contains(target);
}

export function readAlignItemWithTriggerAnchor(
	triggerEl: HTMLElement,
	popupEl: HTMLElement,
): AlignItemWithTriggerAnchor {
	const triggerRect = triggerEl.getBoundingClientRect();
	const popupRect = popupEl.getBoundingClientRect();
	return {
		triggerTop: triggerRect.top,
		triggerLeft: triggerRect.left,
		popupTop: popupRect.top,
		popupLeft: popupRect.left,
	};
}

export function areAlignItemWithTriggerStylesEqual(
	current: AlignItemWithTriggerStyles | undefined,
	next: AlignItemWithTriggerStyles,
): boolean {
	if (!current) {
		return false;
	}

	return (
		current.scrollTop === next.scrollTop &&
		JSON.stringify(current.positioner) === JSON.stringify(next.positioner) &&
		JSON.stringify(current.popup) === JSON.stringify(next.popup) &&
		JSON.stringify(current.content) === JSON.stringify(next.content)
	);
}
