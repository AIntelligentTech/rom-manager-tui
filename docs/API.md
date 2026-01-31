# ROM Manager TUI - API Reference

**Version**: 1.0.0
**Last Updated**: 2026-01-31

API documentation for ROM Manager TUI data models, configuration, and integrations.

## Table of Contents

1. [Data Models](#data-models)
2. [Configuration](#configuration)
3. [Database Schema](#database-schema)
4. [Integration APIs](#integration-apis)

---

## Data Models

### Game Model

Represents a single ROM game with metadata.

```typescript
interface Game {
  // File Information
  id: string;                    // UUID primary key
  filename: string;              // Original filename (e.g., "Pokemon Emerald (U) [!].gba")
  path: string;                  // Absolute filesystem path
  size: number;                  // File size in bytes

  // Metadata
  title: string;                 // Clean title (no region/version)
  system: string;                // Console/system (NES, SNES, GBA, PS1, PSP, N64, NDS, Genesis, GBC, GB)
  region?: string;               // USA, Europe, Japan, World
  language?: string;             // ISO 639-1 code (en, ja, fr, de, es)
  version?: string;              // Revision/version (v1.0, Rev A, etc.)
  releaseDate?: string;          // ISO 8601 format (YYYY-MM-DD)

  // Quality Flags (from filename)
  verified: boolean;             // [!] - Good dump verified
  badDump: boolean;              // [b] - Bad/incomplete dump
  hack: boolean;                 // [h] - ROM hack/homebrew
  translation?: boolean;         // [T+] - Fan translation

  // Curation
  priority: number;              // Priority score (0-9999, lower = higher priority)
  favorite: boolean;             // User marked as favorite
  inCuration: boolean;           // Included in active collection
  onSDCard: boolean;             // Currently on SD card
  mustHaveSeries?: string;       // Series name if in must-haves (e.g., "Pokemon", "Zelda")

  // Rich Metadata (from scraping)
  description?: string;          // Game description/synopsis
  genre?: string;                // Primary genre
  developer?: string;            // Developer/publisher
  publisher?: string;            // Publisher
  players?: string;              // Player count (e.g., "1-4")
  rating?: number;               // 0.0-1.0 score

  // File Hashes
  crc32?: string;                // CRC32 checksum
  md5?: string;                  // MD5 hash
  sha1?: string;                 // SHA-1 hash

  // Timestamps
  createdAt: string;             // ISO timestamp when added to library
  updatedAt: string;             // ISO timestamp last modified
  playcount: number;             // Times launched
  lastPlayed?: string;           // ISO timestamp of last play
}
```

**Supported Systems**:
- `NES` - Nintendo Entertainment System
- `SNES` - Super Nintendo Entertainment System
- `N64` - Nintendo 64
- `GBA` - Game Boy Advance
- `GBC` - Game Boy Color
- `GB` - Game Boy
- `Genesis` - Sega Genesis/Mega Drive
- `PS1` - PlayStation 1
- `PSP` - PlayStation Portable
- `NDS` - Nintendo DS
- Custom system names supported

**Region Codes**:
- `USA` - United States (highest priority default)
- `Europe` - PAL region
- `Japan` - NTSC-J region
- `World` - World/International release
- `Unknown` - Unidentified region

**Example**:
```typescript
const game: Game = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  filename: 'Pokemon Emerald (U) [!].gba',
  path: '/Volumes/MyDrive/ROMs/1G1R_Library/GBA/Pokemon Emerald (U) [!].gba',
  size: 16777216,
  title: 'Pokemon Emerald',
  system: 'GBA',
  region: 'USA',
  verified: true,
  badDump: false,
  hack: false,
  priority: 45,
  favorite: true,
  inCuration: true,
  onSDCard: true,
  mustHaveSeries: 'Pokemon',
  playcount: 142,
  crc32: 'ABC123DE',
  createdAt: '2026-01-15T10:30:00Z',
  updatedAt: '2026-01-30T14:22:00Z',
};
```

### Collection Model

Represents a curated collection of games.

```typescript
interface Collection {
  // Identity
  id: string;                    // UUID primary key
  name: string;                  // Display name (e.g., "128GB Favorites")
  description?: string;          // Optional description

  // Size Management
  maxSize?: number;              // Target size in bytes (e.g., 120GB for 128GB cards)
  totalSize: number;             // Calculated total size of included games

  // Games
  games: string[];               // Array of Game IDs in collection

  // Metadata
  createdAt: string;             // ISO timestamp created
  updatedAt: string;             // ISO timestamp last modified
  lastFlashed?: string;          // ISO timestamp last flashed to SD card
}
```

**Example**:
```typescript
const collection: Collection = {
  id: '660e8400-e29b-41d4-a716-446655440000',
  name: '128GB Favorites',
  description: 'Curated 128GB collection for R36S handheld',
  maxSize: 120 * 1024 * 1024 * 1024, // 120 GB in bytes
  games: [
    '550e8400-e29b-41d4-a716-446655440000', // Pokemon Emerald
    '660e8400-e29b-41d4-a716-446655440000', // Pokemon FireRed
    // ... more game IDs
  ],
  totalSize: 119800000000, // 119.8 GB
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-30T14:22:00Z',
  lastFlashed: '2026-01-28T18:45:00Z',
};
```

### Configuration Model

User configuration and preferences.

```typescript
interface AppConfig {
  // Filesystem Paths
  paths: {
    library: string;             // ROM library path
    downloads: string;           // Downloads folder to scan
    sdCard?: string;             // SD card mount point
    spreadsheets?: string;       // Excel/CSV export directory
    pythonScripts?: string;      // Location of Python automation scripts
  };

  // User Preferences
  preferences: {
    // Region priority (index 0 = highest priority)
    regionPriority: string[];    // e.g., ['USA', 'World', 'Europe', 'Japan']

    // Auto-features
    autoScanDownloads: boolean;  // Auto-scan ~/Downloads on startup
    confirmDestructive: boolean; // Confirm before delete/overwrite operations

    // Defaults
    defaultCollection: string;   // Default collection ID
    defaultTheme: 'dark' | 'light';
  };

  // Must-Have Series Configuration
  mustHaveSeries?: {
    [system: string]: {
      name: string;              // Series name
      games: string[];           // Game titles in series
      priority: number;           // Curation priority
    }[];
  };

  // Theme
  theme: {
    colorScheme: 'dark' | 'light';
    accentColor: string;         // Hex color (e.g., '#4299e1')
  };

  // Advanced Settings
  advanced?: {
    cacheBuildingIndex: boolean;
    lazyLoadThreshold: number;   // Number of items before lazy loading
    indexRebuildInterval?: number; // Minutes between auto-rebuild
  };
}
```

**Example**:
```yaml
# config.yaml
paths:
  library: /Volumes/T5Drive/ROMs/1G1R_Library
  downloads: ~/Downloads
  sdCard: /Volumes/ARKOS
  spreadsheets: ~/Documents/roms/
  pythonScripts: ~/Documents/roms/scripts/

preferences:
  regionPriority: [USA, World, Europe, Japan]
  autoScanDownloads: true
  confirmDestructive: true
  defaultCollection: 128gb-favorites
  defaultTheme: dark

theme:
  colorScheme: dark
  accentColor: '#4299e1'

advanced:
  cacheBuildingIndex: true
  lazyLoadThreshold: 50
  indexRebuildInterval: 60
```

---

## Configuration

### Configuration File Locations

1. **Project directory** (checked first): `./config.yaml`
2. **User home** (checked if not found): `~/.rom-manager-tui/config.yaml`
3. **System config** (checked last): `/etc/rom-manager-tui/config.yaml`

### Environment Variables

Override configuration via environment variables:

```bash
# Paths
export ROM_LIBRARY_PATH=/custom/library/path
export ROM_DOWNLOADS_PATH=~/MyDownloads
export ROM_SDCARD_PATH=/mnt/sdcard

# Preferences
export ROM_REGION_PRIORITY="USA,Europe,Japan"
export ROM_AUTO_SCAN=true
export ROM_CONFIRM_DESTRUCTIVE=true

# Theme
export ROM_THEME=dark
export ROM_ACCENT_COLOR="#ff0000"
```

### Configuration Validation

Configuration is validated on startup. Invalid values show errors:

```
ERROR: Invalid regionPriority - must contain: USA, Europe, Japan, World
ERROR: Invalid paths.library - directory does not exist: /nonexistent/path
```

### Config Merging

Configuration is merged from multiple sources (lowest to highest priority):

1. Default built-in configuration
2. System config file (`/etc/rom-manager-tui/config.yaml`)
3. User config file (`~/.rom-manager-tui/config.yaml`)
4. Project config file (`./config.yaml`)
5. Environment variables

Later sources override earlier ones.

---

## Database Schema

### SQLite Tables

#### Games Table

```sql
CREATE TABLE games (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  path TEXT UNIQUE NOT NULL,
  size INTEGER NOT NULL,

  title TEXT NOT NULL,
  system TEXT NOT NULL,
  region TEXT,
  language TEXT,
  version TEXT,
  release_date TEXT,

  verified INTEGER DEFAULT 0,
  bad_dump INTEGER DEFAULT 0,
  hack INTEGER DEFAULT 0,
  translation INTEGER DEFAULT 0,

  priority INTEGER DEFAULT 9999,
  favorite INTEGER DEFAULT 0,
  in_curation INTEGER DEFAULT 0,
  on_sd_card INTEGER DEFAULT 0,
  must_have_series TEXT,

  description TEXT,
  genre TEXT,
  developer TEXT,
  publisher TEXT,
  players TEXT,
  rating REAL,
  cover_art TEXT,

  playcount INTEGER DEFAULT 0,
  last_played TEXT,

  crc32 TEXT,
  md5 TEXT,
  sha1 TEXT,

  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### Indexes

```sql
CREATE INDEX idx_system ON games(system);
CREATE INDEX idx_title ON games(title);
CREATE INDEX idx_region ON games(region);
CREATE INDEX idx_favorite ON games(favorite);
CREATE INDEX idx_priority ON games(priority);
CREATE INDEX idx_crc32 ON games(crc32);
CREATE INDEX idx_must_have ON games(must_have_series);
CREATE INDEX idx_created_at ON games(created_at);
```

#### Full-Text Search

```sql
CREATE VIRTUAL TABLE games_fts USING fts5(
  title,
  filename,
  description,
  content='games',
  content_rowid='id'
);
```

#### Collections Table

```sql
CREATE TABLE collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  max_size INTEGER,
  total_size INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_flashed TEXT
);
```

#### Collection Games (Many-to-Many)

```sql
CREATE TABLE collection_games (
  collection_id TEXT NOT NULL,
  game_id TEXT NOT NULL,
  added_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (collection_id, game_id),
  FOREIGN KEY (collection_id) REFERENCES collections(id),
  FOREIGN KEY (game_id) REFERENCES games(id)
);
```

### Common Queries

#### Get All Games in System

```sql
SELECT * FROM games WHERE system = 'GBA' ORDER BY title;
```

#### Search Games

```sql
SELECT * FROM games_fts WHERE games_fts MATCH 'pokemon' LIMIT 20;
```

#### Get Games in Collection

```sql
SELECT g.* FROM games g
INNER JOIN collection_games cg ON g.id = cg.game_id
WHERE cg.collection_id = 'collection-id'
ORDER BY g.priority;
```

#### Calculate Collection Size

```sql
SELECT SUM(size) as total_size FROM games g
INNER JOIN collection_games cg ON g.id = cg.game_id
WHERE cg.collection_id = 'collection-id';
```

#### Find Duplicates

```sql
SELECT title, system, COUNT(*) as count FROM games
GROUP BY title, system HAVING count > 1;
```

---

## Integration APIs

### Python Script Integration

ROM Manager TUI integrates with Python automation scripts via subprocess calls.

#### Expected Interface

Each Python script should:
1. Accept command-line arguments
2. Output JSON to stdout
3. Exit with code 0 on success, non-zero on error

#### Scanner Integration

**Script**: `scan_new_downloads.py`

```bash
python3 scan_new_downloads.py --downloads ~/Downloads --json
```

**Output**:
```json
{
  "success": true,
  "newGames": [
    {
      "filename": "Pokemon Emerald (U) [!].gba",
      "path": "~/Downloads/Pokemon Emerald (U) [!].gba",
      "size": 16777216,
      "system": "GBA"
    }
  ],
  "duplicates": [
    {
      "filename": "Super Mario 64 (U) [!].z64",
      "path": "~/Downloads/Super Mario 64 (U) [!].z64",
      "reason": "Already in library"
    }
  ]
}
```

#### Importer Integration

**Script**: `add_gaps_to_library.py`

```bash
python3 add_gaps_to_library.py \
  --files "file1.gba,file2.gba" \
  --library /path/to/library \
  --json
```

**Output**:
```json
{
  "success": true,
  "imported": 2,
  "failed": 0,
  "details": [
    {
      "filename": "Pokemon Emerald (U) [!].gba",
      "destination": "/path/to/library/GBA/Pokemon Emerald (U) [!].gba",
      "status": "imported"
    }
  ]
}
```

#### Curation Integration

**Script**: `build_128gb_favorites.py`

```bash
python3 build_128gb_favorites.py \
  --library /path/to/library \
  --max-size 120GB \
  --region-priority USA,World,Europe,Japan \
  --json
```

**Output**:
```json
{
  "success": true,
  "collection": {
    "name": "128GB Favorites",
    "gameCount": 1124,
    "totalSize": 119800000000,
    "games": ["id1", "id2", "..."]
  }
}
```

### REST API (Future)

Reserved for future implementation:

```
GET  /api/games                 List all games
GET  /api/games/:id            Get game details
GET  /api/systems              List systems
GET  /api/collections          List collections
POST /api/collections          Create collection
PUT  /api/collections/:id      Update collection
DELETE /api/collections/:id    Delete collection
```

---

## Type Definitions

### TypeScript Definitions

Complete TypeScript definitions are exported from models:

```typescript
// src/models/index.ts
export type { Game, GamePartial } from './game';
export type { Collection, CollectionPartial } from './collection';
export type { AppConfig, ConfigPaths, ConfigPreferences } from './config';
```

### Enums

```typescript
// Systems
enum GameSystem {
  NES = 'NES',
  SNES = 'SNES',
  N64 = 'N64',
  GBA = 'GBA',
  GBC = 'GBC',
  GB = 'GB',
  Genesis = 'Genesis',
  PS1 = 'PS1',
  PSP = 'PSP',
  NDS = 'NDS',
}

// Regions
enum GameRegion {
  USA = 'USA',
  Europe = 'Europe',
  Japan = 'Japan',
  World = 'World',
  Unknown = 'Unknown',
}
```

---

## Error Handling

### Error Types

```typescript
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

class DatabaseError extends Error {
  constructor(message: string, public query?: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

class IntegrationError extends Error {
  constructor(message: string, public script: string) {
    super(message);
    this.name = 'IntegrationError';
  }
}
```

### Error Responses

```json
{
  "success": false,
  "error": {
    "type": "ValidationError",
    "message": "Invalid game title",
    "details": {
      "field": "title",
      "value": ""
    }
  }
}
```

---

**End of API Reference**

For usage examples, see [USER_GUIDE.md](USER_GUIDE.md) and [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md).
