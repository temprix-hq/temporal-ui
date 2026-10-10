# Testing strategy

Last updated: October 10, 2026

## How to run tests

Tests do **not** require a prior `bun run build`.

```bash
bun run test                      # all packages (Turbo)
bun run test -- <path to file>    # one file
```

Always run the tests you added or changed, and fix failures before finishing.

### Built-output tests

`packages/react/dist-tests/` and `packages/solid/dist-tests/` test the **built** package, not the source, so bundler and CSS build problems that unit tests cannot see are caught. They run with `vitest.dist.config.mts` and need a build first:

```bash
bun run build
bun run test:dist                 # Turbo builds first if needed
```

- `styles.test.ts` compiles `dist/styles.css` with Tailwind v4 the way an app imports it (`@import "tailwindcss"` then the package styles). It fails on anything Tailwind cannot parse, such as an `@apply` value the CSS build reformatted.
- `color-panel.test.tsx` renders `ColorPanel` from `dist/` and checks behaviour that depends on the bundled code (for example `autoFocus`).

Add a built-output test when a fix depends on how the package is bundled. CI runs `test:dist` in the Checks job after the build.

| Package | Environment | Library                                                                                                 |
| ------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| `core`  | `node`      | Vitest only (utils / pure functions)                                                                    |
| `react` | `happy-dom` | `@testing-library/react` + `user-event`                                                                 |
| `solid` | `jsdom`     | `@solidjs/testing-library` (see `packages/solid/vitest.setup.ts` for ResizeObserver / `scrollTo` stubs) |

## Rules

- Prefer `testId` / `data-testid` in queries. If a control is missing one and a stable selector would help, add `testId` (or a slot suffix via `testId()` from `@temporal-ui/core/utils/string`) to the implementation.
- Avoid `any` in tests.
- All exported functions from a source file should be tested in the colocated `*.test.ts(x)` — do not split one module’s units across unrelated test files.
- Do not use text-content assertions as the only query when the string is user-facing copy that might be parameterized; prefer role + test id. Existing tests still use `toHaveTextContent` for titles/labels — match that style in the same file rather than mixing approaches.
- Assert `data-component`, `data-size`, and `data-variant` when those are part of the public styling contract (see `Button.test.tsx`).

## React vs Solid

Keep coverage aligned. A behavior covered in React should be covered in Solid unless it is framework-specific.

**React** — `render(<Component />)`:

```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

it("renders", () => {
	render(<Button testId="submit">Save</Button>);
	expect(screen.getByTestId("submit")).toBeInTheDocument();
});
```

**Solid** — `render(() => <Component />)`:

```tsx
import { render, screen } from "@solidjs/testing-library";
import { Button } from "./Button";

it("renders", () => {
	render(() => <Button testId="submit">Save</Button>);
	expect(screen.getByTestId("submit")).toBeInTheDocument();
});
```

Solid cannot reuse React’s `rerender` the same way. To compare variants, render several instances with distinct `testId`s in one tree, or mount separately.

When mocking Solid trees, iterate with `<For>` / `<Index>`, not `.map()` inside JSX.

## What not to test here

- No Playwright / E2E suite in this repo. Storybook is for visual inspection, not CI screenshots.
- Do not add tests under Storybook config paths. Colocate `*.test.tsx` next to the component.
