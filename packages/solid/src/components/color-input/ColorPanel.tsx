import type { HTMLProps } from "@ark-ui/solid";
import { ColorPicker, parseColor, useColorPickerContext } from "@ark-ui/solid/color-picker";
import type { Color } from "@ark-ui/solid/color-picker";
import type { ColorPanelProps as CoreColorPanelProps } from "@temporal-ui/core/color-input";
import { normalizeHexColor } from "@temporal-ui/core/utils/color";
import { cx } from "@temporal-ui/core/utils/cx";
import { testId as testIdFn } from "@temporal-ui/core/utils/string";
import type { JSX } from "solid-js";
import { createSignal, createUniqueId, onMount, splitProps } from "solid-js";

export interface ColorPanelProps
	extends
		CoreColorPanelProps<JSX.Element>,
		Omit<HTMLProps<"div">, keyof CoreColorPanelProps<JSX.Element> | "children"> {}

const FALLBACK_COLOR = "#000000";

const toColor = (hex: string | undefined) => parseColor(normalizeHexColor(hex) ?? FALLBACK_COLOR);
const toHex = (color: Color) => color.toString("hex").toLowerCase();

/**
 * Lets Escape on a thumb reach the host. Ark stops propagation of (and prevents) Escape on
 * the area and slider thumbs; this handler runs first and makes those two calls no-ops for
 * this one event, so a host listener (or a parent popover) still sees it.
 */
function passEscapeThrough(event: KeyboardEvent) {
	if (event.key !== "Escape" || event.defaultPrevented) return;
	const swallowOnce = (method: "stopPropagation" | "preventDefault") => {
		Object.defineProperty(event, method, {
			configurable: true,
			value: () => Reflect.deleteProperty(event, method),
		});
	};
	swallowOnce("stopPropagation");
	swallowOnce("preventDefault");
	// Restore the native methods even if Ark did not call them.
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
	const tid = testIdFn(props.testId);
	const onThumbKeyDown = (event: KeyboardEvent) => {
		if (props.passEscape) passEscapeThrough(event);
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
	actions?: JSX.Element;
	testId?: string;
}) {
	const api = useColorPickerContext();
	const tid = testIdFn(props.testId);
	const inputId = createUniqueId();
	const [draft, setDraft] = createSignal<string>();
	let input: HTMLInputElement | undefined;

	const current = () => toHex(api().value);
	/** Applies valid hex text. Returns false (value unchanged) for invalid text. */
	const commit = (text: string) => {
		const hex = normalizeHexColor(text);
		if (!hex) return false;
		setDraft(undefined);
		if (props.interactive && hex !== current()) api().setValue(parseColor(hex));
		return true;
	};

	onMount(() => {
		if (props.autoFocus) input?.focus();
	});

	return (
		<div data-scope={"color-input"} data-part={"hex-row"} data-testid={tid("--hex-row")}>
			<label
				for={inputId}
				data-scope={"color-input"}
				data-part={"hex-label"}
				data-disabled={props.disabled ? "" : undefined}
				data-testid={tid("--hex-label")}
			>
				{props.label}
			</label>
			<input
				ref={input}
				id={inputId}
				type="text"
				value={draft() ?? current()}
				spellcheck={false}
				autocomplete="off"
				disabled={props.disabled}
				readOnly={props.readOnly}
				data-component={"text-input"}
				data-slot={"input"}
				data-scope={"color-input"}
				data-part={"hex-input"}
				data-testid={tid("--hex-input")}
				onFocus={(event) => event.currentTarget.select()}
				onInput={(event) => setDraft(event.currentTarget.value)}
				onBlur={(event) => {
					// Invalid text falls back to the last valid value.
					if (!commit(event.currentTarget.value)) setDraft(undefined);
				}}
				onKeyDown={(event) => {
					if (event.key !== "Enter" || event.isComposing) return;
					// Keep Enter from submitting a surrounding form; invalid text stays for editing.
					event.preventDefault();
					commit(event.currentTarget.value);
				}}
			/>
			{props.actions}
		</div>
	);
}

/**
 * Inline colour panel: a hex field, a saturation and brightness area and a hue slider,
 * rendered in place with no trigger, popover or field wrapper. The value is a hex string
 * in and out (`onValueChange` receives lowercase `#rrggbb`). Escape is left to the host.
 */
export function ColorPanel(_props: ColorPanelProps) {
	const [local, rest] = splitProps(_props, [
		"value",
		"defaultValue",
		"onValueChange",
		"disabled",
		"readOnly",
		"autoFocus",
		"hexLabel",
		"actions",
		"className",
		"class",
		"testId",
	]);
	const tid = testIdFn(local.testId);
	const interactive = () => !local.disabled && !local.readOnly;

	return (
		<ColorPicker.Root
			{...rest}
			inline
			// HSB keeps the hue slider keyboard working (Ark's RGB default cannot step the hue channel).
			defaultFormat="hsba"
			value={local.value !== undefined ? toColor(local.value) : undefined}
			defaultValue={toColor(local.defaultValue)}
			onValueChange={(details) => local.onValueChange?.(toHex(details.value))}
			disabled={local.disabled}
			readOnly={local.readOnly}
			class={cx(local.className, local.class)}
			data-scope={"color-input"}
			data-part={"panel"}
			data-testid={tid("--root")}
		>
			<ColorPanelHexField
				label={local.hexLabel ?? "Hex"}
				autoFocus={local.autoFocus}
				interactive={interactive()}
				disabled={local.disabled}
				readOnly={local.readOnly}
				actions={local.actions}
				testId={local.testId}
			/>
			<ColorPanelControls testId={local.testId} passEscape={interactive()} />
		</ColorPicker.Root>
	);
}
