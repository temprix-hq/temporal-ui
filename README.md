# Temporal UI Design System

A modern, framework-agnostic design system built for speed and consistency. Temporal UI provides a comprehensive set of UI components with bindings for React and Solid.js.

## ✨ Features

- 🎨 **Modern Design System** - Clean, accessible components with a cohesive visual language
- ⚡ **Framework Agnostic** - Core components work across different JavaScript frameworks
- 🔧 **React & Solid Support** - First-class bindings for popular frameworks
- 🎭 **Component Stories** - Built-in Storybook integration for component documentation
- 🧪 **Fully Tested** - Comprehensive test coverage with Vitest
- 📦 **Monorepo Architecture** - Organized packages for maintainability
- 🎯 **TypeScript First** - Full TypeScript support with excellent DX

## 📦 Packages

| Package              | Description                                         | Framework |
| -------------------- | --------------------------------------------------- | --------- |
| `@temporal-ui/core`  | Framework-agnostic component definitions and styles | Universal |
| `@temporal-ui/react` | React component implementations                     | React     |
| `@temporal-ui/solid` | Solid.js component implementations                  | Solid.js  |

## 🚀 Quick Start

### Installation

```bash
# For React projects
npm install @temporal-ui/react

# For Solid.js projects
npm install @temporal-ui/solid
```

### Basic Usage

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

## 🧱 Components

### Layout & Structure

| Component    | Description                      |
| ------------ | -------------------------------- |
| `Box`        | Basic layout primitive           |
| `Stack`      | Vertical/horizontal stack layout |
| `Card`       | Container with card styling      |
| `Separator`  | Visual divider                   |
| `Sidebar`    | Collapsible sidebar navigation   |
| `ScrollArea` | Custom scrollable area           |

### Forms & Inputs

| Component     | Description                         |
| ------------- | ----------------------------------- |
| `Button`      | Primary action button with variants |
| `TextInput`   | Text input field                    |
| `Textarea`    | Multi-line text input               |
| `NumberInput` | Numeric input with controls         |
| `Checkbox`    | Checkbox with label support         |
| `RadioGroup`  | Radio button group                  |
| `Select`      | Dropdown selection                  |
| `Slider`      | Range slider input                  |
| `ColorInput`  | Color picker input                  |
| `ColorPanel`  | Inline color area, hue and hex      |
| `DateInput`   | Date picker input                   |
| `Field`       | Form field wrapper with label/error |
| `Toggle`      | Two-state toggle button             |
| `ToggleGroup` | Group of toggle buttons             |

### Data Display

| Component   | Description                       |
| ----------- | --------------------------------- |
| `Table`     | Basic table component             |
| `DataTable` | Advanced data table with features |
| `Badge`     | Status/label badge                |
| `Avatar`    | User avatar display               |

### Feedback & Overlays

| Component       | Description               |
| --------------- | ------------------------- |
| `Alert`         | Alert/notification banner |
| `Dialog`        | Modal dialog              |
| `Popover`       | Floating popover content  |
| `Menu`          | Dropdown menu             |
| `Notifications` | Toast notification system |
| `Loader`        | Loading spinner/indicator |

### Navigation

| Component     | Description                    |
| ------------- | ------------------------------ |
| `Tabs`        | Tabbed navigation              |
| `Collapsible` | Expandable/collapsible section |

## 🛠 Development

### Prerequisites

- [Bun](https://bun.sh/) (package manager)
- Node.js 18+

### Setup

```bash
# Clone and install dependencies
git clone <repository-url>
cd temporal-ui
bun install

# Start development servers
bun run react    # React components with Storybook
bun run solid    # Solid.js components with Storybook
```

### Available Scripts

```bash
bun run build      # Build all packages
bun run test       # Run all tests
bun run typecheck  # TypeScript checking
bun run lint       # Lint code with Biome
bun run format     # Format code with Biome
bun run clean      # Clean build artifacts
```

### Storybook

Explore and interact with all components using Storybook:

```bash
# React Storybook (http://localhost:6006)
bun run react

# Solid.js Storybook
bun run solid
```

Storybook provides interactive documentation for all components with live examples, props controls, and usage guidelines.

### Project Structure

```
temporal-ui/
├── packages/
│   ├── core/               # Framework-agnostic components
│   │   └── src/
│   │       ├── components/ # Component definitions and CSS
│   │       ├── css/        # Global styles (animations, base, theme)
│   │       └── utils/      # Shared utilities (color, cx, string)
│   ├── react/              # React implementations
│   │   └── src/
│   │       ├── components/ # React components with stories/tests
│   │       ├── hooks/      # React-specific hooks
│   │       └── utils/      # React-specific utilities
│   └── solid/              # Solid.js implementations
│       └── src/
│           ├── components/ # Solid components with stories/tests
│           └── utils/      # Solid-specific utilities
├── scripts/                # Build and utility scripts
├── .changeset/             # Versioning and changelog management
├── biome.json              # Linter/formatter configuration
├── turbo.json              # Build pipeline configuration
└── tsconfig.json           # TypeScript configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-component`
3. Make your changes and add tests
4. Ensure all tests pass: `bun run test`
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ by the Temporal UI team
