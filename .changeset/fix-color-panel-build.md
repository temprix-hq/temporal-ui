---
"@temporal-ui/core": patch
"@temporal-ui/react": patch
"@temporal-ui/solid": patch
---

Fix two problems in the 1.1.0 build. `styles.css` failed to compile in Tailwind v4 apps ("Cannot apply unknown utility class `h-[var(--color-input-area-height,`") because the colour area height used an `@apply` arbitrary value that the CSS build reformatted; it is now a plain `height: var(--color-input-area-height, 200px)` declaration, with the same result. In `@temporal-ui/solid`, `ColorPanel`'s `autoFocus` did nothing because the bundler removed the focus call; it now focuses the hex field again. No API changes.
