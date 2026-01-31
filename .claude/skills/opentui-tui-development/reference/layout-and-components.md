# Layout and Core Components

This reference covers the main layout primitives and Yoga-based properties used throughout OpenTUI.

## Layout model

OpenTUI attaches a **Yoga flexbox layout** node to every `Renderable`. You configure layout via props instead of CSS.

Important categories:

- **Flex container props**
  - `flexDirection`: `row | column | row-reverse | column-reverse`
  - `flexWrap`: `nowrap | wrap | wrap-reverse`
  - `alignItems`: `flex-start | center | flex-end | stretch`
  - `justifyContent`: `flex-start | center | flex-end | space-between | space-around`
- **Flex child props**
  - `flexGrow`, `flexShrink`: numbers controlling how children expand or shrink.
  - `flexBasis`: `number | "auto"` – starting size before flexing.
  - `alignSelf`: overrides `alignItems` per child.
- **Sizing**
  - `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`.
  - Accept `number` (cells), `"auto"`, or percentage strings like `"50%"`.
- **Positioning & spacing**
  - `position`: `relative | absolute`.
  - `top`, `right`, `bottom`, `left`: offsets.
  - `margin*` and `padding*` in cells or percentages.
- **Overflow**
  - `overflow`: `visible | hidden | scroll`.

Always design in terms of **terminal cells**, not pixels. A width of `40` means 40 characters, not 40 CSS pixels.

## Box: the primary container

`BoxRenderable` (JSX: `<box>`) is the standard building block for layout.

Key options (often set as props or via the `style` prop):

- **Visuals**
  - `border: boolean` – draw a Unicode border.
  - `borderStyle: "single" | "double" | "rounded"` – border rendering style (v0.1.75+).
  - `borderColor`, `focusedBorderColor` – RGBA colors for borders.
  - `backgroundColor` – RGBA background color.
  - `title`, `titleAlignment: "left" | "center" | "right"` – border title positioning.
- **Spacing**
  - `padding`, `paddingTop`, `paddingRight`, etc. – internal spacing in cells.
- **Layout**
  - All Yoga props listed above (`flexDirection`, `flexGrow`, `width`, etc.).
  - `zIndex` – stacking order for overlapping boxes.

**Typical patterns:**

- App shells built from nested `<box>` containers (header, sidebar, content, status bar).
- Dialogs and panels with titles and padding.
- Overlays and tooltips using `position: absolute` and `zIndex`.

## Group: layout-only container

`GroupRenderable` is a **non-visual** container used for layout only.

Use `<group>` (or the equivalent in your framework) when you need to:

- Group children for flex layout.
- Avoid extra borders or backgrounds.
- Keep the visual hierarchy simple while still structuring the layout tree.

## ScrollBox: scrollable content

`ScrollBoxRenderable` (JSX: `<scrollbox>`) is a composite component for scrollable regions.

High-level structure:

1. Root `ScrollBoxRenderable` – top-level container, may show vertical scrollbar.
2. Wrapper `BoxRenderable` – contains viewport and optional horizontal scrollbar.
3. Viewport `BoxRenderable` – clipping region with `overflow: hidden`.
4. Content container – translated according to scroll offsets.

**Important options:**

- `rootOptions`, `wrapperOptions`, `viewportOptions`, `contentOptions`: nested `BoxOptions` for styling each layer.
- `scrollY`, `scrollX`: booleans controlling which axes can scroll.
- `stickyScroll`: keep the viewport pinned to an edge when content grows (useful for logs/chat).
- `viewportCulling`: when `true` (default), only visible children are rendered/hit-tested.
- `scrollAcceleration`: e.g. `LinearScrollAccel` or `MacOSScrollAccel` for momentum scrolling.
- `momentum: boolean` – enables smooth momentum-based scrolling (v0.1.75+).

**Performance characteristics:**

- Viewport culling dramatically improves performance for large lists (1000+ items).
- Manual scroll behavior enhanced in v0.1.75 for better UX.
- Sub-millisecond frame times even with complex content.

