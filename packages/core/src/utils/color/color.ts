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
