import type { useSelectContext } from "@ark-ui/react/select";
import {
	ALIGN_ITEM_WITH_TRIGGER_MAX_RETRIES,
	alignItemWithTriggerFallbackPositioning,
	areAlignItemWithTriggerStylesEqual,
	computeAlignItemWithTrigger,
	isScrollInsideContent,
	querySelectedItemEl,
	readAlignItemWithTriggerAnchor,
	shiftAlignedPopupWithTrigger,
	type AlignItemWithTriggerAnchor,
	type AlignItemWithTriggerStyles,
} from "@temporal-ui/core/select";
import { useLayoutEffect, useRef, useState } from "react";
import type { SelectContentProps } from "./SelectContent";

function runAfterLayout(callback: () => void) {
	requestAnimationFrame(() => {
		requestAnimationFrame(callback);
	});
}

export function useAlignItemWithTrigger(
	context: ReturnType<typeof useSelectContext>,
	props: Pick<
		SelectContentProps,
		"alignItemWithTrigger" | "alignItemWithTriggerMinHeight" | "openedWithTouch" | "selectIds"
	>,
) {
	const [alignedStyles, setAlignedStyles] = useState<AlignItemWithTriggerStyles | undefined>();
	const [alignEpoch, setAlignEpoch] = useState(0);
	const [readyEpoch, setReadyEpoch] = useState(0);
	const sessionRef = useRef(0);
	const propsRef = useRef(props);
	propsRef.current = props;
	const stylesRef = useRef(alignedStyles);
	stylesRef.current = alignedStyles;
	const anchorRef = useRef<AlignItemWithTriggerAnchor | undefined>(undefined);

	const repositionRef = useRef(context.reposition);
	repositionRef.current = context.reposition;

	useLayoutEffect(() => {
		if (!context.open) {
			return;
		}

		const { alignItemWithTrigger, alignItemWithTriggerMinHeight, openedWithTouch, selectIds } =
			propsRef.current;

		if (!alignItemWithTrigger || openedWithTouch || context.multiple || !selectIds) {
			return;
		}

		sessionRef.current += 1;
		const session = sessionRef.current;
		setAlignEpoch(session);
		setAlignedStyles(undefined);

		let cancelled = false;
		let retries = 0;

		const fallbackToStandardPlacement = () => {
			setAlignedStyles(undefined);
			setReadyEpoch(session);
			repositionRef.current(alignItemWithTriggerFallbackPositioning);
		};

		const alignOnce = () => {
			if (cancelled || sessionRef.current !== session) {
				return;
			}

			const controlEl = document.getElementById(selectIds.control);
			const triggerEl = document.getElementById(selectIds.trigger);
			const valueTextEl = document.getElementById(selectIds.valueText);
			const positionerEl = document.getElementById(selectIds.positioner);
			const contentEl = document.getElementById(selectIds.content);

			if (!controlEl || !triggerEl || !valueTextEl || !positionerEl || !contentEl) {
				if (++retries >= ALIGN_ITEM_WITH_TRIGGER_MAX_RETRIES) {
					fallbackToStandardPlacement();
					return;
				}
				runAfterLayout(alignOnce);
				return;
			}

			const selectedItemEl = querySelectedItemEl(contentEl);
			if (!selectedItemEl) {
				fallbackToStandardPlacement();
				return;
			}

			const result = computeAlignItemWithTrigger({
				controlEl,
				triggerEl,
				valueTextEl,
				contentEl,
				positionerEl,
				selectedItemEl,
				minHeight: alignItemWithTriggerMinHeight,
			});

			if (cancelled || sessionRef.current !== session) {
				return;
			}

			if (result.status === "fallback") {
				fallbackToStandardPlacement();
				return;
			}

			setAlignedStyles((current) =>
				areAlignItemWithTriggerStylesEqual(current, result.styles) ? current : result.styles,
			);
			setReadyEpoch(session);
		};

		queueMicrotask(() => {
			runAfterLayout(alignOnce);
		});

		return () => {
			cancelled = true;
		};
	}, [context.open]);

	// Scroll after the aligned styles are committed: the target offset is computed
	// for the final popup height and would be clamped by the pending max-height.
	useLayoutEffect(() => {
		if (!alignedStyles || !context.open || !props.selectIds) {
			return;
		}
		const contentEl = document.getElementById(props.selectIds.content);
		if (contentEl) {
			contentEl.scrollTop = alignedStyles.scrollTop;
		}
	}, [alignedStyles, context.open, props.selectIds]);

	const shouldAlign = !!(
		props.alignItemWithTrigger &&
		!props.openedWithTouch &&
		!context.multiple &&
		props.selectIds
	);

	const isAlignPending = shouldAlign && context.open && readyEpoch !== alignEpoch;
	const showAligned = !!alignedStyles && context.open && !isAlignPending;

	// The aligned popup is position:fixed, so it would stay on screen while the
	// select moves. Follow the trigger for any scroll that is not the list itself.
	useLayoutEffect(() => {
		if (!showAligned || !props.selectIds) {
			anchorRef.current = undefined;
			return;
		}

		const ids = props.selectIds;
		const triggerEl = document.getElementById(ids.trigger);
		const popupEl = document
			.getElementById(ids.positioner)
			?.querySelector<HTMLElement>("[data-align-item-with-trigger-active]");
		if (!triggerEl || !popupEl) {
			return;
		}

		anchorRef.current = readAlignItemWithTriggerAnchor(triggerEl, popupEl);

		const onScroll = (event: Event) => {
			const contentEl = document.getElementById(ids.content);
			const anchor = anchorRef.current;
			const current = stylesRef.current;
			if (!anchor || !current || isScrollInsideContent(event.target, contentEl)) {
				return;
			}

			const triggerRect = triggerEl.getBoundingClientRect();
			const shifted = shiftAlignedPopupWithTrigger(
				current,
				anchor,
				triggerRect.top,
				triggerRect.left,
			);
			if (!shifted) {
				return;
			}

			anchorRef.current = shifted.anchor;
			stylesRef.current = shifted.styles;
			popupEl.style.top = shifted.styles.popup.top ?? "";
			popupEl.style.left = shifted.styles.popup.left ?? "";
			popupEl.style.bottom = "auto";
			popupEl.style.right = "auto";
			popupEl.style.marginTop = "0px";
			popupEl.style.marginBottom = "0px";
			setAlignedStyles(shifted.styles);
		};

		window.addEventListener("scroll", onScroll, true);
		window.visualViewport?.addEventListener("scroll", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll, true);
			window.visualViewport?.removeEventListener("scroll", onScroll);
		};
	}, [showAligned, props.selectIds]);

	return { alignedStyles, isAlignPending, showAligned, shouldAlign };
}
