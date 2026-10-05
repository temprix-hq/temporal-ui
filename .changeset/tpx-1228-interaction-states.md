---
"@temporal-ui/core": minor
"@temporal-ui/react": minor
"@temporal-ui/solid": minor
---

TPX-1228: one hover/pressed rule for core CSS.

Replaces the mixed per-component hover recipes (alpha fades like `/80` and `/90`, accent/muted token swaps, primary tints) with one directional rule backed by state tokens: filled elements mix their own background toward their own foreground token, transparent elements use a translucent foreground overlay (`bg-hover` / `bg-pressed`), pressed is one step further, and selected + hover stacks the overlay on the resting fill. Neutrals darken in light and lighten in dark; step sizes live in new `--state-hover` / `--state-pressed` tokens.

`@theme` is now `@theme inline`, so nested `.dark` wrappers (a `.dark` element on a light page) resolve dark tokens correctly — Storybook pages no longer need to force `html.dark`. New tokens: `--color-hover`, `--color-pressed`, `--color-primary-hover/-pressed`, `--color-secondary-hover/-pressed`, `--color-destructive-hover/-pressed`, `--color-card-hover/-pressed`, `--color-trigger-hover`, `--color-outline-hover`.

Also fixes in the same pass: switch thumb is visible when unchecked in dark (lifts to `--popover`), sidebar outline button border shadow resolves (was wrapped in `hsl()` around an OKLCH value), toggle on-state and calendar today/in-range cells no longer override their own hover rules, tabs unselected triggers are muted in both themes and have a hover state.
