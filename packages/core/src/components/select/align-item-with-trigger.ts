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
export const alignItemWithTriggerPositionerReset: Record<string, string> = {
	position: "static",
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
	const naturalWidth = contentEl.scrollWidth + contentBordersX;
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

export function querySelectedItemEl(contentEl: HTMLElement): HTMLElement | null {
	return contentEl.querySelector('[data-part="item"][data-state="checked"]');
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
