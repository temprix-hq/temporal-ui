import { ColorPicker, parseColor, useColorPickerContext } from "@ark-ui/react/color-picker";
import type { Color } from "@ark-ui/react/color-picker";
import type { ColorPanelProps as CoreColorPanelProps } from "@temporal-ui/core/color-input";
import { getHueKeyAction, normalizeHexColor } from "@temporal-ui/core/utils/color";
import { testId as testIdFn } from "@temporal-ui/core/utils/string";
import type React from "react";
import { forwardRef, useEffect, useId, useRef, useState } from "react";

export interface ColorPanelProps
	extends
		CoreColorPanelProps<React.ReactNode>,
		Omit<
			React.HTMLAttributes<HTMLDivElement>,
			keyof CoreColorPanelProps<React.ReactNode> | "children" | "dir"
		> {}

const FALLBACK_COLOR = "#000000";

const toColor = (hex: string | undefined) => parseColor(normalizeHexColor(hex) ?? FALLBACK_COLOR);
const toHex = (color: Color) => color.toString("hex").toLowerCase();

/**
 * Lets Escape on a thumb reach the host. Ark stops propagation of (and prevents) Escape on
 * the area and slider thumbs; this handler runs first and makes those two calls no-ops for
 * this one event, so a host listener (or a parent popover) still sees it.
 */
function passEscapeThrough(event: React.KeyboardEvent) {
	if (event.key !== "Escape" || event.defaultPrevented) return;
	const swallowOnce = (method: "stopPropagation" | "preventDefault") => {
		Object.defineProperty(event, method, {
			configurable: true,
			value: () => Reflect.deleteProperty(event, method),
		});
	};
	swallowOnce("stopPropagation");
	swallowOnce("preventDefault");
	// Restore the original methods even if Ark did not call them.
	queueMicrotask(() => {
		Reflect.deleteProperty(event, "stopPropagation");
		Reflect.deleteProperty(event, "preventDefault");
	});
}

/**
 * Saturation and brightness area plus hue slider. Rendered inside a `ColorPicker.Root` by
 * both `ColorPanel` and the `ColorInput` popover, so there is one implementation.
 * @internal
 */
export function ColorPanelControls(props: {
	testId?: string;
	/** Let Escape on the thumbs propagate to the host (inline panel only). */
	passEscape?: boolean;
}) {
	const { testId, passEscape } = props;
	const tid = testIdFn(testId);
	const onThumbKeyDown = passEscape ? passEscapeThrough : undefined;
	const api = useColorPickerContext();
	// zag's keyboard handler calls `incrementChannel("hue")` on the picker value, which throws for
	// RGB (the `ColorInput` format). Handle the hue keys on the HSB equivalent in the capture phase
	// instead; zag's own handler then skips the event because it is `defaultPrevented`. HSB and HSL
	// values (`ColorPanel`) keep zag's built-in handling.
	const onHueKeyDownCapture = (event: React.KeyboardEvent<HTMLElement>) => {
		if (api.format !== "rgba") return;
		const action = getHueKeyAction(event);
		const thumb = event.currentTarget;
		if (!action || thumb.hasAttribute("data-disabled")) return;
		event.preventDefault();
		if (thumb.closest("[data-part=root]")?.hasAttribute("data-readonly")) return;
		const hsb = api.value.toFormat("hsba");
		const { minValue, maxValue } = hsb.getChannelRange("hue");
		api.setValue(
			action === "min"
				? hsb.withChannelValue("hue", minValue)
				: action === "max"
					? hsb.withChannelValue("hue", maxValue)
					: action.step > 0
						? hsb.incrementChannel("hue", action.step)
						: hsb.decrementChannel("hue", -action.step),
		);
	};

	return (
		<>
			<ColorPicker.Area data-scope={"color-input"} data-testid={tid("--area")}>
				<ColorPicker.AreaBackground
					data-scope={"color-input"}
					data-testid={tid("--area-background")}
				/>
				<ColorPicker.AreaThumb
					data-scope={"color-input"}
					data-testid={tid("--area-thumb")}
					onKeyDown={onThumbKeyDown}
				/>
			</ColorPicker.Area>
			<ColorPicker.ChannelSlider
				channel="hue"
				data-scope={"color-input"}
				data-testid={tid("--channel-slider")}
			>
				<ColorPicker.ChannelSliderTrack
					data-scope={"color-input"}
					data-testid={tid("--channel-slider-track")}
				/>
				<ColorPicker.ChannelSliderThumb
					data-scope={"color-input"}
					data-testid={tid("--channel-slider-thumb")}
					onKeyDownCapture={onHueKeyDownCapture}
					onKeyDown={onThumbKeyDown}
				/>
			</ColorPicker.ChannelSlider>
		</>
	);
}

