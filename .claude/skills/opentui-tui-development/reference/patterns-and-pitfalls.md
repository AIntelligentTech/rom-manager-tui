# Patterns and Pitfalls for OpenTUI

This reference distills practical patterns and common mistakes when working with OpenTUI.

## High-level patterns

### 1. Box-based app shells

Pattern: treat `<box>` as your equivalent of `div` for major regions.

Typical shell:

- Root `<box flexDirection="column">`.
- Header `<box>`.
- Main area `<box flexDirection="row" flexGrow={1}>` with sidebar and content.
- Optional footer `<box>`.

Benefits:

- Clear structure, easier to reason about.
- Works well across different terminal sizes.

### 2. Scrollable lists and logs

Pattern: use `<scrollbox>` for long, dynamic content.

Guidelines:

- Keep each row a `<box>` with `width="100%"` and small padding.
- Turn on `stickyScroll` at the bottom for logs/chat.
- Leave `viewportCulling` enabled to avoid rendering off-screen rows.

### 3. Focused forms

Pattern: explicit control of focus and navigation.

- Use one `focused` input at a time.
- Use `useKeyboard` for Tab and global shortcuts.
- Reflect focus visually via border colors or titles.

### 4. Event-driven updates (NOT polling)

Pattern: use component event listeners instead of continuous polling.

- Listen to component events: `onInput`, `onChange`, `onSubmit`, `onSelectionChanged`.
- Update parent state on event emission.
- Avoid setInterval/polling patterns that waste CPU.

Benefits:
- Lower CPU usage and better battery life.
- More responsive UI with less input lag.
- Works with OpenTUI's frame diffing optimization.

### 5. Platform-aware design

Pattern: detect and handle platform limitations gracefully.

**For Windows users:**
- Detect Windows platform and recommend WSL for full features.
- Provide fallback plain-text mode if native compilation unavailable.
- Test on macOS/Linux as primary development targets.

**For terminal compatibility:**
- Test with common terminals: kitty, iTerm2, Alacritty, modern xterm.
- Gracefully degrade when advanced features unavailable.
- Provide keyboard-only alternatives for mouse interactions.

## Common pitfalls and fixes

### Pitfall: treating the terminal like a browser

- **Symptom:** designs that rely on pixel-perfect placement or rich visuals do not translate well.
- **Fix:**
  - Design for **characters**, not pixels.
  - Accept coarser layouts (e.g. half-width panels, thirds) instead of tight grids.
  - Use borders, background colors, and spacing sparingly for emphasis.

### Pitfall: ignoring small terminal sizes

- **Symptom:** layouts that look good at 120x40 but break badly at 80x24.
- **Fix:**
  - Test mentally at 80x24, or use `useTerminalDimensions` to adapt.
  - Make sidebars collapsible when width is below a threshold.

### Pitfall: overloading a single screen

- **Symptom:** too many panels or widgets, high cognitive load.
- **Fix:**
  - Split flows into multiple screens or modes.
  - Use tabs or keybindings to switch between views instead of shrinking everything.

### Pitfall: broken keyboard focus

- **Symptom:** keystrokes go to the wrong component, or nothing appears to respond.
- **Fix:**
  - Track focus in a single source of truth (e.g. `focusedField: "username" | "password" | ...`).
  - Drive `focused` props from that state only.
  - Avoid multiple components with `focused={true}`.

### Pitfall: poor performance with large lists

- **Symptom:** sluggish updates when displaying hundreds of rows.
- **Fix:**
  - Always use `<scrollbox>` and keep `viewportCulling` enabled.
  - Simplify row components; avoid unnecessary nesting and heavy computations per row.

### Pitfall: misusing React DOM habits

- **Symptom:** relying on DOM-specific concepts like CSS classes or DOM events.
- **Fix:**
  - Remember that events are **component-specific**, not browser DOM events.
  - Use the documented props (`onInput`, `onSubmit`, `onChange`, `focused`).
  - Use `style` and direct props for layout, not classes.

### Pitfall: Windows native compilation assumptions

- **Symptom:** code assumes syntax highlighting and full features available on Windows.
- **Fix (v0.1.75):**
  - Check for Windows platform and warn about WSL requirement.
  - Gracefully degrade to plain text mode if CodeRenderable unavailable.
  - Test on WSL, not native Windows command prompt.
  - Document Windows limitations in README (Issue #514).

### Pitfall: ignoring viewport culling

- **Symptom:** rendering large lists (1000+ items) outside ScrollBox kills performance.
- **Fix:**
  - Always wrap large dynamic lists in `<scrollbox>`.
  - Keep `viewportCulling` enabled (it's default).
  - Only visible rows are rendered and hit-tested.

### Pitfall: hardcoding terminal dimensions

- **Symptom:** layouts break on resize; poor UX when terminal size changes.
- **Fix:**
  - Use `useOnResize()` hook to respond to terminal size changes.
  - Use `useTerminalDimensions()` for current size.
  - Design with percentage widths/heights for responsive layouts.
  - Test at multiple sizes: 80x24 (minimum), 120x40 (common), 200x50 (large).

### Pitfall: deep component nesting

- **Symptom:** increases layout calculation time, harder to maintain.
- **Fix:**
  - Flatten hierarchies where possible.
  - Use `<group>` for logical grouping without visual overhead.
  - Keep component trees shallow (3-4 levels max when possible).

## Production-readiness cautions

OpenTUI is powerful but experimental.

When advising on production use:

- Recommend OpenTUI for internal tools and experiments.
- Warn about license/versioning and long-term maintenance risk.
- Suggest more mature TUI libraries for mission-critical or customer-facing systems if stability is a hard requirement.

## Checklist for reviews

When reviewing an OpenTUI design or implementation, walk through this checklist:

- [ ] Layout uses clear `<box>` hierarchies with sensible flex props.
- [ ] Scrollable areas use `<scrollbox>` with viewport culling.
- [ ] Focus and keyboard behavior are explicit and predictable.
- [ ] Text is always inside `<text>`, with modifiers only inside `<text>`.
- [ ] The design considers small terminals and resize behavior.
- [ ] Performance hot paths (logs, large lists) are treated specially.
- [ ] Production use is called out explicitly with caveats if applicable.

Use this reference to keep designs practical, robust, and aligned with OpenTUI's strengths and limitations.
