import { getHueKeyAction, normalizeHexColor } from "./color";

describe("normalizeHexColor", () => {
	it("keeps lowercase #rrggbb", () => {
		expect(normalizeHexColor("#2563eb")).toBe("#2563eb");
	});

	it("lowercases and adds the hash", () => {
		expect(normalizeHexColor("#2563EB")).toBe("#2563eb");
		expect(normalizeHexColor("2563EB")).toBe("#2563eb");
	});

	it("expands 3-digit shorthand", () => {
		expect(normalizeHexColor("#AbC")).toBe("#aabbcc");
		expect(normalizeHexColor("abc")).toBe("#aabbcc");
	});

	it("ignores surrounding whitespace", () => {
		expect(normalizeHexColor("  #ff0000 ")).toBe("#ff0000");
	});

	it("rejects anything that is not 3 or 6 hex digits", () => {
		for (const input of [
			"",
			"#",
			"#12",
			"#1234",
			"#12345",
			"#11223380",
			"red",
			"rgb(1,2,3)",
			"#ggg",
			"##fff",
		]) {
			expect(normalizeHexColor(input)).toBeUndefined();
		}
	});

	it("returns undefined for null and undefined", () => {
		expect(normalizeHexColor(null)).toBeUndefined();
		expect(normalizeHexColor(undefined)).toBeUndefined();
	});
});

const key = (k: string, mods: Partial<Parameters<typeof getHueKeyAction>[0]> = {}) =>
	getHueKeyAction({
		key: k,
		shiftKey: false,
		altKey: false,
		ctrlKey: false,
		metaKey: false,
		...mods,
	});

describe("getHueKeyAction", () => {
	it("steps by 1 with arrow keys", () => {
		expect(key("ArrowRight")).toEqual({ step: 1 });
		expect(key("ArrowUp")).toEqual({ step: 1 });
		expect(key("ArrowLeft")).toEqual({ step: -1 });
		expect(key("ArrowDown")).toEqual({ step: -1 });
	});

	it("steps by 10 with Shift or Page keys", () => {
		expect(key("ArrowRight", { shiftKey: true })).toEqual({ step: 10 });
		expect(key("ArrowLeft", { shiftKey: true })).toEqual({ step: -10 });
		expect(key("PageUp")).toEqual({ step: 10 });
		expect(key("PageDown")).toEqual({ step: -10 });
	});

	it("jumps to the ends with Home and End", () => {
		expect(key("Home")).toBe("min");
		expect(key("End")).toBe("max");
	});

	it("ignores other keys and non-Shift modifiers", () => {
		expect(key("a")).toBeUndefined();
		expect(key("ArrowRight", { ctrlKey: true })).toBeUndefined();
		expect(key("ArrowRight", { metaKey: true })).toBeUndefined();
		expect(key("ArrowRight", { altKey: true })).toBeUndefined();
	});
});
