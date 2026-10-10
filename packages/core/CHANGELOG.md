# @temporal-ui/core

## 1.1.1

### Patch Changes

- [#308](https://github.com/temprix-hq/temporal-ui/pull/308) [`d0ee725`](https://github.com/temprix-hq/temporal-ui/commit/d0ee725ea63d0b7f42750a4433ae4e53a9f57464) Thanks [@dryu](https://github.com/dryu)! - Fix two problems in the 1.1.0 build. `styles.css` failed to compile in Tailwind v4 apps ("Cannot apply unknown utility class `h-[var(--color-input-area-height,`") because the colour area height used an `@apply` arbitrary value that the CSS build reformatted; it is now a plain `height: var(--color-input-area-height, 200px)` declaration, with the same result. In `@temporal-ui/solid`, `ColorPanel`'s `autoFocus` did nothing because the bundler removed the focus call; it now focuses the hex field again. No API changes.

## 1.1.0

### Minor Changes

- [#298](https://github.com/temprix-hq/temporal-ui/pull/298) [`23c89c0`](https://github.com/temprix-hq/temporal-ui/commit/23c89c0f8161bd3166236e039f784dd856356249) Thanks [@dryu](https://github.com/dryu)! - Add `ColorPanel`, an inline colour panel (hex field, saturation and brightness area, hue slider) with no trigger, popover or field wrapper. The value is a hex string in and out: `value` / `defaultValue` accept `#rrggbb`, `rrggbb` or 3-digit shorthand, and `onValueChange` receives lowercase `#rrggbb`. It supports `disabled`, `readOnly`, `autoFocus` (hex field), `hexLabel`, `actions` (content after the hex field, such as a Done button), `className` and `testId`. Arrow keys work on the area and hue slider, the hex field commits on Enter and on blur, invalid text leaves the value unchanged, and Escape is left to the host. Core adds the `ColorPanelProps` type and a `normalizeHexColor` helper (`@temporal-ui/core/utils/color`, re-exported from `@temporal-ui/react/utils/color` and `@temporal-ui/solid/utils/color`).

  `ColorInput` now renders the same area and hue slider in its popover. Its markup, test ids and output are unchanged. The popover width (`w-96`) moved from the content part to the positioner, and the area height can be changed with the `--color-input-area-height` CSS variable (default `200px`).

- [#304](https://github.com/temprix-hq/temporal-ui/pull/304) [`80bdbe3`](https://github.com/temprix-hq/temporal-ui/commit/80bdbe3390c79ca1507b06384ddc45fa85f28033) Thanks [@dryu](https://github.com/dryu)! - Migrate `DataTable` to TanStack Table v9 (`@tanstack/react-table` and `@tanstack/solid-table` 9.2.4).

  - Both packages create the table with one fixed feature set, exported as `dataTableFeatures` / `DataTableFeatures`: column visibility, row selection (rows keep `data-state="selected"`) and column filtering with the filtered row model. React now supports column filtering like Solid.
  - `ColumnDef<TData>` and `AccessorKeyColumnDef<TData>` are aliases bound to that feature set, so existing column definitions keep their single-generic shape. `VisibilityState` and `RowData` are still exported.
  - `DataTableProps` is now a type alias and no longer accepts `getCoreRowModel`; pass `columns`, `data`, `state` and `on*Change` handlers as before.
  - The `data-table` entry points export a curated list instead of `export * from "@tanstack/*-table"`. Import any other TanStack symbol from `@tanstack/react-table` or `@tanstack/solid-table` directly.
  - `@temporal-ui/solid` now requires `solid-js` `>=1.3.0`.

### Patch Changes

- [#300](https://github.com/temprix-hq/temporal-ui/pull/300) [`3b9c957`](https://github.com/temprix-hq/temporal-ui/commit/3b9c957aeb2d92157fa78cd1207f96527c5b9d4e) Thanks [@dryu](https://github.com/dryu)! - Fix `ColorInput` throwing `Unknown color channel: hue` when the hue slider thumb in its popover is used with the keyboard (arrow keys, Page Up/Down, Home, End). The picker keeps its value in RGB, so the hue keys are now applied to the HSB equivalent instead. The hidden input value (`rgba(r, g, b, 1)`) and the hex string passed to `onValueChange` are unchanged. Core adds a `getHueKeyAction` helper to `@temporal-ui/core/utils/color`.

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
