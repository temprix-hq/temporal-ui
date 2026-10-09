const HEX_COLOR = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * Normalizes a hex colour to lowercase `#rrggbb`.
 *
 * Accepts `#rrggbb`, `rrggbb`, `#rgb` and `rgb` (case-insensitive, surrounding whitespace
 * ignored). Returns `undefined` for anything else, including alpha (`#rrggbbaa`) and
 * named or functional colours.
 */
export function normalizeHexColor(input: string | null | undefined): string | undefined {
	const digits = HEX_COLOR.exec(input?.trim() ?? "")?.[1]?.toLowerCase();
	if (!digits) return undefined;
	const full = digits.length === 3 ? digits.replace(/./g, "$&$&") : digits;
	return `#${full}`;
}

export type HueKeyAction = { step: number } | "min" | "max";

/**
 * Maps a keydown on a hue slider thumb to a change in hue, using the same keys and step sizes as
 * zag's channel slider (arrows move by 1, Shift/PageUp/PageDown by 10, Home/End jump to the ends).
 * Returns `undefined` for keys that are not handled, or when a modifier other than Shift is held.
 */
export function getHueKeyAction(event: {
	key: string;
	shiftKey: boolean;
	altKey: boolean;
	ctrlKey: boolean;
	metaKey: boolean;
}): HueKeyAction | undefined {
	if (event.altKey || event.ctrlKey || event.metaKey) return undefined;
	const step = event.shiftKey ? 10 : 1;
	switch (event.key) {
		case "ArrowRight":
		case "ArrowUp":
			return { step };
		case "ArrowLeft":
		case "ArrowDown":
			return { step: -step };
		case "PageUp":
			return { step: 10 };
		case "PageDown":
			return { step: -10 };
		case "Home":
			return "min";
		case "End":
			return "max";
		default:
			return undefined;
	}
}
