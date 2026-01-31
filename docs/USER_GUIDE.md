# ROM Manager TUI - User Guide

**Version**: 1.0.0
**Last Updated**: 2026-01-31

Complete guide for using ROM Manager TUI to manage your ROM collection, build curated sets, and manage SD cards.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Interface Overview](#interface-overview)
3. [Core Workflows](#core-workflows)
4. [Keyboard Shortcuts](#keyboard-shortcuts)
5. [Configuration](#configuration)
6. [Advanced Features](#advanced-features)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Installation

#### Quick Start (Bun)

```bash
git clone https://github.com/AIntelligentTech/rom-manager-tui.git
cd rom-manager-tui
bun install
bun run start
```

#### With npm

```bash
npm install
npm start
```

#### First Launch

On first run, ROM Manager TUI creates:
- `config.yaml` - Configuration file (edit to set paths)
- `app.db` - SQLite database for your library
- `cache/` - Temporary files

### Initial Configuration

Edit `config.yaml` to point to your ROM library:

```yaml
paths:
  library: /path/to/your/rom/library
  downloads: ~/Downloads
  sdCard: /Volumes/ARKOS
  spreadsheets: ~/Documents/roms/

preferences:
  regionPriority: [USA, World, Europe, Japan]
  autoScanDownloads: true
  confirmDestructive: true
```

---

## Interface Overview

### Dashboard (Home Screen)

The first screen you see contains:

- **Quick Stats**: System count, favorite count, library size
- **Recent Activity**: Last scans, imports, collections built
- **Must-Have Series Progress**: Completion tracking for 60+ series
- **Storage Overview**: Space usage on drives and SD cards

**Navigation**: Press letters to go to different views:
- `L` - Library Browser
- `D` - Downloads Manager
- `C` - Curation Studio
- `S` - SD Card Manager
- `M` - Metadata Editor
- `,` - Settings

### Library Browser

Three-panel layout for browsing your entire collection:

```
┌─ Systems ──┬─ Games ───────────────┬─ Details ─┐
│ NES (1,624)│ Game Title    (U) [!] │ Title:    │
│ SNES (1,138)│ Another Game (U)    │ System:   │
│ GBA (1,271) │ Pokemon Emerald     │ Region:   │
│ [more]      │ ...                  │ Size:     │
└─────────────┴────────────────────┴───────────┘
```

**Panels**:
- **Left (Systems)**: Lists all systems with game counts
- **Center (Games)**: All games in selected system
- **Right (Details)**: Info about selected game

**Actions**:
- `j`/`k` - Move up/down
- `Space` - Select/multi-select
- `Enter` - View full details
- `e` - Edit game metadata
- `f` - Toggle favorite
- `d` - Delete game
- `/` - Search within library

### Downloads Manager

Scan ~/Downloads and import new games:

```
┌─ Downloads Manager ────────────┐
│ New (23)                       │
│ ☑ Pokemon Emerald (U).gba      │
│ ☑ Pokemon FireRed (U).gba      │
│                                │
│ Duplicates (18)                │
│ ☐ Super Mario 64 (U) [already] │
│                                │
│ [r]escan [i]mport [p]review    │
└────────────────────────────────┘
```

**Workflow**:
1. Press `D` from Dashboard
2. Press `r` to scan ~/Downloads
3. New games pre-selected, duplicates unchecked
4. Press `p` to preview what will be imported
5. Press `i` to import selected games
6. Watch progress bar until complete

### Curation Studio

Build perfectly-sized collections for your SD cards:

```
┌─ Curation Studio ──────────────┐
│ 128GB Favorites                │
│                                │
│ Space: ███████░░ 119.8/120 GB  │
│                                │
│ Must-Have Series:              │
│ GBA: ████████████ 28/28  100%  │
│ PS1: ████████████░░ 18/20 90%  │
│                                │
│ [a]uto-build [s]ave [F]lash    │
└────────────────────────────────┘
```

**Features**:
- Auto-build collection with intelligent scoring
- Track must-have series from your conversation history
- Manual add/remove of games
- Space optimization (fill to exact capacity)
- Save to Excel for spreadsheet management
- Flash directly to SD card

### SD Card Manager

Safely manage SD card operations:

```
┌─ SD Card Manager ──────────────┐
│ Card: /Volumes/ARKOS (128GB)   │
│ Firmware: ArkOS v2.1.3         │
│                                │
│ Current Games: 1,124           │
│ Space Used: 94.2 GB (78.9%)    │
│                                │
│ [f]lash [b]ackup [e]ject       │
└────────────────────────────────┘
```

**Features**:
- Auto-detect SD cards
- Identify firmware (ArkOS, Batocera, RetroPie)
- View current contents
- Backup save states before flashing
- Flash collections safely
- Verify file integrity
- Safe eject with confirmation

---

## Core Workflows

### Workflow 1: Import New Games from Downloads

**Time**: 5-10 minutes | **Difficulty**: Easy

**Goal**: Scan ~/Downloads for new games and import them to your library

**Steps**:

1. **Open Downloads Manager**
   ```
   Press [D] from Dashboard
   ```

2. **Scan for New Games**
   ```
   Press [r] to rescan ~/Downloads
   ```
   - New games appear at top (pre-selected)
   - Duplicates appear at bottom (unchecked)
   - Errors and unsupported files listed

3. **Review New Games** (Optional)
   ```
   Press [j]/[k] to scroll through list
   ```
   - Check for games you don't want
   - Uncheck with [Space]

4. **Preview Import**
   ```
   Press [p] for dry-run preview
   ```
   - Shows exactly what will be copied
   - Shows target directory structure
   - No actual files copied

5. **Import Games**
   ```
   Press [i] to import
   ```
   - Progress bar shows copy status
   - Files organized by system
   - Duplicates handled automatically
   - Watch for completion

6. **Verify Import**
   ```
   Navigate to Library Browser ([L])
   Press [1] for first system
   Verify new games appear
   ```

**Tips**:
- Run weekly to stay current with downloads
- Pre-select only games you want (uncheck duplicates)
- Preview shows exactly what will happen
- Cancel anytime with [Esc] during copy

---

### Workflow 2: Build Your 128GB SD Card Collection

**Time**: 30 minutes | **Difficulty**: Medium

**Goal**: Create an optimized 128GB collection for your SD card

**Steps**:

1. **Open Curation Studio**
   ```
   Press [C] from Dashboard
   ```

2. **View Current Collection**
   - Shows 128GB Favorites (your default collection)
   - Space usage bar
   - Must-have series progress
   - Identifies gaps (missing series)

3. **Auto-Build Collection** (Recommended)
   ```
   Press [a] for auto-build
   ```
   - Algorithm runs with intelligent scoring:
     - Must-have series (highest priority)
     - Top-rated games
     - Region preferences (USA > World > Europe > Japan)
   - Fills to exact capacity (120 GB exactly)
   - Shows progress

4. **Review Results**
   ```
   Press [Space] to see system breakdown
   ```
   - PSP: 412 games, 38.2 GB
   - PS1: 168 games, 28.4 GB
   - NDS: 142 games, 18.7 GB
   - [more systems]

5. **Adjust Manually** (Optional)
   ```
   Press [f] to find games to add
   Press [r] to remove selected
   ```
   - Search by title or series
   - Add favorites
   - Remove unwanted
   - Space updates in real-time

6. **Check Must-Haves**
   ```
   Press [m] to view must-have coverage
   ```
   - See which series are complete
   - See which have gaps
   - Find missing games in library
   - Add to collection

7. **Save Collection**
   ```
   Press [s] to save
   ```
   - Saves as "128GB Favorites"
   - Ready for SD card flashing

8. **Export to Excel** (Optional)
   ```
   Press [x] for export
   ```
   - Creates spreadsheet with all games
   - Useful for tracking/sharing

---

### Workflow 3: Flash SD Card with Your Collection

**Time**: 15-30 minutes (depends on speed) | **Difficulty**: Medium

**Goal**: Deploy your curated collection to an SD card

**Prerequisites**:
- SD card inserted and mounted
- ArkOS/Batocera firmware on card
- Free space ≥ collection size

**Steps**:

1. **Insert SD Card**
   - Connect via card reader
   - Mac/Linux auto-mounts
   - Verify with [S] from Dashboard

2. **Open SD Card Manager**
   ```
   Press [S] from Dashboard
   ```
   - TUI detects card
   - Shows card info:
     - Mount point: /Volumes/ARKOS
     - Filesystem: exFAT
     - Capacity: 128 GB
     - Used: 94.2 GB

3. **View Current Contents**
   ```
   Press [v] to view
   ```
   - Lists systems currently on card
   - Game counts by system
   - Total games and size

4. **Backup Save States** (Optional)
   ```
   Press [b] for backup
   ```
   - Preserves your save games
   - Stored in `backup/savedata/`
   - Useful if card already has games

5. **Flash Collection**
   ```
   Press [f] to flash
   ```
   - Confirm: "Overwrite ROMs on SD?" (Y/n)
   - Progress modal shows:
     - Current file being copied
     - Speed (MB/s)
     - Files copied / total files
     - ETA

   Example:
   ```
   Copying to SD Card
   ████████████░░░░░░░░░░ 58% (412/710)

   Current: Pokemon Emerald (U) [!].gba
   Speed: 12.4 MB/s
   ETA: 2m 14s
   ```

6. **Verification**
   ```
   TUI verifies checksums automatically
   Shows: ✓ All files verified
   ```

7. **Restore Save States** (If backed up)
   ```
   Press [r] to restore
   ```
   - Copies saves back to card
   - Preserves existing saves

8. **Safely Eject**
   ```
   Press [e] to eject
   ```
   - Safely unmounts card
   - Card safe to remove

**Safety Features**:
- Confirmation before destructive operations
- Checksums verify successful copy
- Backup save states automatically
- Cancel anytime during copy
- Progress tracking with ETA

---

### Workflow 4: Find Missing Must-Have Games

**Time**: 10 minutes | **Difficulty**: Easy

**Goal**: Identify and add missing games from your must-have series

**Steps**:

1. **Open Curation Studio**
   ```
   Press [C] from Dashboard
   ```

2. **Check Must-Have Progress**
   ```
   Look at "Must-Have Series Coverage" panel
   ```
   - Shows all series with completion %
   - Green ✓ = 100% complete
   - Yellow ⚠ = Partial (e.g., 90%)

3. **Find Incomplete Series**
   ```
   Look for <100% series
   Example: PS1 18/20 (90%)
   ```

4. **View Missing Games**
   ```
   Press [m] to manage must-haves
   Select "PS1" series
   Shows: Tekken 3, Gran Turismo [MISSING]
   ```

5. **Search Library**
   ```
   Press [f] to find in library
   TUI searches for each missing game
   Shows matches found/not found
   ```

6. **Add to Collection**
   ```
   For each found game:
   Press [a] to add to 128GB collection
   Space recalculates automatically
   ```

7. **Save Updated Collection**
   ```
   Press [s] to save
   ```

**Tip**: Run this monthly to maintain series completion!

---

### Workflow 5: Organize Games by Region

**Time**: 5 minutes | **Difficulty**: Easy

**Goal**: Filter and organize games by region preference

**Steps**:

1. **Open Library Browser**
   ```
   Press [L] from Dashboard
   ```

2. **View Current Filters**
   ```
   Status bar shows: "All games | All regions"
   ```

3. **Filter by Region**
   ```
   Press [f] for filters
   Select region filter
   Options: USA, Europe, Japan, World, All
   ```

4. **View Filtered Results**
   ```
   Game list updates instantly
   Status shows: "Filtered: 2,134 USA games"
   ```

5. **Configure Region Priority**
   ```
   Press [,] for Settings
   Select "Region Preferences"
   Drag to reorder: USA → World → Europe → Japan
   Save preferences
   ```

**Usage**: Helps manage duplicate regions, identify gaps

---

## Keyboard Shortcuts

### Global Navigation

| Key | Action |
|-----|--------|
| `H` | Home (Dashboard) |
| `L` | Library Browser |
| `D` | Downloads Manager |
| `C` | Curation Studio |
| `S` | SD Card Manager |
| `M` | Metadata Editor |
| `,` | Settings |
| `/` | Global search |
| `?` | Help overlay |

### Movement

| Key | Action |
|-----|--------|
| `j` / `↓` | Down |
| `k` / `↑` | Up |
| `h` / `←` | Previous panel/tab |
| `l` / `→` | Next panel/tab |
| `g` | Top |
| `G` | Bottom |
| `Ctrl+d` | Page down |
| `Ctrl+u` | Page up |

### Selection & Actions

| Key | Action |
|-----|--------|
| `Space` | Toggle select |
| `a` | Select all |
| `n` | Deselect all |
| `Enter` | Open/confirm |
| `e` | Edit |
| `d` | Delete |
| `f` | Favorite toggle |

### Context Shortcuts

**Library Browser**:
| Key | Action |
|-----|--------|
| `/` | Search within system |
| `f` | Filter results |
| `s` | Sort options |

**Downloads Manager**:
| Key | Action |
|-----|--------|
| `r` | Rescan |
| `i` | Import |
| `p` | Preview |

**Curation Studio**:
| Key | Action |
|-----|--------|
| `a` | Auto-build |
| `m` | Manage must-haves |
| `s` | Save |
| `x` | Export to Excel |
| `F` | Flash to SD |

**SD Card Manager**:
| Key | Action |
|-----|--------|
| `v` | View contents |
| `f` | Flash |
| `b` | Backup saves |
| `r` | Restore saves |
| `e` | Eject |

### General

| Key | Action |
|-----|--------|
| `:` | Command mode |
| `Esc` / `q` | Back/cancel |
| `Ctrl+C` | Quit application |

---

## Configuration

### Configuration File (config.yaml)

Location: `./config.yaml`

**Full Schema**:

```yaml
# Filesystem paths
paths:
  library: /Volumes/MyDrive/ROMs/1G1R_Library
  downloads: ~/Downloads
  sdCard: /Volumes/ARKOS
  spreadsheets: ~/Documents/roms/
  pythonScripts: ~/Documents/roms/scripts/

# User preferences
preferences:
  # Region priority (left to right = highest to lowest)
  regionPriority: [USA, World, Europe, Japan]

  # Auto-features
  autoScanDownloads: true
  confirmDestructive: true

  # Defaults
  defaultCollection: 128gb-favorites
  defaultTheme: dark

# Theme customization
theme:
  colorScheme: dark  # dark or light
  accentColor: '#4299e1'

# Advanced
advanced:
  cacheBuildingIndex: true
  lazy LoadThreshold: 50
```

### First-Time Setup Wizard

On first run:
1. TUI detects paths and asks you to verify
2. Offers to scan your library
3. Lets you set region preferences
4. Shows quick start guide

### Settings Menu

Press `,` to access:

- **Library Paths**: Change ROM location
- **Region Preferences**: Reorder region priority
- **Theme**: Switch dark/light, customize colors
- **Auto-Scan**: Enable/disable Downloads auto-scan
- **Confirmations**: Toggle safety prompts
- **Advanced**: Cache settings, performance tuning

---

## Advanced Features

### Batch Operations

Select multiple games with `Space`:

```
☑ Pokemon Emerald (U) [!]
☑ Pokemon FireRed (U) [!]
☑ Pokemon LeafGreen (U) [!]
☐ Pokemon Ruby (U) [!]

[Space] to toggle | [a]ll [n]one | [d]elete [f]avorite
```

**Batch Actions**:
- Delete multiple games at once
- Mark batch as favorites
- Bulk-edit metadata
- Move to collections

### Search & Filtering

#### Global Search (Press `/`)

```
Query: pokemon emerald█

Results (1 found):
1. Pokemon Emerald (U) [!]     GBA    1.2 MB

[Enter] view | [Esc] cancel
```

**Search Features**:
- Fuzzy matching (typos okay)
- Multi-field (title, filename, system)
- Real-time results
- Arrow keys to navigate

#### System Filtering

```
Press [f] in Library Browser

Filter by:
- Region: USA, Europe, Japan, World
- Quality: Verified [!], No-dump, Hacks
- Size: < 10 MB, 10-100 MB, > 100 MB
```

#### Sorting

```
Press [s] in Library Browser

Sort by:
- Title (A-Z)
- Release Date (oldest first)
- Size (largest first)
- Playtime (most played)
```

### Metadata Management

Edit game information:

1. **Select Game** in Library Browser
2. **Press [e]** to edit
3. **Modal appears** with fields:
   - Title
   - System
   - Region
   - Genre
   - Developer
   - Release Year
   - Rating

4. **Edit fields**, press `Enter` to save

**Bulk Edit**: Select multiple, press [e] to edit all at once

### Collections Management

Create and manage multiple collections:

1. **Open Curation Studio**
2. **Create New** or select existing
3. **Name**: 128GB Favorites, Speedrunning, etc.
4. **Build**: Auto or manual
5. **Save**: Ready for export/flashing

**Export Options**:
- Excel (.xlsx)
- CSV (.csv)
- JSON (.json)
- Print report

### Performance Optimization

For large libraries (7,000+ games):

**Enable Caching**:
```yaml
advanced:
  cacheBuildingIndex: true
  lazyLoadThreshold: 50
```

**Rebuild Index**:
```bash
bun run rebuild-index
```

**Statistics**:
- Current library size
- Last index rebuild
- Cache hit rate

---

## Troubleshooting

### Common Issues

#### "Library path not found"

**Problem**: TUI can't locate your ROM library

**Solution**:
1. Press `,` for Settings
2. Go to "Library Paths"
3. Verify path is correct
4. Ensure path exists and is readable
5. Save and restart

#### "No games found"

**Problem**: Library scanner found no ROM files

**Solutions**:
1. Verify games are in correct path:
   ```
   /Your/Library/Path/
   ├── NES/
   │   ├── game1.nes
   │   └── game2.nes
   ├── SNES/
   │   ├── game1.smc
   │   └── game2.zip
   ```

2. Check supported file types:
   - .nes, .sfc, .smc (SNES)
   - .gba, .gbc, .gb (Portable)
   - .z64, .n64 (N64)
   - .iso, .cso, .pbp, .chd (PSX, PSP)
   - .zip, .7z (archives supported)

3. Rebuild library index:
   ```bash
   bun run rebuild-index
   ```

#### "Terminal not ANSI-compatible"

**Problem**: Colors/formatting look wrong

**Solution**:
```bash
export TERM=xterm-256color
bun run start
```

Add to `.bashrc` or `.zshrc` for permanent fix:
```bash
echo 'export TERM=xterm-256color' >> ~/.zshrc
```

#### "SD card not detected"

**Problem**: TUI can't find mounted SD card

**Solutions**:
1. Verify card is mounted:
   ```bash
   diskutil list        # macOS
   lsblk                # Linux
   ```

2. Check if auto-mount working:
   ```bash
   mount                # List mounted volumes
   ```

3. Manual mount (macOS):
   ```bash
   diskutil mount /dev/diskXsY
   ```

4. Verify in config.yaml:
   ```yaml
   paths:
     sdCard: /Volumes/ARKOS    # macOS
     sdCard: /media/sdcard/    # Linux
   ```

#### "Slow performance with large library"

**Problem**: Scrolling/searching feels slow

**Solutions**:
1. Rebuild index:
   ```bash
   bun run rebuild-index
   ```

2. Enable caching in config.yaml:
   ```yaml
   advanced:
     cacheBuildingIndex: true
   ```

3. Clear cache:
   ```bash
   rm -rf ./cache/
   ```

4. Increase lazy load threshold:
   ```yaml
   advanced:
     lazyLoadThreshold: 100
   ```

#### "Python scripts not found"

**Problem**: TUI can't run your Python automation scripts

**Solution**:
1. Verify scripts exist:
   ```bash
   ls ~/Documents/roms/scripts/
   ```

2. Update config.yaml:
   ```yaml
   paths:
     pythonScripts: /path/to/your/scripts/
   ```

3. Verify Python is installed:
   ```bash
   python3 --version
   ```

4. Check scripts have execute permission:
   ```bash
   chmod +x ~/Documents/roms/scripts/*.py
   ```

#### "Import failed: permission denied"

**Problem**: Can't copy files to library

**Solutions**:
1. Check write permissions:
   ```bash
   ls -ld /path/to/library/
   # Should show: drwxr-xr-x (or better)
   ```

2. Grant write permission:
   ```bash
   chmod u+w /path/to/library/
   ```

3. Check disk space:
   ```bash
   df -h /path/to/library/
   # Ensure sufficient free space
   ```

4. Try dry-run first:
   ```
   Press [p] for preview before importing
   ```

### Getting Help

1. **Help Overlay**: Press `?` in any view
2. **Keyboard Reference**: View at bottom of screen
3. **Documentation**: See README.md links
4. **Issues**: Report on GitHub with:
   - OS/version
   - ROM count
   - Error message
   - Reproduction steps

---

## Tips & Best Practices

### Organization

1. **Use 1G1R system**: One Game One Region (avoid duplicates)
2. **Set region priority**: USA → World → Europe → Japan
3. **Regular cleanup**: Monthly duplicate detection
4. **Organize by system**: Mirror official names (NES, SNES, GBA, etc.)

### Performance

1. **Index regularly**: Weekly for active libraries
2. **Archive old builds**: Don't keep many collection versions
3. **Use SSD for library**: Faster scanning and loading
4. **Monitor disk space**: Keep 10-15% free

### Safety

1. **Dry-run before import**: Always preview first
2. **Backup save states**: Before flashing SD cards
3. **Verify checksums**: After large transfers
4. **Keep backups**: Of collections you've built

### Collections

1. **Build multiple collections**: Different themes/sizes
2. **Export to Excel**: Easy to share and track
3. **Version your collections**: "128GB v1.3", "Speedrun v2"
4. **Track must-haves**: Keep notes on important series

---

**End of User Guide**

For more information, see [README.md](../README.md) or [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md).
