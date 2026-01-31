# ROM Manager TUI - Developer Guide

**Version**: 1.0.0
**Last Updated**: 2026-01-31

Complete guide for developers contributing to ROM Manager TUI.

## Table of Contents

1. [Development Setup](#development-setup)
2. [Project Architecture](#project-architecture)
3. [Development Workflow](#development-workflow)
4. [Building & Testing](#building--testing)
5. [Code Organization](#code-organization)
6. [Contributing](#contributing)

---

## Development Setup

### Prerequisites

- **Bun** 1.0.0+ (recommended) or Node.js 18+
- **Zig** 0.15.2+ (required for OpenTUI native modules)
- **Git** 2.0+
- **macOS**, **Linux**, or **Windows WSL**

### Installation

#### 1. Clone Repository

```bash
git clone https://github.com/AIntelligentTech/rom-manager-tui.git
cd rom-manager-tui
```

#### 2. Install Dependencies

```bash
bun install
```

Or with npm:
```bash
npm install
```

#### 3. Install Build Tools

**macOS** (with Homebrew):
```bash
brew install zig
```

**Linux** (Debian/Ubuntu):
```bash
sudo apt-get install zig
```

**Windows WSL**:
```bash
sudo apt-get install zig
```

Download from [zig.org](https://ziglang.org/download/) if not available.

#### 4. Verify Setup

```bash
bun --version      # Should show 1.0.0+
zig version        # Should show 0.15.2+
bun run dev        # Should start development server
```

### IDE Setup

#### VS Code

Install extensions:
- **ES7+ React/Redux/React-Native snippets** (dsznajder)
- **TypeScript Vue Plugin** (Vue)
- **Prettier - Code formatter**
- **ESLint**
- **Bun for Visual Studio Code**

Create `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": ["typescript", "tsx"]
}
```

#### WebStorm/IntelliJ

1. Set default formatter to Prettier
2. Enable ESLint integration
3. Configure TypeScript version

---

## Project Architecture

### High-Level Overview

```
ROM Manager TUI
├── UI Layer (React Components)
│   └── Built with OpenTUI
├── State Management
│   └── React hooks + Context
├── Data Layer
│   ├── SQLite database
│   └── Configuration (YAML)
├── Integration Layer
│   └── Python script wrappers
└── Utilities
    ├── File operations
    ├── Path handling
    └── Validation
```

### Directory Structure

```
rom-manager-tui/
├── src/
│   ├── index.tsx              Main entry point
│   ├── components/            React components
│   │   ├── Dashboard.tsx
│   │   ├── LibraryBrowser.tsx
│   │   ├── DownloadsManager.tsx
│   │   ├── CurationStudio.tsx
│   │   ├── SDCardManager.tsx
│   │   └── common/            Shared components
│   │       ├── GameListItem.tsx
│   │       ├── SpaceBar.tsx
│   │       ├── Modal.tsx
│   │       └── ...
│   ├── models/                Data models
│   │   ├── game.ts           Game interface
│   │   ├── collection.ts     Collection interface
│   │   ├── config.ts         Configuration
│   │   └── ...
│   ├── database/              Data layer
│   │   ├── index.ts          SQLite connection
│   │   ├── game-repository.ts
│   │   ├── collection-repository.ts
│   │   └── schema.ts         Database schema
│   ├── integrations/          Script wrappers
│   │   ├── python-runner.ts
│   │   ├── scanner.ts
│   │   └── sd-card.ts
│   ├── hooks/                 Custom React hooks
│   │   ├── useLibrary.ts
│   │   ├── useDownloads.ts
│   │   ├── useCuration.ts
│   │   └── ...
│   ├── utils/                 Utilities
│   │   ├── file-system.ts
│   │   ├── path.ts
│   │   ├── validators.ts
│   │   └── ...
│   └── styles/                Theming
│       └── theme.ts
├── tests/                     Test suite
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── docs/                      Documentation
│   ├── TUI_ARCHITECTURE_DESIGN.md
│   ├── USER_GUIDE.md
│   ├── API.md
│   └── RESEARCH_SUMMARY.md
├── bin/                       Scripts
│   ├── release               Version management
│   └── rebuild-index         Database indexing
├── .github/
│   └── workflows/            CI/CD
│       ├── test.yml
│       ├── lint.yml
│       └── release.yml
├── .claude/
│   └── skills/               Claude Code skills
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
├── config.yaml               User configuration
├── CHANGELOG.md
└── README.md
```

### Component Architecture

#### React Components

Components are organized hierarchically:

**Page Components** (Main views):
- `Dashboard`
- `LibraryBrowser`
- `DownloadsManager`
- `CurationStudio`
- `SDCardManager`

**Feature Components** (Panels/sections):
- `GameList` - List of games
- `SystemBrowser` - System sidebar
- `DetailPanel` - Game details
- `SpaceVisualization` - Space usage charts

**UI Components** (Reusable):
- `GameListItem` - Single game row
- `SpaceBar` - Progress bar
- `Modal` - Dialog overlay
- `ConfirmDialog` - Confirmation
- `ProgressModal` - Progress indicator
- `SearchInput` - Search box

**Layout Components**:
- `ThreePanelLayout` - Systems | Games | Details
- `TwoColumnLayout` - Left/right split
- `ModalOverlay` - Overlay positioning

### Data Models

```typescript
// src/models/game.ts
interface Game {
  id: string;
  filename: string;
  path: string;
  size: number;
  title: string;
  system: string;
  region: string;
  verified: boolean;
  priority: number;
  favorite: boolean;
  inCuration: boolean;
  playcount: number;
  createdAt: string;
  updatedAt: string;
}

// src/models/collection.ts
interface Collection {
  id: string;
  name: string;
  description: string;
  maxSize?: number;
  games: string[];
  totalSize: number;
  createdAt: string;
  updatedAt: string;
}

// src/models/config.ts
interface AppConfig {
  paths: {
    library: string;
    downloads: string;
    sdCard?: string;
  };
  preferences: {
    regionPriority: string[];
    autoScanDownloads: boolean;
    confirmDestructive: boolean;
  };
  theme: {
    colorScheme: 'dark' | 'light';
    accentColor: string;
  };
}
```

### State Management

Using React hooks and Context API:

```typescript
// Context for global state
const LibraryContext = createContext<LibraryContextType>(null);
const CurationContext = createContext<CurationContextType>(null);
const ConfigContext = createContext<ConfigContextType>(null);

// Custom hooks
export const useLibrary = () => useContext(LibraryContext);
export const useCuration = () => useContext(CurationContext);
export const useConfig = () => useContext(ConfigContext);
```

### Database Layer

SQLite-based persistent storage:

```typescript
// src/database/index.ts
class Database {
  private db: better-sqlite3.Database;

  constructor(path: string) {
    this.db = new Database(path);
  }

  async initialize(): Promise<void> {
    // Create tables, indexes, FTS
  }

  // Game operations
  async getGame(id: string): Promise<Game>;
  async getGamesBySystem(system: string): Promise<Game[]>;
  async searchGames(query: string): Promise<Game[]>;
  async upsertGame(game: Game): Promise<void>;
  async deleteGame(id: string): Promise<void>;

  // Collection operations
  async getCollection(id: string): Promise<Collection>;
  async getAllCollections(): Promise<Collection[]>;
  async createCollection(collection: Collection): Promise<void>;
  async updateCollection(collection: Collection): Promise<void>;
}
```

---

## Development Workflow

### Running Development Server

```bash
bun run dev
```

This starts the TUI in development mode with:
- Hot reload on file changes
- Full source maps for debugging
- Verbose logging

### Building for Production

```bash
bun run build
```

Creates optimized build in `dist/` directory.

### Code Quality

#### Linting

```bash
# Check for issues
bun run lint

# Auto-fix issues
bun run lint:fix
```

Configured with:
- ESLint (with React plugin)
- TypeScript support
- React best practices

#### Formatting

```bash
# Check formatting
bun run format:check

# Auto-format
bun run format
```

Configured with Prettier:
- 2-space indentation
- Semicolons required
- Single quotes for strings

#### Type Checking

```bash
bun run type-check
```

Ensures TypeScript compilation succeeds.

#### Complete CI Checks

```bash
bun run ci
```

Runs all quality checks:
1. Lint
2. Type-check
3. Format check
4. Tests

### Testing

#### Run All Tests

```bash
bun test
```

#### Run Specific Test

```bash
bun test src/models/__tests__/game.test.ts
```

#### Watch Mode

```bash
bun test --watch
```

#### Coverage Report

```bash
bun run test:coverage
```

#### Test Structure

```
tests/
├── unit/
│   ├── models/
│   │   ├── game.test.ts
│   │   ├── collection.test.ts
│   │   └── config.test.ts
│   ├── utils/
│   │   └── validators.test.ts
│   └── database/
│       └── game-repository.test.ts
├── integration/
│   ├── library-browser.test.ts
│   ├── downloads-manager.test.ts
│   └── curation-studio.test.ts
└── fixtures/
    ├── sample-games.ts
    ├── sample-collections.ts
    └── mock-database.ts
```

### Debugging

#### Debug Mode

```bash
DEBUG=rom-manager:* bun run dev
```

#### Logging Levels

```typescript
import { logger } from './utils/logger';

logger.debug('Detailed info');
logger.info('General info');
logger.warn('Warning');
logger.error('Error');
```

---

## Building & Testing

### Build Configuration

**TypeScript** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**ESLint** (`.eslintrc.json`):
```json
{
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react", "react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Test Framework

Using Bun's built-in test runner:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { Game } from '../models/game';

describe('Game Model', () => {
  it('should create a game with required fields', () => {
    const game: Game = {
      id: 'test-1',
      filename: 'test.gba',
      // ... other fields
    };

    expect(game.id).toBe('test-1');
  });

  it('should validate region field', () => {
    expect(() => {
      validateGame({
        // invalid game
      });
    }).toThrow();
  });
});
```

### Integration Testing

Test components with mock database:

```typescript
import { render } from '@opentui/react-testing';
import { LibraryBrowser } from '../components/LibraryBrowser';

describe('LibraryBrowser', () => {
  it('should display games from selected system', async () => {
    const mockDb = createMockDatabase();
    mockDb.getGamesBySystem.mockResolvedValue([
      { id: '1', title: 'Game 1', system: 'NES' },
      { id: '2', title: 'Game 2', system: 'NES' },
    ]);

    const { screen } = render(
      <LibraryBrowser database={mockDb} />
    );

    expect(screen.getByText('Game 1')).toBeDefined();
    expect(screen.getByText('Game 2')).toBeDefined();
  });
});
```

---

## Code Organization

### Naming Conventions

**Files**:
- Components: PascalCase (e.g., `GameListItem.tsx`)
- Utilities: camelCase (e.g., `fileSystem.ts`)
- Tests: `.test.ts` suffix (e.g., `game.test.ts`)

**Variables & Functions**:
- Constants: UPPER_SNAKE_CASE (e.g., `DEFAULT_THEME`)
- Variables: camelCase (e.g., `gameList`)
- Functions: camelCase (e.g., `parseFilename()`)
- Types/Interfaces: PascalCase (e.g., `GameListItemProps`)

**Components**:
```typescript
// ✅ Good
export const GameListItem: React.FC<GameListItemProps> = (props) => {
  return <box>{/* ... */}</box>;
};

// ❌ Avoid
export const game_list_item = (props) => {
  return <box>{/* ... */}</box>;
};
```

### Import Organization

```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { box, text } from '@opentui/react';

// 2. Internal absolute imports
import { useLibrary } from '@/hooks/useLibrary';
import { Game } from '@/models/game';

// 3. Relative imports
import { GameListItem } from '../components/GameListItem';
import { formatSize } from '../utils/formatting';

// 4. Type imports
import type { GameListItemProps } from '../components/types';
```

### Error Handling

```typescript
// Always use typed errors
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Handle errors explicitly
try {
  await database.getGame(id);
} catch (error) {
  if (error instanceof ValidationError) {
    logger.error(`Invalid ${error.field}: ${error.message}`);
  } else {
    logger.error('Unknown error', error);
  }
}
```

### Documentation

**JSDoc for public APIs**:

```typescript
/**
 * Parse a game filename using GoodTools convention
 * @param filename - The ROM filename (e.g., "Pokemon Emerald (U) [!].gba")
 * @returns Parsed game metadata
 * @throws {ValidationError} If filename is invalid
 */
export function parseFilename(filename: string): Partial<Game> {
  // implementation
}
```

**Component Documentation**:

```typescript
/**
 * Displays a single game item in a list
 *
 * @component
 * @example
 * ```tsx
 * <GameListItem
 *   game={game}
 *   selected={true}
 *   onSelect={() => {}}
 * />
 * ```
 */
export const GameListItem: React.FC<GameListItemProps> = (props) => {
  // implementation
};
```

---

## Contributing

### Code Review Process

1. **Create feature branch**:
   ```bash
   git checkout -b feat/feature-name
   ```

2. **Make changes** with clear commits:
   ```bash
   git commit -m "feat: add fuzzy search to library browser"
   ```

3. **Ensure code quality**:
   ```bash
   bun run ci  # Lint, type-check, format, test
   ```

4. **Push and create PR**:
   ```bash
   git push origin feat/feature-name
   ```

5. **Address review feedback** and update PR

6. **Merge** when approved

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Test updates
- `chore`: Build/dependency updates

**Examples**:
```
feat(library): add fuzzy search filtering
fix(downloads): handle duplicate detection correctly
docs(user-guide): add configuration section
refactor(database): optimize game query performance
test(curation): add must-have series test cases
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Related Issue
Fixes #123

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactoring

## Testing
Describe testing done

## Checklist
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No breaking changes
```

### Release Process

Update version using semantic versioning:

```bash
bin/release bump minor
```

This:
1. Updates VERSION file
2. Updates package.json
3. Updates CHANGELOG.md
4. Creates git tag
5. Pushes to remote

---

## Performance Considerations

### Large Library Optimization

For 7,000+ games:

1. **Database Indexing**: Index frequently queried fields
   ```typescript
   CREATE INDEX idx_system ON games(system);
   CREATE INDEX idx_title ON games(title);
   CREATE VIRTUAL TABLE games_fts USING fts5(title, filename);
   ```

2. **Lazy Loading**: Load only visible items
   ```typescript
   const visibleGames = games.slice(visibleRange.start, visibleRange.end);
   ```

3. **Caching**: Cache frequently accessed data
   ```typescript
   const [gameCache, setGameCache] = useState(new Map());
   ```

4. **Batching**: Load in batches
   ```typescript
   async function loadGames(offset: number, limit: number) {
     return await db.query('SELECT * FROM games LIMIT ? OFFSET ?', [limit, offset]);
   }
   ```

### Memory Management

```typescript
// ✅ Good: Clean up large objects
useEffect(() => {
  return () => {
    gameCache.clear();
  };
}, []);

// ❌ Avoid: Memory leaks
const bigArray = [...largeCollection]; // Never freed
```

### Rendering Performance

```typescript
// ✅ Memoize expensive components
const GameListItem = React.memo(({ game, selected }) => {
  return <box>{game.title}</box>;
});

// ✅ Use key props for lists
{games.map(game => (
  <GameListItem key={game.id} game={game} />
))}
```

---

## Additional Resources

- **OpenTUI Docs**: https://github.com/sst/opentui
- **React Docs**: https://react.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Bun Docs**: https://bun.sh/docs
- **SQLite Docs**: https://www.sqlite.org/docs.html

---

**End of Developer Guide**

Have questions? Open an issue on GitHub or check the architecture specification in [TUI_ARCHITECTURE_DESIGN.md](TUI_ARCHITECTURE_DESIGN.md).
