# ROM Manager TUI - Data Layer Documentation

## Overview

The data layer provides the core functionality for managing ROM metadata, persisting application state, and scanning ROM collections. It consists of four main components:

1. **Game Model** (`src/models/game.ts`) - TypeScript interfaces and type definitions
2. **Database Manager** (`src/models/database.ts`) - SQLite database operations
3. **Configuration Manager** (`src/models/config.ts`) - Application configuration (YAML)
4. **Library Manager** (`src/models/library.ts`) - ROM scanning and metadata extraction

## Architecture

```
┌─────────────────────────────────────┐
│   TUI Application Layer             │
│   (React Components, OpenTUI)       │
└──────────────┬──────────────────────┘
               │
┌──────────────┴──────────────────────┐
│   Models & Managers                 │
├─────────────────────────────────────┤
│ - LibraryManager (scanning)         │
│ - DatabaseManager (persistence)     │
│ - ConfigManager (settings)          │
│ - Parser utilities (GoodTools)      │
└──────────────┬──────────────────────┘
               │
┌──────────────┴──────────────────────┐
│   Storage & Integration             │
├─────────────────────────────────────┤
│ - SQLite DB (library.db)            │
│ - YAML Config (config.yaml)         │
│ - Filesystem (ROM files)            │
└─────────────────────────────────────┘
```

## Components

### 1. Game Model (`src/models/game.ts`)

Defines TypeScript interfaces for ROM data:

```typescript
interface Game {
  // File Information
  id: string;                    // UUID
  filename: string;              // Original filename
  path: string;                  // Absolute path
  size: number;                  // Bytes

  // Metadata
  title: string;                 // Clean title (no region)
  system: string;                // NES, SNES, GBA, etc.
  region?: string;               // USA, Europe, Japan, World
  verified: boolean;             // [!] flag
  badDump: boolean;              // [b] flag
  hack: boolean;                 // [h] flag
  translation: boolean;          // [T+] flag

  // Curation
  priority: number;              // 0-9999 (lower = higher priority)
  favorite: boolean;
  inCuration: boolean;           // In 128GB list?
  onSDCard: boolean;
  mustHaveSeries?: string;

  // Rich Metadata (Optional)
  description?: string;
  genre?: string;
  developer?: string;
  publisher?: string;
  players?: string;
  rating?: number;

  // Usage Statistics
  playcount: number;
  lastPlayed?: string;

  // Hashes (for verification)
  crc32?: string;
  md5?: string;
  sha1?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

### 2. Database Manager (`src/models/database.ts`)

SQLite-based persistence layer with type-safe operations.

#### Initialization

```typescript
import { DatabaseManager } from './models/database';

// Auto-creates database at ~/.rom-manager/library.db
const db = new DatabaseManager();

// Or specify custom path
const db = new DatabaseManager('/custom/path/db.sqlite');
```

#### Schema

The database creates the following tables automatically:

- **games** - ROM metadata and statistics
- **collections** - Named game collections (e.g., "128GB Favorites")
- **collection_games** - Many-to-many relationship between games and collections
- **games_fts** - Full-text search index

#### API Reference

##### Game Operations

```typescript
// Insert or update a game
const gameId = db.upsertGame({
  filename: 'Pokemon Emerald (U) [!].gba',
  path: '/Volumes/T5/Roms/1G1R_Library/GBA/Pokemon Emerald.gba',
  size: 1250000,
  title: 'Pokemon Emerald',
  system: 'GBA',
  region: 'USA',
  verified: true,
});

// Get a game by ID
const game = db.getGame(gameId);

// Get game by path
const game = db.getGameByPath('/path/to/game.gba');

// Get all games
const allGames = db.getAllGames();

// Get games by system
const gbaGames = db.getGamesBySystem('GBA');

// Get games by region
const usaGames = db.getGamesByRegion('USA');

// Get favorite games
const favorites = db.getFavorites();

// Get games in curation collection
const inCuration = db.getInCuration();

