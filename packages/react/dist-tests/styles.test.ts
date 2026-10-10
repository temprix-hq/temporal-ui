import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "tailwindcss";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const tailwindRoot = resolve(dirname(createRequire(import.meta.url).resolve("tailwindcss")), "..");

/** Resolves `@import`s the way a Tailwind v4 app does for this test's input. */
async function loadStylesheet(id: string, base: string) {
	const path = id === "tailwindcss" ? resolve(tailwindRoot, "index.css") : resolve(base, id);
	return { path, base: dirname(path), content: await readFile(path, "utf8") };
}

describe("built styles.css", () => {
	it("compiles under Tailwind v4 when an app imports it", async () => {
		const input = '@import "tailwindcss";\n@import "../dist/styles.css";\n';
		const compiler = await compile(input, { base: here, loadStylesheet });
		const css = compiler.build(["flex"]);

		expect(css).toContain('[data-scope="color-input"]');
		expect(css).not.toContain("@apply");
	});
});
