# Temporal UI

A design system with framework-agnostic core definitions and styles, and React and Solid.js bindings built mostly on [Ark UI](https://ark-ui.com/).

| Package              | Description                                       |
| -------------------- | ------------------------------------------------- |
| `@temporal-ui/core`  | Framework-agnostic component types, CSS and utils |
| `@temporal-ui/react` | React components                                  |
| `@temporal-ui/solid` | Solid.js components                               |

## Install

```bash
npm install @temporal-ui/react   # or @temporal-ui/solid
```

Import the styles once, in your app's CSS entry (Tailwind v4):

```css
@import "tailwindcss";
@import "@temporal-ui/react/styles.css";
```

## Usage

```tsx
import { Button, Alert, Card } from "@temporal-ui/react";

function App() {
	return (
		<Card>
			<Alert variant="info">Welcome to Temporal UI!</Alert>
			<Button variant="primary">Get Started</Button>
		</Card>
	);
}
```

Components are also importable one by one, for example `@temporal-ui/solid/button`. The full component list, props and examples are in Storybook (`bun run react` on port 6006, `bun run solid` on port 6007).

## Development

Requires [Bun](https://bun.sh/). See [`AGENTS.md`](AGENTS.md) for commands, checks and the release process, and [`docs/`](docs) for architecture, code-generation and testing rules.

## License

MIT, see [LICENSE](LICENSE).