// Search games by title
const results = db.searchByTitle('Pokemon');

// Full-text search
const results = db.search('pokemon emerald gba');

// Update game metadata
db.updateGame(gameId, {
  favorite: true,
  priority: 100,
  inCuration: true,
});

// Delete a game
db.deleteGame(gameId);
```

##### Statistics & Queries

```typescript
// Get library statistics
const stats = db.getStats();
// Returns: {
//   totalGames: 7288,
//   totalSize: 22400000000,
//   gamesBySystem: { GBA: 1271, NES: 1624, ... },
//   gamesByRegion: { USA: 5000, Europe: 1500, ... },
//   verifiedCount: 6500,
//   favoriteCount: 342,
//   inCurationCount: 1124
// }

// Get all systems in library
const systems = db.getSystems();  // ['GBA', 'NES', 'SNES', ...]

// Get all regions in library
const regions = db.getRegions();  // ['USA', 'Europe', ...]
```

##### Collection Operations

```typescript
// Create a collection
const collectionId = db.createCollection(
  '128GB Favorites',
  'My curated collection',
  128 * 1024 * 1024 * 1024  // Max size in bytes (optional)
);

// Get a collection
const collection = db.getCollection(collectionId);

// Get all collections
const allCollections = db.getAllCollections();

// Add game to collection
db.addToCollection(collectionId, gameId);

// Get games in collection
const games = db.getCollectionGames(collectionId);

// Remove game from collection
db.removeFromCollection(collectionId, gameId);
```

### 3. Configuration Manager (`src/models/config.ts`)

YAML-based configuration for application settings.

#### Initialization

```typescript
import { ConfigManager } from './models/config';

// Auto-creates config at ~/.rom-manager/config.yaml
const config = new ConfigManager();

// Or specify custom path
const config = new ConfigManager('/custom/path/config.yaml');
```

#### Default Configuration

```yaml
paths:
  library: /Volumes/Tony's T5/Roms/1G1R_Library
  downloads: ~/Downloads
  spreadsheets: /Volumes/Tony's T5/Roms

preferences:
  regionPriority:
    - USA
    - World
    - Europe
    - Japan
  autoScanDownloads: false
  confirmDestructive: true
  defaultCollection: 128GB Favorites

mustHaveSeries:
  GBA:
    - Pokemon
    - Zelda
    - Kirby
    - Mario
  PS1:
    - Final Fantasy
    - Metal Gear Solid
    - Tekken
    - Gran Turismo

theme:
  colorScheme: dark
  accentColor: '#4299e1'
```

#### API Reference

```typescript
// Get entire config
const fullConfig = config.getConfig();

// Get value by dot-notation path
const libraryPath = config.get('paths.library');
const regionPriority = config.get('preferences.regionPriority');

// Get value with default
const customPath = config.get('paths.custom', '/default/path');

// Set value
config.set('paths.library', '/new/path');
config.set('preferences.autoScanDownloads', true);

// Update nested object
config.update('preferences', {
  autoScanDownloads: true,
  confirmDestructive: false,
});

// Convenience getters
config.getLibraryPath();          // '/Volumes/Tony's T5/Roms/1G1R_Library'
config.getDownloadsPath();        // '~/Downloads'
config.getSDCardPath();           // '/Volumes/ARKOS' or undefined
config.getRegionPriority();       // ['USA', 'World', ...]
config.getColorScheme();          // 'dark'
config.getAccentColor();          // '#4299e1'

// Must-have series management
const series = config.getMustHaveSeries('GBA');  // ['Pokemon', 'Zelda', ...]
config.setMustHaveSeries('GBA', ['Pokemon', 'Fire Emblem']);

// Flags
config.shouldConfirmDestructive();    // true
config.shouldAutoScanDownloads();     // false

// Validation
const validation = config.validate();
if (!validation.valid) {
  console.error('Config errors:', validation.errors);
}

// Reset to defaults
config.reset();

