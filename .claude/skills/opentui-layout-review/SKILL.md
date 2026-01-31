---
name: opentui-layout-review
description: Reviews existing OpenTUI layouts and screens, identifying structural issues, focus and scroll problems, and concrete improvements. Use when you already have an OpenTUI layout or plan and want a structured critique.
disable-model-invocation: true
user-invocable: true
---

# OpenTUI Layout Review

You are a specialist reviewer for **OpenTUI-based terminal layouts**. When this skill is invoked, you perform a structured review of an existing layout or design plan, focusing on:

- Information hierarchy and region breakdown.
- Use of `<box>`, `<scrollbox>`, and Yoga layout props.
- Behavior on small terminals and during resize.
- Focus, keyboard navigation, and scroll behavior.
- Performance and complexity hot-spots.

## 1. Collect context

When the user calls this skill:

1. Ask for (or infer) the following:
   - The OpenTUI code or JSX for the relevant screen(s), or a clear description of the layout.
   - Whether they are using `@opentui/react`, `@opentui/core`, or another integration.
   - Target terminal sizes (minimum / typical).
   - Any known issues (e.g. "scrolling feels wrong", "small terminals are cramped").
2. If the user pastes code, scan it with the checklist in `reference/opentui-layout-review-guide.md`.

## 2. Layout review checklist

Follow this checklist during every review:

1. **Regions & hierarchy**
   - Are major regions (header/sidebar/content/footer/status) clearly defined?
   - Are there too many competing panels on a single screen?
2. **Flex & sizing**
   - Are `flexDirection`, `flexGrow`, and sizes set sensibly for each region?
   - Are character-based widths/heights used where precision matters?
3. **Scrolling & overflow**
   - Are long lists/logs in a `<scrollbox>` with `viewportCulling` enabled?
   - Is sticky scroll used appropriately for logs/chat-like views?
4. **Focus & keyboard**
   - Is focus state explicit and limited to one active control at a time?
   - Is Tab/arrow navigation predictable and documented?
5. **Small terminal behavior**
   - Does the layout degrade gracefully at e.g. 80x24?
   - Are there any panels that should collapse or switch to a stacked layout?
6. **Performance**
   - Are large dynamic sections using `<scrollbox>` instead of bespoke rendering?
   - Are there any obvious over-nested layouts or expensive recomputations?

Use `reference/opentui-layout-review-guide.md` for deeper detail and examples while applying this checklist.

## 3. Structure your review output

Always structure the review using this template:

```markdown
# OpenTUI Layout Review

## Summary
- Brief overview of what this layout does and the main issues/opportunities.

## Strengths
- [ ] Clear information hierarchy in header/sidebar/content
- [ ] Appropriate use of <box> containers for major regions
- [ ] Reasonable defaults for terminal sizes

## Issues and Findings

### 1. Layout & Containers
- Describe any problems with region structure, box hierarchy, or flex props.

### 2. Scroll & Overflow
- Call out missing or misused <scrollbox> components.
- Note scroll behavior problems (e.g. logs not sticky, content clipped).

### 3. Focus & Keyboard
- Identify unclear focus rules or conflicting shortcuts.
- Note any components that may not receive input as expected.

### 4. Small-Terminal Behavior
- Describe how the layout likely behaves at 80x24.
- Suggest collapses or alternate layouts when space is constrained.

### 5. Performance & Complexity
- Highlight any hotspots (large lists, frequent updates) and how to mitigate.

## Recommended Changes
- Bullet list of specific changes (e.g. "Wrap X in <scrollbox>", "Split Y into two screens").

## Optional Next Steps
- Ideas for future improvements (e.g. adding a status bar, better keyboard shortcuts).
```

Adapt this template to the user’s scenario, but keep the headings and general flow.

## 4. Depth and tone

- Provide **opinionated but constructive** feedback.
- Prioritize changes that improve:
  - Readability and navigation.
  - Behavior on small terminals.
  - Focus and keyboard ergonomics.
  - Performance in large or busy screens.
- Avoid re-explaining generic React or CLI concepts; focus on OpenTUI-specific concerns.

## 5. Collaboration with `/opentui-tui-development`

When appropriate:

- Use `/opentui-tui-development` to propose a new or alternative layout based on your findings.
- In your review, clearly mark which suggestions are **quick wins** vs **larger redesigns**, so the user can choose an appropriate follow-up with the development skill.
