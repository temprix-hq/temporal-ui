import type { ReactNode } from "react";

/**
 * Renders the same content in a light panel and a dark panel side by side.
 * The dark panel is a nested `.dark` wrapper, which resolves dark tokens
 * correctly because `@theme` is declared `inline` in core's theme.css.
 */
export function ThemePanels(props: { children: ReactNode }) {
	return (
		<div className="flex flex-wrap items-stretch gap-4">
			<div className="min-w-72 flex-1 rounded-lg border bg-background p-4 text-foreground">
				<p className="mb-3 text-xs text-muted-foreground">Light</p>
				{props.children}
			</div>
			<div className="dark min-w-72 flex-1 rounded-lg border bg-background p-4 text-foreground">
				<p className="mb-3 text-xs text-muted-foreground">Dark</p>
				{props.children}
			</div>
		</div>
	);
}
