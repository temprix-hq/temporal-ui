import type { BaseComponent, Position } from "../base";
import type { FieldProps } from "../field";

export interface ColorInputProps<T> extends FieldProps<T> {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	position?: Position;
}

/**
 * Inline colour panel: a hex field, a saturation and brightness area and a hue slider,
 * rendered in place (no field wrapper, trigger, portal or positioning). `ColorInput`
 * renders the same area and slider in its popover.
 */
export interface ColorPanelProps<T> extends Omit<BaseComponent<T>, "children"> {
	/** Controlled value as a hex colour (`#rrggbb`, `rrggbb` or 3-digit shorthand). */
	value?: string;
	/** Initial value when uncontrolled. Defaults to `#000000`. */
	defaultValue?: string;
	/** Called with the new colour as lowercase `#rrggbb` while the user edits it. */
	onValueChange?: (value: string) => void;
	/** Disables every control in the panel. */
	disabled?: boolean;
	/** Shows the value but does not let the user change it. */
	readOnly?: boolean;
	/** Focuses the hex field when the panel mounts. */
	autoFocus?: boolean;
	/** Visible label of the hex field, also its accessible name. Defaults to `Hex`. */
	hexLabel?: string;
	/** Content after the hex field, in the same row (for example a Done button). */
	actions?: T;
}