// Save to file
config.save();
```

### 4. Library Manager (`src/models/library.ts`)

ROM scanning and metadata extraction.

#### Initialization

```typescript
import { DatabaseManager } from './models/database';
import { ConfigManager } from './models/config';
import { LibraryManager } from './models/library';

const db = new DatabaseManager();
const config = new ConfigManager();
const library = new LibraryManager(db, config);
```

#### API Reference

```typescript
// Scan entire library
const result = await library.scanLibrary();
// Returns: {
//   scanned: 7288,
//   added: 123,
//   updated: 0,
//   errors: 2,
//   totalSize: 22400000000,
//   duration: 45000,  // milliseconds
//   newGames: [...],
//   errorFiles: [{ file: 'bad.gba', error: '...' }, ...]
// }

// Scan specific directory (e.g., Downloads)
const games = await library.scanDirectory('/path/to/Downloads');

// Get library statistics
const stats = library.getStatistics();

// Get all systems
const systems = library.getSystems();

// Get games for a system
const gbaGames = library.getSystemGames('GBA');

// Find duplicate games
const duplicates = library.findDuplicates();
// Returns Map<string, Game[]> where key is 'SYSTEM:title'

// Check if scan is in progress
if (library.isScanning()) {
  console.log('Scan in progress...');
}

// Cancel current scan
library.cancelScan();

// Validate database integrity
const validation = library.validateDatabase();
// Returns: {
//   valid: true,
//   issues: []
// }

// Clean up invalid entries
const cleanup = library.cleanup();
// Returns: {
//   removed: 5,
//   issues: ['Removed 5 orphaned entries']
// }

// Rebuild full-text search index
library.rebuildFTSIndex();
```

## GoodTools Filename Parsing

The `src/utils/parser.ts` module provides utilities for parsing ROM filenames following the GoodTools/No-Intro convention.

### Format

```
Title (Region) [Flags].ext
```

Examples:
- `Pokemon Emerald (U) [!].gba` → GBA, USA, verified
- `Mario (E) [b].snes` → SNES, Europe, bad dump
- `Zelda (J) [T+].z64` → N64, Japan, translation
- `Game Without Region.gb` → GB, no region

### Region Codes

- `(U)` / `(USA)` → USA
- `(E)` / `(EUR)` → Europe
- `(J)` / `(JAP)` → Japan
- `(W)` / `(WOR)` → World
- `(A)` / `(AUS)` → Australia

### Quality Flags

- `[!]` → Verified good dump
- `[b]` → Bad dump (unsupported/incomplete/corrupt)
- `[h]` → Hack/mod
- `[T+]` → Translation

### API Reference

```typescript
import {
  parseFilename,
  detectSystem,
  isROMFile,
  normalizeTitle,
  compareFilenames,
} from './utils/parser';

// Parse filename
const parsed = parseFilename('Pokemon Emerald (U) [!].gba');
// Returns: {
//   title: 'Pokemon Emerald',
//   region: 'USA',
//   verified: true,
//   badDump: false,
//   hack: false,
//   translation: false,
//   extension: '.gba'
// }

// Detect system from extension
const system = detectSystem('Pokemon.gba');  // 'GBA'
const system = detectSystem('game.nes');     // 'NES'

// Check if file is a ROM
isROMFile('game.gba');     // true
isROMFile('readme.txt');   // false

// Normalize title for comparison
const normalized = normalizeTitle('Super Mario Bros.');  // 'super mario bros'

// Compare filenames for similarity
const similarity = compareFilenames(
  'Pokemon Red (U).gb',
  'Pokemon Red (E).gb'
);  // 1.0 (identical title, different region)
```

## Usage Examples

### Example 1: Initialize App

```typescript
import { DatabaseManager } from './models/database';
import { ConfigManager } from './models/config';
import { LibraryManager } from './models/library';

// Initialize managers
const db = new DatabaseManager();
const config = new ConfigManager();
const library = new LibraryManager(db, config);

