# @temporal-ui/react

## 1.0.0

### Major Changes

- [#292](https://github.com/temprix-hq/temporal-ui/pull/292) [`7abb3af`](https://github.com/temprix-hq/temporal-ui/commit/7abb3af6e2145cb973f04f173eac4a9370d31744) Thanks [@dryu](https://github.com/dryu)! - TPX-1228: shadcn colour alignment + one hover/pressed rule. **This is a breaking release (1.0.0): default colours change for every consumer.**

  Base tokens in `@temporal-ui/core` now track shadcn neutral (`apps/v4/registry/themes.ts` at shadcn-ui/ui@0e3abd6) in both themes. Token value changes:

  - Light: `--background`, `--card`, `--popover` → `oklch(1 0 0)` (pure white canvas, cards separate by border and shadow only); `--secondary`, `--muted`, `--accent` → `oklch(0.97 0 0)`; `--border`, `--input` → `oklch(0.922 0 0)`; `--sidebar` → `oklch(0.985 0 0)`; `--sidebar-accent` → `oklch(0.97 0 0)`; `--sidebar-border` → `oklch(0.922 0 0)`.
  - Dark: `--background` → `oklch(0.145 0 0)`; `--card`, `--popover`, `--sidebar` → `oklch(0.205 0 0)`; `--accent`, `--sidebar-accent` → `oklch(0.269 0 0)`; `--sidebar-border` → `oklch(1 0 0 / 10%)`; `--sidebar-ring` → `oklch(0.556 0 0)`. The sidebar is now lighter than the canvas (reverse of before), and card, popover and sidebar share one level.
  - Added: `--chart-1`…`--chart-5` (`oklch(0.87/0.556/0.439/0.371/0.269 0 0)`, both themes — previously referenced but never defined).
  - New interaction-state tokens: `--state-hover`, `--state-pressed` (per theme), plus `--hover-overlay`, `--pressed-overlay`, `--trigger-hover`, `--outline-hover` and the `@theme inline` mappings `--color-hover`, `--color-pressed`, `--color-primary-hover/-pressed`, `--color-secondary-hover/-pressed`, `--color-card-hover/-pressed`, `--color-trigger-hover`, `--color-outline-hover`. Removed: `--color-destructive-hover`, `--color-destructive-pressed`.

  Interaction states follow one directional rule instead of per-component recipes: filled elements mix their own background toward their own foreground token, transparent elements use a translucent foreground overlay (`bg-hover` / `bg-pressed`), pressed is one step further, and selected + hover stacks the overlay on the resting fill. Primary hover/pressed mix toward `primary-foreground` at 20%/28%. `@theme` is now `@theme inline`, so nested `.dark` wrappers (a `.dark` element on a light page) resolve dark tokens correctly.

  Component colours aligned with current shadcn: tinted destructive button (`bg-destructive/10 text-destructive`, hover `/20`, dark `/20` → hover `/30`) and badge; switch thumb `dark:bg-foreground` unchecked / `dark:bg-primary-foreground` checked with `dark:bg-input/80` unchecked track; tooltip `bg-foreground text-background` with matching `fill-foreground` arrow; dialog content `bg-popover`; `dark:aria-invalid:border-destructive/50` on all fields (and `data-invalid` equivalents on checkbox, radio, switch); disabled text input and textarea get `disabled:bg-input/50 dark:disabled:bg-input/80`.

  Also fixed: switch thumb visibility in dark, sidebar outline button `hsl()`-wrapped OKLCH border shadow, toggle on-state and calendar today/in-range cells overriding their own hover rules, tabs unselected triggers muted in both themes with a hover state.

  Consumers overriding tokens (e.g. `temprix-ui`) must re-check their overrides against the new values after upgrading.

### Patch Changes

- [#293](https://github.com/temprix-hq/temporal-ui/pull/293) [`21ba5e6`](https://github.com/temprix-hq/temporal-ui/commit/21ba5e65887bdbfa0e48ff8b9f56db93ed5bd320) Thanks [@dryu](https://github.com/dryu)! - Fix Select dropdowns painting under other layers because the positioner z-index resolved to auto.
- Updated dependencies [[`21ba5e6`](https://github.com/temprix-hq/temporal-ui/commit/21ba5e65887bdbfa0e48ff8b9f56db93ed5bd320), [`7abb3af`](https://github.com/temprix-hq/temporal-ui/commit/7abb3af6e2145cb973f04f173eac4a9370d31744)]:
  - @temporal-ui/core@1.0.0
