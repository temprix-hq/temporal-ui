# Architecture

Last updated: October 5, 2026

Temporal UI is a published design system. Shared contracts and CSS live in core; React and Solid packages are thin, framework-specific bindings over those contracts, mostly wrapping [Ark UI](https://ark-ui.com/).

## Monorepo

```
temporal-ui/
├── packages/
│   ├── core/                 # Types, CSS, utils — no framework runtime
│   ├── react/                # React bindings, stories, tests
│   └── solid/                # Solid.js bindings, stories, tests
├── scripts/                  # copy-core-styles, workspace protocol rewrite for publish
├── docs/                     # Agent and contributor docs
├── .changeset/               # Versioning
├── .github/                  # Quality workflow, composite actions, Dependabot
├── .oxlintrc.json            # oxlint
├── .oxfmtrc.json             # oxfmt
├── lefthook.yml              # pre-commit: format, lint:fix, typecheck
├── turbo.json
└── tsconfig.json
```

Workspaces: `packages/*`. Root scripts orchestrate Turbo (`build`, `test`, `typecheck`, `check`, `clean`) or run repo-wide oxlint/oxfmt directly (`lint`, `format`).

## Packages

### `@temporal-ui/core`

Framework-agnostic definitions and styles. Workspace consumers import TypeScript source via package `exports` (not the built `dist` JS):

| Subpath                          | Source                                |
| -------------------------------- | ------------------------------------- |
| `@temporal-ui/core/<component>`  | `src/components/<component>/index.ts` |
| `@temporal-ui/core/base`         | `src/components/base.ts`              |
| `@temporal-ui/core/utils/<name>` | `src/utils/<name>/index.ts`           |
| `@temporal-ui/core/styles.css`   | `src/styles.css`                      |

Layout:

```
packages/core/src/
├── components/          # One folder per component: types + CSS
│   └── base.ts          # BaseComponent, Placement, …
├── css/
│   ├── animations.css
│   ├── base.css         # Resets, light/dark tokens (`:root` / `.dark`)
│   └── theme.css        # Tailwind v4 `@theme` mapping
├── utils/
│   ├── cx/              # Class name helper
│   └── string/          # getInitials, testId, …
└── styles.css           # Imports global CSS + every component CSS file
```

Core `build` (tsdown) emits `dist/` including bundled `styles.css`. React/Solid copy that file into their own `dist/` via `scripts/copy-core-styles.mjs`.

### `@temporal-ui/react` / `@temporal-ui/solid`

Parallel implementations. Typical layout:

```
packages/<framework>/src/
├── components/<name>/
│   ├── index.ts
│   ├── Component.tsx
│   ├── Component.stories.tsx
│   └── Component.test.tsx
├── hooks/is-mobile/
├── utils/               # Re-exports of core utils
├── index.ts             # Barrel exports
└── styles.css           # @import tailwind + @temporal-ui/core/styles.css
```

Published `exports` (from `dist/`):

- `.` — barrel
- `./*` — per-component (`@temporal-ui/solid/button`, …)
- `./hooks/*`, `./utils/*`
- `./styles.css`

Storybook: React on port **6006**, Solid on port **6007**.

`Collapsible` is re-exported from Ark UI (`@ark-ui/<framework>/collapsible`) rather than wrapped as a Temporal component.

## Component layering

1. **Core** — props interface generic over children `T`, plus CSS that targets `data-component`, `data-size`, `data-variant`, and similar attributes.
2. **Framework package** — extends the core props with the framework’s node/element types and native HTML/Ark props; renders DOM or Ark UI primitives; sets the data attributes CSS expects.
3. **Stories + tests** — one of each per framework package (compound widgets may split tests across files in the same folder).

`BaseComponent<T>` (`packages/core/src/components/base.ts`) is the shared base: `className`, `children`, `testId`.

## Styling

- Plain CSS + Tailwind v4 (`@apply`, `@theme inline`, `@layer components`). No CSS-in-JS.
- Selectors are attribute-based, e.g. `[data-component="button"][data-variant="primary"]`.
- Light/dark tokens live in `packages/core/src/css/base.css`. Dark mode is `.dark` (see `@custom-variant` in that file).
- Consumers import `@temporal-ui/react/styles.css` or `@temporal-ui/solid/styles.css` (or core `styles.css`).

### Interaction states

Hover, pressed and selected colors follow one directional rule instead of per-component
recipes (no alpha fades like `/80` or `/90` on an element's own fill):

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

## Tooling map

| Concern         | Tool                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| Package manager | Bun 1.3.12                                                                                            |
| Task graph      | Turbo 2                                                                                               |
| Bundle          | tsdown                                                                                                |
| Types           | TypeScript 6 + `tsgo` (native preview)                                                                |
| Lint            | oxlint                                                                                                |
| Format          | oxfmt                                                                                                 |
| Tests           | Vitest 4                                                                                              |
| Docs UI         | Storybook 10                                                                                          |
| Headless UI     | Ark UI 5 (`@ark-ui/react`, `@ark-ui/solid`)                                                           |
| Tables          | TanStack Table                                                                                        |
| Git hooks       | Lefthook                                                                                              |
| Versioning      | Changesets                                                                                            |
| CI              | `.github/workflows/quality.yml` — format, lint (`--deny-warnings`), typecheck, build, then unit tests |

## Component catalog

Current first-class components (folders under `packages/core/src/components/`). Keep this table in sync when adding or removing one.

### Layout & structure

| Component    | Description                           |
| ------------ | ------------------------------------- |
| `Box`        | Layout primitive (spacing/size props) |
| `Stack`      | Vertical/horizontal stack             |
| `Card`       | Card container                        |
| `Separator`  | Visual divider                        |
| `Sidebar`    | Collapsible sidebar                   |
| `ScrollArea` | Custom scrollable area                |

### Forms & inputs

| Component     | Description                                     |
| ------------- | ----------------------------------------------- |
| `Button`      | Action button (variants, sizes, loading)        |
| `TextInput`   | Text field                                      |
| `Textarea`    | Multiline text                                  |
| `NumberInput` | Numeric field                                   |
| `Checkbox`    | Checkbox; folder also has `CheckboxGroup`       |
| `RadioGroup`  | Radio group                                     |
| `Select`      | Dropdown                                        |
| `Slider`      | Range slider                                    |
| `Switch`      | On/off switch                                   |
| `ColorInput`  | Color picker                                    |
| `DateInput`   | Date picker                                     |
| `Field`       | Label/error wrapper; folder also has `Fieldset` |
| `Toggle`      | Toggle button; folder also has `ToggleGroup`    |

### Data display

| Component        | Description            |
| ---------------- | ---------------------- |
| `Table`          | Basic table            |
| `DataTable`      | TanStack Table wrapper |
| `Badge`          | Status/label           |
| `Avatar`         | Avatar                 |
| `ProgressLinear` | Linear progress        |

### Feedback & overlays

| Component       | Description                                       |
| --------------- | ------------------------------------------------- |
| `Alert`         | Banner                                            |
| `Dialog`        | Modal                                             |
| `Popover`       | Floating popover                                  |
| `Menu`          | Dropdown menu (compound parts in the same folder) |
| `Notifications` | Toasts                                            |
| `Loader`        | Spinner                                           |
| `Tooltip`       | Tooltip                                           |

### Navigation

| Component   | Description              |
| ----------- | ------------------------ |
| `Tabs`      | Tabs                     |
| `Accordion` | Expand/collapse sections |

Ark UI `Collapsible` is re-exported from the React/Solid barrels, not listed above.
