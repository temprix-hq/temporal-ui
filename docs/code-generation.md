# Rules for code generation

Last updated: October 10, 2026

Follow these rules when adding or changing components, utilities, or styles.

## Source of truth

- Shared props, variants, and CSS belong in `@temporal-ui/core`. Framework packages must not invent a parallel public API.
- React and Solid bindings stay in sync: same export names, same core props, same `data-*` attributes, same stories coverage. Do not ship a feature in only one framework unless the task says so.
- Named exports only (no default exports), except Storybook `meta` which uses `export default` as required by Storybook.

## Adding a component

Mirror an existing similar component (Button for simple controls, Dialog/Popover for overlays, Field for labeled inputs, Menu for compound widgets).

### 1. Core

```
packages/core/src/components/<name>/
├── index.ts          # re-export types
├── <name>.ts         # props interface extending BaseComponent<T> (or a more specific core type)
└── <name>.css        # [data-component="<name>"] rules
```

- Props interfaces are generic over children/content `T`.
- Import the new CSS from `packages/core/src/styles.css`.
- Style with `[data-component="…"]`, `[data-size]`, `[data-variant]`, and other data attributes — not generated class hashes.
- Use Tailwind `@apply` inside `@layer components`. Prefer existing tokens from `css/base.css` / `css/theme.css`.
- Do not `@apply` an arbitrary value with a `var()` fallback (`h-[var(--x,200px)]`). The CSS build normalizes it to `var(--x, 200px)`, and Tailwind cannot parse an arbitrary value with a space. Write a plain declaration instead (`height: var(--x, 200px);`). `bun run test:dist` catches this.

### 2. React and Solid

```
packages/<framework>/src/components/<name>/
├── index.ts
├── <Name>.tsx
├── <Name>.stories.tsx
└── <Name>.test.tsx
```

- Import core types from `@temporal-ui/core/<name>`.
- Extend them with the framework node type (`React.ReactNode` / `JSX.Element`) and native or Ark element props.
- Set `data-component`, size/variant attributes, and `data-testid={testId}` (or the `testId()` helper from `@temporal-ui/core/utils/string` for compound slots).
- Export from `packages/<framework>/src/index.ts`.
- tsdown already picks up `src/components/*/index.ts`; no bundler config change for a new folder that follows this layout.

### 3. Ark UI

When the component is an Ark primitive (or you need Ark props/parts):

- Use the **Ark UI MCP** (`get_component_props`, `get_docs`, `get_example`) with `framework` set to `react` or `solid`. Do not guess Ark part names.
- Wrap Ark; do not fork its internals. Map Ark callbacks to the simpler core API when core already defines one (e.g. Dialog `onOpenChange?: (open: boolean) => void`).
- Solid: `mergeProps` / `splitProps`, `<Show>`, `<For>` / `<Index>`. Do not `.map()` inside JSX.
- Solid refs: use a ref callback (`ref={(el) => (input = el)}`), not `ref={input}` on a bare `let`. The Solid package ships preserved JSX, so the bundler does not know the Solid compiler assigns the variable and may drop code that reads it.
- React: destructure props with defaults; spread the rest onto the DOM/Ark root.

### 4. Publish surface

User-facing API or visual changes need a changeset (`bun run changeset`). Internal-only refactors do not.

## File and API conventions

- One primary component per file. Compound parts (Menu items, Sidebar slots, DateInput views) live in the **same folder**, named after the part.
- Helpers used only by one component stay in that file (or that folder). Shared helpers go in `packages/core/src/utils/`.
- `className` is the public class prop (Solid also forwards `class` where existing components do).
- `testId` is the public test hook; it must land on `data-testid`.
- Keep TypeScript strict: no `any` unless an Ark/DOM type hole has no better workaround, and then isolate it.

## CSS and DOM

- Do not add a second styling approach (CSS modules, styled-components, inline style systems). `Box` spacing props that set `style` are an existing exception — do not widen that pattern.
- Loading, disabled, open, and similar states should be data attributes when CSS needs them (`data-loading`, `data-icon`, …).
- Dark mode: rely on `.dark` tokens; do not hard-code light-only colors.

## Do not

- Add Biome, ESLint, or Prettier config.
- Import from a framework package into core.
- Change only the barrel export without a matching per-component `exports` path (already covered by `./*` if the folder and `index.ts` exist).
- Re-wrap Ark `Collapsible` as a Temporal component unless a task explicitly asks; it is already re-exported from the React/Solid barrels.
