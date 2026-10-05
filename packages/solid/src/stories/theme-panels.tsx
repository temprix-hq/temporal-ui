import type { JSX } from "solid-js";

/**
 * Renders the same content in a light panel and a dark panel side by side.
 * The dark panel is a nested `.dark` wrapper, which resolves dark tokens
 * correctly because `@theme` is declared `inline` in core's theme.css.
 * `children` is a render function so each panel mounts its own copy.
 */
export function ThemePanels(props: { children: () => JSX.Element }) {
	return (
		<div class="flex flex-wrap items-stretch gap-4">
			<div class="min-w-72 flex-1 rounded-lg border bg-background p-4 text-foreground">
				<p class="mb-3 text-xs text-muted-foreground">Light</p>
				{props.children()}
			</div>
			<div class="dark min-w-72 flex-1 rounded-lg border bg-background p-4 text-foreground">
				<p class="mb-3 text-xs text-muted-foreground">Dark</p>
				{props.children()}
			</div>
		</div>
	);
}
