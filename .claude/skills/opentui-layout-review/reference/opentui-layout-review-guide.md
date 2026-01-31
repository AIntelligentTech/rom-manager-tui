# OpenTUI Layout Review Guide

This guide supports the `/opentui-layout-review` skill with more detailed patterns and examples.

## 1. Region and hierarchy patterns

Good OpenTUI layouts usually:

- Start with a root `<box flexDirection="column">`.
- Keep a **small number** of top-level regions:
  - Header
  - Main area (often `flexDirection="row"`)
  - Optional footer or status bar
- Avoid more than 3–4 distinct panels on a single screen unless absolutely necessary.

Signs of trouble:

- Deeply nested boxes with no clear semantic purpose.
- Too many panels competing for space in small terminals.
- Inconsistent use of titles/borders that makes hierarchy unclear.

## 2. Flex and sizing best practices

- Use `flexGrow={1}` for main content areas so they expand naturally.
- Fix the width of sidebars (e.g. `width={30}`) when a stable column is needed.
- Prefer explicit character sizes over percentages in very small terminals.
- Use `minHeight` and `minWidth` judiciously to avoid layouts that collapse to unusable sizes.

When reviewing code:

- Check for missing or contradictory `flexDirection` values.
- Watch for children without `flexGrow` in a region that should expand.

## 3. Scroll and overflow patterns

Use `<scrollbox>` for:

- Long lists (files, logs, tasks).
- Chat-like transcripts.
- Panels where content can easily exceed the viewport.

Best practices:

- Keep `viewportCulling` enabled (default) for performance.
- Use `stickyScroll` to keep logs pinned to the bottom until the user scrolls up.
- Avoid manually clipping text via widths alone; prefer proper scroll regions.

Red flags:

- Large `map()` over arrays directly in a `<box>` without scroll.
- User complaints about not being able to reach older entries.

## 4. Focus and keyboard behavior

Focus guidelines:

- One interactive widget should be focused at a time.
- Focus should be obvious (border color, title, or subtle background change).
- Tab or arrow keys should move focus in a predictable order.

When reviewing:

- Check that only one component is rendered with `focused={true}`.
- Ensure that any global `useKeyboard` handlers are coordinated with component-level handlers.

Common improvement ideas:

- Add a simple focus ring around active panels.
- Support jumping between major regions with shortcuts (e.g. `Ctrl+1`, `Ctrl+2`).

## 5. Small-terminal behavior

Design for a minimum of **80x24** unless you have stricter constraints.

Patterns:

- In narrow terminals, collapse sidebars into:
  - A toggleable panel (e.g. bound to a key), or
  - A separate screen reachable by keyboard shortcuts.
- In low-height terminals, consider stacking panels vertically instead of side-by-side.

When reviewing without running the code:

- Estimate how many rows/columns each region consumes.
- Call out regions that will be too cramped or invisible at 80x24.

## 6. Performance considerations

Performance hotspots usually involve:

- Large lists re-rendering frequently.
- Code blocks or diffs showing many lines.
- Animation or frequent state updates.

Mitigations:

- Use `<scrollbox>` with culling.
- Split heavy panels into separate screens or tabs.
- Limit the number of visible items and provide paging if necessary.

## 7. Review checklist (condensed)

Use this checklist during reviews:

- [ ] Clear top-level regions with meaningful roles.
- [ ] Box hierarchy matches the mental model of the UI.
- [ ] Long content areas use `<scrollbox>` appropriately.
- [ ] Focus state is explicit and keyboard navigation is predictable.
- [ ] Layout degrades gracefully at small terminal sizes.
- [ ] Performance-sensitive areas are identified and treated specially.

Refer back to this guide whenever you need deeper rationale or examples while performing `/opentui-layout-review`.
