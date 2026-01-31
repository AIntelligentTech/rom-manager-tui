# ROM Manager TUI Architecture

**Version:** 0.0.1
**Last Updated:** 2026-01-31

---

## Overview

ROM Manager TUI is built on OpenTUI v0.1.75, following best practices for terminal user interface design. This document outlines the architectural decisions, component structure, and design patterns.

## Technology Stack

- **OpenTUI v0.1.75**: Terminal UI framework
- **React 18**: Component model via @opentui/react
- **Bun**: Runtime and package manager
- **TypeScript**: Type safety and developer experience
- **Zig 0.15.2+**: Native module compilation

## Application Architecture

### Box-Based App Shell

Following OpenTUI patterns, the app uses a hierarchical box structure:

```
Root Box (100% width/height)
├─ Header Box (title, version info)
├─ Main Content Box (flexGrow=1)
│  ├─ Sidebar Box (30% width)
│  │  └─ Navigation/Filters
│  └─ Content Box (70% width)
│     └─ ROM List (ScrollBox)
└─ Status Bar Box (bottom)
```

### Component Hierarchy

#### Layout Components

- **RootContainer**: Top-level application container
  - Manages terminal resize events
  - Handles global keyboard shortcuts (Ctrl+C, Escape)
  - Provides renderer context

- **AppShell**: Main application layout
  - Header, sidebar, content, status bar structure
  - Responsive breakpoints for small terminals

- **StatusBar**: Bottom status information
  - Current mode, selected item count, keyboard hints

#### Feature Components

- **ROMList**: Scrollable ROM library view
  - Uses ScrollBox with viewport culling
  - Lazy loading for large collections
  - Keyboard navigation (arrow keys, page up/down)

- **ROMDetailView**: Individual ROM metadata display
  - Title, platform, release year, file info
  - Edit mode for metadata updates

- **FilterPanel**: Search and filter controls
  - Platform filter
  - Text search
  - Sort options

### State Management

Event-driven architecture following OpenTUI best practices:

- Component-local state via React useState
- Event listeners for user input (not polling)
- State updates trigger re-renders (React reconciler handles diffing)

### Performance Optimizations

Following OpenTUI performance patterns:

1. **Viewport Culling**: ScrollBox renders only visible items
2. **Event-Driven Updates**: No polling, pure event listeners
3. **Flat Component Trees**: Minimize nesting depth
4. **Frame Diffing**: OpenTUI's built-in optimization (sub-millisecond frames)

## File Structure

```
rom-manager-tui/
├── src/
│   ├── index.tsx              # Entry point
│   ├── components/
│   │   ├── AppShell.tsx       # Main layout
│   │   ├── ROMList.tsx        # List view
│   │   ├── ROMDetail.tsx      # Detail view
│   │   ├── FilterPanel.tsx    # Filters
│   │   └── StatusBar.tsx      # Status bar
│   ├── hooks/
│   │   ├── useROMData.ts      # ROM data management
│   │   └── useKeyboard.ts     # Global keyboard handling
│   ├── utils/
│   │   ├── romParser.ts       # ROM file parsing
│   │   └── metadata.ts        # Metadata utilities
│   └── types/
│       └── rom.ts             # ROM type definitions
├── docs/
│   └── architecture.md        # This file
├── bin/
│   ├── release                # Release management
│   └── rom-manager-tui        # CLI entry point (future)
├── .claude/
│   └── skills/                # OpenTUI development skills
│       ├── opentui-tui-development/
│       └── opentui-layout-review/
├── package.json
├── VERSION
├── CHANGELOG.md
├── INSTALLATION.yaml
└── README.md
```

## Design Patterns

### 1. Box-Based Layout

All layout uses `<box>` containers with Yoga flexbox properties:

```tsx
<box flexDirection="column" width="100%" height="100%">
  <box flexGrow={1}>  {/* Main content */}
  <box>               {/* Status bar */}
</box>
```

### 2. Scrollable Lists

Large lists use `<scrollbox>` with culling:

```tsx
<scrollbox viewportCulling stickyScroll={false} scrollY>
  {visibleROMs.map(rom => <ROMListItem key={rom.id} rom={rom} />)}
</scrollbox>
```

### 3. Event-Driven Updates

```tsx
const handleSelection = (index: number) => {
  setSelectedIndex(index);
  // State update triggers re-render
};

<select options={roms} onChange={handleSelection} />
```

### 4. Keyboard Focus Management

Only one component has `focused={true}` at a time:

```tsx
const [focusedPanel, setFocusedPanel] = useState('list');

<ROMList focused={focusedPanel === 'list'} />
<FilterPanel focused={focusedPanel === 'filter'} />
```

## Platform Considerations

### macOS/Linux
- Full feature support
- Optimized for iTerm2, kitty, Alacritty

### Windows
- **Requires WSL** for full OpenTUI features
- Native Windows has limited support (plain text mode)

### Terminal Requirements
- Minimum: ANSI/xterm-256color
- Recommended: True color support, Kitty keyboard protocol

## Future Enhancements

- [ ] ROM metadata database (SQLite)
- [ ] Cover art display (Kitty graphics protocol)
- [ ] Multi-platform ROM scanning
- [ ] Export/import functionality
- [ ] Theme customization
- [ ] Plugin system for emulator integration

## References

- [OpenTUI Documentation](https://github.com/sst/opentui)
- [OpenTUI Skills v1.0.0](.claude/skills/opentui-tui-development/)
- [Project README](../README.md)