// Get library path from config
const libPath = config.getLibraryPath();
console.log(`Library: ${libPath}`);

// Scan library
const scanResult = await library.scanLibrary();
console.log(`Found ${scanResult.scanned} games, added ${scanResult.added}`);

// Get statistics
const stats = library.getStatistics();
console.log(`Total: ${stats.totalGames} games, ${stats.totalSize} bytes`);
```

### Example 2: Browse Library

```typescript
// Get all systems
const systems = library.getSystems();

// Get games for a system
const gbaGames = library.getSystemGames('GBA');

// Display results
for (const game of gbaGames.slice(0, 10)) {
  console.log(`${game.title} [${game.region}] ${game.size} bytes`);
}

// Get favorites
const favorites = db.getFavorites();
console.log(`You have ${favorites.length} favorite games`);
```

### Example 3: Create Collection

```typescript
// Create collection
const collectionId = db.createCollection(
  '128GB Favorites',
  'My curated collection for SD card',
  128 * 1024 * 1024 * 1024
);

// Add games to collection
for (const gameId of topGameIds) {
  db.addToCollection(collectionId, gameId);
}

// Get collection info
const games = db.getCollectionGames(collectionId);
const totalSize = games.reduce((sum, g) => sum + g.size, 0);
console.log(`Collection: ${games.length} games, ${totalSize} bytes`);
```

### Example 4: Scan Downloads

```typescript
// Scan downloads folder
const downloadsPath = config.getDownloadsPath();
const newGames = await library.scanDirectory(downloadsPath);

// Categorize
const duplicates = newGames.filter(game => {
  const existing = db.getGameByPath(game.path);
  return !!existing;
});

const newUnique = newGames.filter(game => {
  const existing = db.getGameByPath(game.path);
  return !existing;
});

console.log(`Found ${newUnique.length} new games, ${duplicates.length} duplicates`);
```

### Example 5: Find Duplicates

```typescript
// Find all duplicate games
const duplicates = library.findDuplicates();

for (const [key, games] of duplicates) {
  console.log(`\n${key}:`);
  for (const game of games) {
    console.log(`  - ${game.filename} (${game.region}) [${game.size}]`);
  }
}
```

## Testing

Run the test suite:

```bash
# Run all tests
bun test

# Run specific test file
bun test tests/parser.test.ts
bun test tests/database.test.ts
bun test tests/config.test.ts

# Watch mode
bun test --watch
```

### Test Files

- `tests/parser.test.ts` - Filename parsing tests
- `tests/database.test.ts` - Database operations tests
- `tests/config.test.ts` - Configuration management tests

## Performance Considerations

### Database Indexes

The database has indexes on frequently queried fields:
- `system` - For filtering by system
- `title` - For alphabetical sorting
- `region` - For region filtering
- `favorite` - For favorites view
- `priority` - For curation views
- `crc32` - For duplicate detection

### Full-Text Search

The FTS5 virtual table enables fast text search across:
- Game title
- Filename
- Description

### Caching Strategy

- In-memory: Current view's games (handled by React)
- SQLite: Full library metadata with indexes
- Filesystem: Timestamps prevent re-scanning unchanged directories

## Error Handling

All managers include comprehensive error handling:

```typescript
try {
  const result = await library.scanLibrary();
} catch (error) {
  console.error(`Scan failed: ${error}`);
  // Handle error gracefully
}
```

Database operations use transactions for consistency:

```typescript
// Collections with games are cascaded on delete
db.deleteGame(gameId);  // Automatically removes from collections
```

## File Locations

- Database: `~/.rom-manager/library.db`
- Config: `~/.rom-manager/config.yaml`
- Logs: `~/.rom-manager/logs/` (optional, created during operation)

## Future Enhancements

- [ ] Database migrations system
- [ ] Backup/restore functionality
- [ ] Batch operations optimization
- [ ] CRC32/MD5 hash calculation for duplicate detection
- [ ] ScreenScraper metadata integration
- [ ] gamelist.xml import/export
