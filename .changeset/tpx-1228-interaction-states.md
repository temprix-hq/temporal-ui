---
"@temporal-ui/core": minor
"@temporal-ui/react": minor
"@temporal-ui/solid": minor
---

TPX-1228: shadcn colour alignment + one hover/pressed rule.

Base tokens in `@temporal-ui/core` now track shadcn neutral (`apps/v4/registry/themes.ts` at shadcn-ui/ui@0e3abd6) in both themes: light canvas/card/popover are white with `secondary`/`muted`/`accent` at 0.97 and `border`/`input` at 0.922; dark canvas drops to 0.145 with `card`/`popover`/`sidebar` at 0.205 and `accent` at 0.269; `--chart-1`…`--chart-5` are defined for the first time. Temporal-only tokens (`--state-*`, `--hover-overlay`, `--pressed-overlay`, `--trigger-hover`, `--outline-hover`, scrollbar and sidebar widths) are kept.

Interaction states follow one directional rule instead of per-component recipes: filled elements mix their own background toward their own foreground token, transparent elements use a translucent foreground overlay (`bg-hover` / `bg-pressed`), pressed is one step further, and selected + hover stacks the overlay on the resting fill. Primary hover/pressed mix toward `primary-foreground` at 20%/28%. `@theme` is now `@theme inline`, so nested `.dark` wrappers (a `.dark` element on a light page) resolve dark tokens correctly.

Component colours aligned with current shadcn: tinted destructive button (`bg-destructive/10 text-destructive`, hover `/20`, dark `/20` → hover `/30`) and badge; switch thumb `dark:bg-foreground` unchecked / `dark:bg-primary-foreground` checked with `dark:bg-input/80` unchecked track; tooltip `bg-foreground text-background` with matching arrow; dialog content `bg-popover`; `dark:aria-invalid:border-destructive/50` on all fields (and `data-invalid` equivalents on checkbox, radio, switch); disabled text input and textarea get `disabled:bg-input/50 dark:disabled:bg-input/80`.

Also fixed: switch thumb visibility in dark, sidebar outline button `hsl()`-wrapped OKLCH border shadow, toggle on-state and calendar today/in-range cells overriding their own hover rules, tabs unselected triggers muted in both themes with a hover state.