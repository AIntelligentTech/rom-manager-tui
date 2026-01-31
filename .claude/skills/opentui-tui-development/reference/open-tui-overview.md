# OpenTUI Overview

**Latest Version:** 0.1.75 (Released January 25, 2026)
**GitHub:** [sst/opentui](https://github.com/sst/opentui)
**License:** MIT
**Status:** In active development (not production-ready)

## What OpenTUI is

OpenTUI is a TypeScript + Zig framework for building **terminal user interfaces (TUIs)** with a component-based, declarative architecture.

Key properties:

- **Character-grid rendering** – everything is rendered into terminal cells, not pixels.
- **Dual-language design** – TypeScript for developer ergonomics, Zig for performance-critical operations.
- **Core + reconcilers** architecture:
  - `@opentui/core`: imperative renderable primitives and Zig-backed renderer.
  - `@opentui/react`: React reconciler with JSX support.
  - `@opentui/solid`: SolidJS reconciler with reactive primitives.
- **Yoga-based flex layout** – all containers share Facebook's Yoga flexbox layout engine.
- **High-performance rendering** – Frame diffing, run-length encoding, sub-millisecond frame times.

OpenTUI is explicitly marked **not ready for production** but actively maintained. Treat it as a powerful toolkit for:

- Internal tools and dashboards.
- Prototypes and experiments.
- Agentic coding flows and debugging consoles.
- Developer tools requiring terminal UIs.

## Architecture Layers

OpenTUI uses a **dual-language design** for optimal performance and developer experience:

### 1. Renderer Layer (CliRenderer)
- Manages terminal I/O, input events, and rendering loop
- Supports continuous mode (60 FPS target) via `renderer.start()` or on-demand rendering
- Handles raw terminal input and converts to structured key/mouse events
- Built-in console overlay capturing `console.log()` for debugging (toggle with backtick)

### 2. FrameBuffer
- Low-level 2D rendering surface with RGBA color support
- Supports alpha blending and transparent cells for custom graphics
- Uses FFI to Zig for performance-critical rendering operations

### 3. Renderable Hierarchy
- Component-like abstractions that compose into a tree
- All inherit from `BaseRenderable` providing lifecycle, event emission, and tree management
- Integrated with Yoga layout engine for flexbox-style positioning

### 4. Layout Engine
- Uses Facebook's **Yoga** library for cross-platform flexbox layout
- Supports: `flexDirection`, `flexWrap`, `alignItems`, `justifyContent`, `width`/`height`, `padding`/`margin`, `position` (relative/absolute), `zIndex`
- Percentage-based sizing and responsive design

### 5. Rendering Backend (Zig FFI)
- Frame diffing: Compares only changed cells between frames
- Run-length encoding for ANSI generation
- Achieves sub-millisecond frame times and 60+ FPS
- Native text operations: `TextBuffer`, `EditBuffer` (Zig) with TypeScript wrappers

## Packages and roles

- **`@opentui/core` (v0.1.75)**
  - `CliRenderer` – manages terminal rendering, dimensions, and input.
  - `Renderable` hierarchy – base class for all visual and interactive elements.
  - Zig native library – implements high-performance buffer, diffing, and ANSI output.
  - **Requires:** Zig 0.15.2+ for building native modules.
- **`@opentui/react`**
  - Custom React reconciler that maps JSX elements to `Renderable` instances.
  - Component catalogue: tags like `<box>`, `<text>`, `<scrollbox>`, `<input>`, `<textarea>`, `<select>`, `<tab-select>`, `<code>`, `<diff>`, `<markdown>`.
  - Hooks: `useRenderer()`, `useKeyboard()`, `useOnResize()`, `useTerminalDimensions()`.
  - DevTools support via `DEV` environment variable.
- **`@opentui/solid`**
  - SolidJS-specific reconciler following the same catalogue pattern as React.
  - JSX tags use snake_case: `<ascii_font>`, `<tab_select>` (vs kebab-case in React).
  - Compile-time JSX transformation via babel-preset-solid.

## Mental model

- Think of OpenTUI as **React for the terminal**, but remember the target is a **text grid**, not a browser.
- Layout, colors, and borders are controlled via **props**, not CSS.
- The reconciler translates React tree updates into calls to the underlying `Renderable` API.
- Performance-critical operations (diffing, buffer manipulation) live in Zig and are exposed through FFI.

## When to use OpenTUI

Good fits:

- Interactive CLI tools that need more structure than simple stdin/stdout.
- Dashboards, monitors, and inspectors for services and agents.
- Developer tools that should run over SSH or in constrained environments.

Avoid for now:

- Customer-facing, high-stakes production systems.
- Workloads that need rock-solid cross-terminal compatibility and long-term maintenance guarantees.

## Platform Compatibility

### System Requirements
- **Runtime:** Bun (recommended) or Node.js
- **Build Tools:** Zig 0.15.2+ (required for building native modules)
- **Terminal:** ANSI-compatible terminal emulator (xterm-256color minimum)
- **OS Support:**
  - ✅ **Linux/macOS:** Full support with all features
  - ⚠️ **Windows:** Limited support (use WSL for full features)
    - Issue #514: Zig build path handling bug prevents native compilation
    - Fallback: Plain text mode (no syntax highlighting)
    - Persistent terminal mode unavailable

### Terminal Compatibility
- **Minimum:** ANSI/xterm-256color support
- **Recommended:** Modern terminals with enhanced protocols
  - Kitty keyboard protocol (better key handling)
  - Mouse SGR mode (precise mouse events)
  - True color support (24-bit color)
- **Tested:** kitty, iTerm2, modern xterm, Alacritty

## Recent Changes (v0.1.75 - January 25, 2026)

- **Input Component Refactoring:** `InputRenderable` now extends `TextareaRenderable` functionality, unifying the API
- **Markdown Rendering:** New `MarkdownRenderable` component with automatic table alignment
- **Border Style Parsing:** Enhanced border rendering with configurable styles (single, double, rounded)
- **ScrollBox Improvements:** Enhanced manual scroll behavior and viewport culling performance
- **Keyboard Stability:** Improved keyboard selection anchor stability across scrolling operations
- **Grayscale Support:** Added grayscale buffer draw methods for monochrome terminals
- **Signal Handling:** Default exit signal handlers (SIGPIPE, SIGBUS, SIGFPE)

## Core trade-offs

**Pros:**

- Rich, composable UI primitives in the terminal.
- Familiar component patterns via React or Solid.
- High-performance rendering through native code (sub-millisecond frames, 60+ FPS).
- Active development with frequent releases (2-3 per week).
- Strong TypeScript support with full type definitions.

**Cons / risks:**

- **In development:** Not production-ready; API may change.
- **Build requirements:** Requires Zig 0.15.2+ and native compilation.
- **Platform limitations:** Limited Windows support (WSL recommended).
- **Terminal variability:** Rendering depends on terminal emulator capabilities.
- **Breaking changes:** Frequent updates may introduce breaking changes.

## Known Issues & Limitations

1. **Windows Native Support (Issue #514)**
   - Zig build system has path handling bug on Windows
   - Workaround: Use WSL (Windows Subsystem for Linux)
   - Impact: No syntax highlighting, limited feature set

2. **Mouse Input Issues (Issue #313)**
   - Some terminal emulators don't properly map mouse events
   - Workaround: Use compatible terminals (kitty, iTerm2, modern xterm)

3. **Tree-Sitter Highlighting**
   - Initial highlighting delay for large files
   - Batched updates to prevent redundant parsing

Use this reference when deciding whether OpenTUI is appropriate for a given project, and when you need to explain its architecture to a developer who knows React and Node but is new to TUIs.
