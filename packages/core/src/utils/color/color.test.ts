import { normalizeHexColor } from "./color";

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
