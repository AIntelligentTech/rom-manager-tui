# ROM Manager TUI

A terminal user interface (TUI) for managing ROM collections, built with OpenTUI.

## Features

- **Interactive ROM Library Browser**: Browse and search your ROM collection with keyboard navigation
- **Metadata Management**: View and edit ROM metadata (title, platform, release year, etc.)
- **Organization Tools**: Sort, filter, and categorize ROMs
- **OpenTUI-Powered**: Built on OpenTUI v0.1.75 for high-performance terminal rendering

## Requirements

- **Runtime**: Bun (recommended) or Node.js 18+
- **Build Tools**: Zig 0.15.2+ (for OpenTUI native modules)
- **Terminal**: ANSI-compatible terminal emulator (xterm-256color minimum)
- **OS**: Linux, macOS, or Windows WSL

## Installation

```bash
# Clone repository
git clone <repository-url>
cd rom-manager-tui

# Install dependencies
bun install

# Build (if needed)
bun run build

# Run
bun run start
```

## Usage

```bash
# Start the TUI
rom-manager-tui

# With specific ROM directory
rom-manager-tui --path /path/to/roms

# Help
rom-manager-tui --help
```

## Development

This project uses:

- **OpenTUI Skills**: Project-level skills for development guidance
  - `/opentui-tui-development`: Design and implementation patterns
  - `/opentui-layout-review`: Layout review and optimization
- **Version Management**: Semantic versioning with automated release process
- **Documentation**: Version-aware documentation system

### Development Commands

```bash
# Run in development mode
bun run dev

# Run tests
bun test

# Lint
bun run lint

# Format
bun run format
```

### Release Process

```bash
# Check current status
bin/release status

# Bump version (patch, minor, major)
bin/release bump patch

# Validate release readiness
bin/release validate

# Create release and push
bin/release bump minor --push
```

## Architecture

ROM Manager TUI follows OpenTUI best practices:

- **Box-based app shell**: Header, sidebar, main content, status bar
- **ScrollBox for lists**: Viewport culling for performance with large ROM libraries
- **Event-driven updates**: Reactive state management
- **Responsive design**: Adapts to terminal size changes

See `docs/architecture.md` for detailed design documentation.

## Platform Support

- ✅ **Linux/macOS**: Full support with all features
- ⚠️ **Windows**: Use WSL for full OpenTUI features (native Windows has limitations)

## Contributing

Contributions welcome! Please read `CONTRIBUTING.md` for guidelines.

## License

MIT License - See `LICENSE` file for details.

## Version

Current version: 0.0.1 (Initial release)

Built with [OpenTUI](https://github.com/sst/opentui) v0.1.75