function ColorPanelHexField(props: {
	label: string;
	autoFocus?: boolean;
	interactive: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	actions?: React.ReactNode;
	testId?: string;
}) {
	const { label, autoFocus, interactive, disabled, readOnly, actions, testId } = props;
	const api = useColorPickerContext();
	const tid = testIdFn(testId);
	const inputId = useId();
	const inputRef = useRef<HTMLInputElement>(null);
	const [draft, setDraft] = useState<string>();

	const current = toHex(api.value);
	/** Applies valid hex text. Returns false (value unchanged) for invalid text. */
	const commit = (text: string) => {
		const hex = normalizeHexColor(text);
		if (!hex) return false;
		setDraft(undefined);
		if (interactive && hex !== current) api.setValue(parseColor(hex));
		return true;
	};

	useEffect(() => {
		if (autoFocus) inputRef.current?.focus();
		// Focus once on mount, like the native autoFocus attribute.
	}, []);

	return (
		<div data-scope={"color-input"} data-part={"hex-row"} data-testid={tid("--hex-row")}>
			<label
				htmlFor={inputId}
				data-scope={"color-input"}
				data-part={"hex-label"}
				data-disabled={disabled ? "" : undefined}
				data-testid={tid("--hex-label")}
			>
				{label}
			</label>
			<input
				ref={inputRef}
				id={inputId}
				type="text"
				value={draft ?? current}
				spellCheck={false}
				autoComplete="off"
				disabled={disabled}
				readOnly={readOnly}
				data-component={"text-input"}
				data-slot={"input"}
				data-scope={"color-input"}
				data-part={"hex-input"}
				data-testid={tid("--hex-input")}
				onFocus={(event) => event.currentTarget.select()}
				onChange={(event) => setDraft(event.currentTarget.value)}
				onBlur={(event) => {
					// Invalid text falls back to the last valid value.
					if (!commit(event.currentTarget.value)) setDraft(undefined);
				}}
				onKeyDown={(event) => {
					if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
					// Keep Enter from submitting a surrounding form; invalid text stays for editing.
					event.preventDefault();
					commit(event.currentTarget.value);
				}}
			/>
			{actions}
		</div>
	);
}

/**
 * Inline colour panel: a hex field, a saturation and brightness area and a hue slider,
 * rendered in place with no trigger, popover or field wrapper. The value is a hex string
 * in and out (`onValueChange` receives lowercase `#rrggbb`). Escape is left to the host.
 */
export const ColorPanel = forwardRef<HTMLDivElement, ColorPanelProps>((props, ref) => {
	const {
		value,
		defaultValue,
		onValueChange,
		disabled,
		readOnly,
		autoFocus,
		hexLabel = "Hex",
		actions,
		className,
		testId,
		...rootProps
	} = props;
	const tid = testIdFn(testId);
	const interactive = !disabled && !readOnly;

	return (
		<ColorPicker.Root
			{...rootProps}
			ref={ref}
			inline
			// HSB keeps the hue slider keyboard working (Ark's RGB default cannot step the hue channel).
			defaultFormat="hsba"
			value={value !== undefined ? toColor(value) : undefined}
			defaultValue={toColor(defaultValue)}
			onValueChange={(details) => onValueChange?.(toHex(details.value))}
			disabled={disabled}
			readOnly={readOnly}
			className={className}
			data-scope={"color-input"}
			data-part={"panel"}
			data-testid={tid("--root")}
		>
			<ColorPanelHexField
				label={hexLabel}
				autoFocus={autoFocus}
				interactive={interactive}
				disabled={disabled}
				readOnly={readOnly}
				actions={actions}
				testId={testId}
			/>
			<ColorPanelControls testId={testId} passEscape={interactive} />
		</ColorPicker.Root>
	);
});
