/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import base from "./vite.config.mts";

// Tests in dist-tests/ run against the built package (`bun run build` first), so bundler
// output bugs that the source tests cannot see are caught.
export default defineConfig({
	...base,
	test: {
		...base.test,
		include: ["dist-tests/**/*.test.{ts,tsx}"],
	},
});
