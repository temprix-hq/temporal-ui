/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss(), react()],
	test: {
		globals: true,
		include: ["src/**/*.test.{ts,tsx}"],
		environment: "happy-dom",
		setupFiles: "./node_modules/@testing-library/jest-dom/vitest",
	},
});