**Patterns:**

- **Log viewers and chat windows** – enable `stickyScroll` at the bottom so new lines remain visible until the user scrolls away.
- **Virtualized lists** – render hundreds or thousands of rows with `viewportCulling` for performance.
- **Smooth scrolling** – use `momentum: true` for macOS-like scroll feel.

## Text and modifiers

OpenTUI distinguishes between **text components** and **modifiers**.

- `<text>`: owns text layout and styling.
- Modifiers: `<span>`, `<strong>`, `<em>`, `<u>`, `<b>`, `<i>`, `<br>` – used **inside** `<text>` only.

Guidelines:

- Always wrap textual content in `<text>`.
- Use modifiers for inline styling, not layout.
- Keep deeply nested text structures small; prefer several simple `<text>` blocks.

## Input and selection components (React layer)

Common interactive components exposed via `@opentui/react`:

### Text Input Components

**IMPORTANT (v0.1.75):** `InputRenderable` now extends `TextareaRenderable` functionality, unifying the API.

- `<input>` / `<textarea>` – text input fields.
  - **Single-line:** Use `<textarea>` with height constraint (replaces legacy `<input>`).
  - **Multi-line:** Use `<textarea>` for full editing with selection.
  - Props: `placeholder`, `onInput(value)`, `onSubmit(value)`, `onChange(value)`, `focused`.
  - Features: Cursor management, undo/redo, Emacs-style keybindings.
  - Native Zig `EditBuffer` for performance-critical text operations.

### Selection Components

- `<select>` – scrollable list/option selection.
  - Props: `options`, `onChange(index, option)`, `focused`.
  - Features: Keyboard navigation, optional scroll indicators, fast scroll (shift modifier).
  - Mouse support: Click to select, wheel to scroll.

- `<tab-select>` – horizontal tabbed navigation.
  - Props: `tabs`, `selectedIndex`, `onChange(index)`.
  - Features: Dynamic height, descriptions, underlines, auto-scroll with arrow indicators.

**Design principles:**

- Only one interactive widget should be `focused={true}` at a time.
- Use `useKeyboard` for **global** shortcuts and navigation; use component props for per-widget actions.
- All input components support custom keybindings via shared `lib/keymapping`.

## Code and diff components

For code-heavy tools, OpenTUI provides:

- `<code>` – **syntax-highlighted code blocks**.
  - Tree-sitter powered for accurate syntax highlighting.
  - Streaming mode for LLM-generated code output.
  - Syntax themes configurable.
  - Performance: Batches updates to prevent redundant Tree-sitter operations.

- `<line-number>` – **line number gutter** component.
  - Wraps `<code>` or other renderables to add line numbers.
  - Per-line colors, signs, and annotations.
  - Caches line info between renders for performance.

- `<diff>` – **unified or split code diff viewer**.
  - Supports both unified and split-view modes.
  - Line-by-line alignment with syntax highlighting.
  - Mouse support in split-view for selection.
  - Optimized diff line cache (v0.1.66+).

## Markdown component (NEW in v0.1.75)

- `<markdown>` – **renders Markdown content**.
  - Automatic table alignment.
  - Block elements (headings, lists, code blocks).
  - Inline styling (bold, italic, code).
  - Use for documentation, help text, or formatted content display.

**Use cases:**

- In-terminal code review tools.
- Debugging dashboards that show logs, traces, or code excerpts.
- Editors that need diagnostics and inline annotations.
- Documentation viewers and help systems.
- LLM output streaming with syntax highlighting.

**When designing UIs using these components, plan:**

- How much code fits comfortably in the viewport.
- How scrolling and navigation will work (use `<scrollbox>`).
- How diagnostics or diff markers map to keyboard interactions.
- Whether to use streaming mode for incremental updates.

Use this reference when you need low-level detail about how to structure an OpenTUI layout and which core components to choose for a given task.
