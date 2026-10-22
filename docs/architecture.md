# Architecture

Last updated: October 22nd, 2026

Temporal UI is a published design system. Shared contracts and CSS live in core; React and Solid packages are thin, framework-specific bindings over those contracts, mostly wrapping [Ark UI](https://ark-ui.com/).

## Packages

- `@temporal-ui/core` holds types, CSS and utils with no framework runtime. Inside the workspace its `exports` point at TypeScript source (`src/components/<name>/index.ts`, `src/utils/<name>/index.ts`, `src/styles.css`), not `dist`. Its build bundles `styles.css`, and React and Solid copy it into their own `dist/` (`scripts/copy-core-styles.mjs`).
- `@temporal-ui/react` and `@temporal-ui/solid` are parallel implementations. They publish `dist/` with per-component subpaths (`@temporal-ui/solid/button`), `hooks/*`, `utils/*` and `styles.css`. Solid ships preserved JSX.
- `Collapsible` is re-exported from Ark UI (`@ark-ui/<framework>/collapsible`) rather than wrapped as a Temporal component.
- The component catalog is the folder list under `packages/core/src/components/`; Storybook shows each one.

### DataTable and TanStack Table

`DataTable` wraps TanStack Table 9 (`useTable` in React, `createTable` in Solid). Both packages declare the same fixed feature set once, in `src/components/data-table/DataTable.tsx`:

```ts
export const dataTableFeatures = tableFeatures({
	columnVisibilityFeature,
	rowSelectionFeature,
	columnFilteringFeature,
	filteredRowModel: createFilteredRowModel(),
	filterFns,
});
export type DataTableFeatures = typeof dataTableFeatures;
```

`DataTableProps<TData>` is a type alias: the core props plus TanStack `TableOptions<DataTableFeatures, TData>` without `features`, so callers pass `columns`, `data`, `state` and `on*Change` handlers but never a feature set. Adding a feature (sorting, pagination, ...) means changing `dataTableFeatures` in both packages.

`@temporal-ui/<framework>/data-table` exports a curated list instead of re-exporting TanStack: `DataTable`, `DataTableProps`, `dataTableFeatures`, `DataTableFeatures`, `RowData`, `VisibilityState` (alias of `ColumnVisibilityState`), and the single-feature-set aliases `ColumnDef<TData, TValue?>` and `AccessorKeyColumnDef<TData, TValue?>`, which keep the v8 call shape. Anything else from TanStack is imported from `@tanstack/<framework>-table` directly.

## Component layering

1. **Core** — props interface generic over children `T`, plus CSS that targets `data-component`, `data-size`, `data-variant`, and similar attributes.
2. **Framework package** — extends the core props with the framework’s node/element types and native HTML/Ark props; renders DOM or Ark UI primitives; sets the data attributes CSS expects.
3. **Stories + tests** — one of each per framework package.

`BaseComponent<T>` (`packages/core/src/components/base.ts`) is the shared base: `className`, `children`, `testId`.

## Styling

- Plain CSS + Tailwind v4 (`@apply`, `@theme inline`, `@layer components`). No CSS-in-JS.
- Selectors are attribute-based, e.g. `[data-component="button"][data-variant="primary"]`.
- Light/dark tokens live in `packages/core/src/css/base.css`. Dark mode is `.dark` (see `@custom-variant` in that file).
- Base tokens track **shadcn neutral** (`apps/v4/registry/themes.ts` at shadcn-ui/ui@0e3abd6) in both themes, plus `--chart-1`…`--chart-5`. Temporal-only additions in `base.css`: `--state-*`, `--hover-overlay`, `--pressed-overlay`, `--trigger-hover`, `--outline-hover`, scrollbar tokens, sidebar width tokens, avatar tokens.
- Consumers import `@temporal-ui/react/styles.css` or `@temporal-ui/solid/styles.css` (or core `styles.css`).

### Interaction states

Hover, pressed and selected colors follow one directional rule instead of per-component
recipes:

1. **Filled elements** hover by mixing their own background toward their own foreground
   token, staying opaque (`primary-hover`, `secondary-hover`, `card-hover`, …).
2. **Transparent elements** hover with a translucent foreground overlay (`bg-hover`).
3. **Pressed** (`:active`) is the same recipe, one step further (`bg-pressed`, `-pressed` tokens).
4. **Selected + hover** stacks the overlay on the resting fill (`background-image:
linear-gradient(var(--hover-overlay), var(--hover-overlay))`) instead of replacing it,
   so hover never weakens selection.

Neutrals therefore darken in light and lighten in dark on any surface; primary moves
toward `primary-foreground`. Step sizes live in `--state-hover` / `--state-pressed`
(base.css, per theme). The overlay tokens `--hover-overlay` / `--pressed-overlay` and the
`--trigger-hover` / `--outline-hover` recipes are redefined per theme in base.css, so raw
`var()` references in component CSS resolve correctly under a nested `.dark` wrapper.

`@theme` must stay `@theme inline`: plain `@theme` resolves color mappings like
`--color-card: var(--card)` at `:root`, so nested `.dark` wrappers keep light colors.
The `@theme inline` mappings (`--color-hover`, `--color-primary-hover`, …) are inlined
into utilities at the point of use; do not reference the emitted `--color-*` variables
from raw CSS — use the base.css tokens instead.

### Deliberate deviations from shadcn

- **Hover and pressed** use the state tokens above, not shadcn's `/80` and `/90` fades,
  which drift with the backdrop.
- **Toggle on state** stays `bg-muted-foreground/15`; shadcn's `bg-muted` resting fill is
  only ~0.03 from a white surface, which is too weak a selected state.
- **Tinted destructive** fills (`bg-destructive/10`, dark `/20`) raise their alpha on
  hover — that moves away from the surface and is allowed; the no-alpha-fade rule covers
  fills that lower their own alpha.
- Component colours otherwise match current shadcn (tinted destructive button and badge,
  switch thumb/track, tooltip, dialog content, invalid and disabled field styles).
