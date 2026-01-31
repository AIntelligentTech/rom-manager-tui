# React Integration with OpenTUI

This reference focuses on `@opentui/react` and how to design React-based TUIs.

## Entry point

Typical bootstrap sequence:

```ts
import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";

async function main() {
  const renderer = await createCliRenderer({
    // For long-lived apps, you may want to keep the process running
    exitOnCtrlC: false,
  });

  function App() {
    return <text>Hello, OpenTUI!</text>;
  }

  createRoot(renderer).render(<App />);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

**Guidelines:**

- Use `createRoot(renderer).render(<App />)` instead of the deprecated `render(element, config?)` API.
- Treat the React tree as the single source of truth; avoid mutating Renderables outside React except in low-level components.

## Component catalogue

`@opentui/react` maps JSX tags to core `Renderable` classes via a component catalogue.

Common elements (v0.1.75):

- **Layout & display**
  - `<box>` – containers and panels with borders, padding, backgrounds.
  - `<text>` – textual content with inline styling.
  - `<scrollbox>` – scrollable regions with viewport culling.
  - `<group>` – layout-only container (no visual rendering).
  - `<ascii-font>` – ASCII art headings.
- **Input** (Note: `<input>` now extends `<textarea>` in v0.1.75)
  - `<input>` / `<textarea>` – single/multi-line text input with undo/redo.
  - `<select>` – list selection with keyboard and mouse support.
  - `<tab-select>` – tabbed selection with descriptions.
- **Code & diff**
  - `<code>` – syntax-highlighted code snippet (Tree-sitter powered).
  - `<line-number>` – code with line numbers, diffs, diagnostics.
  - `<diff>` – unified or split diff viewer.
  - `<markdown>` – **NEW in v0.1.75:** Markdown rendering with table alignment.

**DevTools Support:**
- Set `DEV=1` environment variable to enable React DevTools integration.
- Inspect component tree, props, and state during development.

Keep your own component library thin: prefer wrapping these primitives in semantic components (e.g. `<StatusBar>`, `<LogPane>`) instead of re-implementing low-level behavior.

## Styling patterns

Two supported styles for layout/visual props:

```tsx
// Direct props
<box border title="Status" padding={1} backgroundColor="#1f2933">
  <text>OK</text>
</box>

// style prop (merged)
<box style={{ border: true, title: "Status", padding: 1, backgroundColor: "#1f2933" }}>
  <text>OK</text>
</box>
```

Rules of thumb:

- Use direct props for booleans and simple configuration flags (`border`, `title`, `borderStyle`).
- Use `style` for layout (`width`, `height`, `flexGrow`, `margin`, `padding`).
- Remember that this is **not** CSS; only documented props have any effect.

## Hooks

Key hooks provided by `@opentui/react`:

### `useRenderer()`

- Returns the underlying `CliRenderer`.
- Use it for:
  - Showing the overlay console (`renderer.console.show()`).
  - Registering low-level key handlers when hooks aren’t sufficient.
  - Reading terminal dimensions.

### `useKeyboard(handler, options?)`

- Subscribes to keyboard events.
- `handler` receives a `KeyEvent` with fields like `name`, `eventType`, and `repeated`.
- `options.release: true` enables key-up events.

Use this for **global shortcuts** (e.g. quit on Escape, switch panes on Tab). Keep handler logic small and delegate to component/state updates.

### `useOnResize(callback)` and `useTerminalDimensions()`

- `useOnResize` fires a callback on terminal size changes.
- `useTerminalDimensions` exposes `{ width, height }` and updates reactively.

Use them to:

- Recompute coarse layout (e.g. split panes 30/70 based on width).
- Avoid fragile, hard-coded dimensions.

### `useTimeline(options?)`

- Registers an animation timeline.
- Animate model state (widths, progress bars, opacities) over time.

Common uses:

- Animated progress bars (e.g. system monitor panels).
- Smoothly transitioning panel sizes.

## React vs `@opentui/core`

Prefer React when:

- You want **component composition** and hooks.
- The app has moderate update frequency (dashboards, forms, wizards).

Prefer `@opentui/core` when:

- You need very low latency and fine-grained control over updates.
- You are building stream-oriented tools (live logs, shells) and want to optimize diffing manually.

Hybrid approach:

- Use React for the overall shell and steady-state UI.
- Embed a few low-level components that talk directly to `@opentui/core` for hotspots.

## Common integration pitfalls

- Forgetting to wrap text in `<text>` and modifiers in `<text>` children.
- Misusing DOM-style events:
  - Use `onInput` / `onSubmit` for `<input>`.
  - Use `onChange` / `onSelect` for `<select>`.
- Not controlling `focused` props, leading to confusing keyboard focus.
- Assuming pixel-perfect layout; always think in characters.

Use this reference when you need to explain or adjust how OpenTUI integrates with React applications.
