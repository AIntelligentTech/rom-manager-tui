# ROM Manager TUI - Research & Design Summary

**Date:** 2026-01-31
**Project:** ROM Manager TUI v0.0.1
**Research Agents:** 2 comprehensive explorations

---

## Research Overview

Two parallel research tasks were conducted to inform the TUI design:

1. **Project-Specific Research**: Deep dive into ~/Documents/roms/ and COMPLETE_PROJECT_DOCUMENTATION.md
2. **Domain Research**: ROM management ecosystem, best practices, and user needs

---

## Key Findings

### Your ROM Management Project

**Scale & Organization:**
- **7,288 games** in curated 1G1R library (22 GB)
- **12 systems** supported (NES through PSP)
- **60+ must-have series** identified from user conversations
- **98 GB → 22 GB** reduction through intelligent curation
- **T5 external drive** for library storage
- **128 GB SD cards** for R36S handheld deployment

**Existing Automation:**
- 6 Python scripts (~65 KB) for scanning, curation, verification
- 5 Shell scripts (~16 KB) for one-click workflows
- Conversation-aware curation (analyzes user's expressed interests)
- 1G1R algorithm with USA priority

**Core Workflows:**
1. **Update Library**: Scan ~/Downloads → Deduplicate → Import to library
2. **Build 128GB**: Intelligent curation with priority scoring → Fill to 120GB exactly
3. **Flash SD Card**: Copy collection to ArkOS structure → Extract archives → Verify

**Pain Points Identified:**
- Manual spreadsheet updates (not automated)
- No search/filter functionality (must scan full library)
- No cover art integration
- Finding specific games requires full scans
- No save state backup/restore

### ROM Management Ecosystem

**Standards:**
- **gamelist.xml**: De facto metadata format (EmulationStation, RetroPie, Batocera)
- **No-Intro/Redump**: ROM naming conventions and DAT files
- **1G1R Filtering**: Region/version preference systems
- **ScreenScraper**: Primary metadata/artwork source

**Performance Challenges:**
- EmulationStation struggles with 6,000+ games (minutes to load)
- XML parsing and image loading are bottlenecks
- Users need virtualized scrolling for large collections

**User Workflows:**
- Building new SD cards (flash OS → copy ROMs → scrape metadata → test)
- Updating collections (add ROMs → re-scrape → remove duplicates)
- 1G1R curation (download full sets → filter by region → verify checksums)

**Best Practices:**
- exFAT for SD cards (GameCube+ ROM sizes exceed FAT32's 4GB limit)
- System-specific subdirectories (/roms/psx/, /roms/gba/, etc.)
- Keyboard-first navigation for efficiency
- Progressive disclosure (simple defaults, reveal complexity on demand)
- Batch operations for power users

---

## TUI Design Principles

### Beautiful & Uncluttered

✅ **Progressive Disclosure**: Essential info first, details on demand
✅ **Visual Hierarchy**: Clear primary/secondary information distinction
✅ **Whitespace**: Generous padding for readability
✅ **Consistent Theming**: Unified color palette and spacing

### Intuitive & Powerful

✅ **Keyboard-First**: Vim-style bindings (j/k navigation, / for search)
✅ **Discoverable**: Contextual help, keyboard hints in status bar
✅ **Intelligent Defaults**: Preconfigured workflows
✅ **Batch Operations**: Multi-select throughout

### ROM Management Focused

✅ **Conversation-Aware**: Preserves 60+ must-have series intelligence
✅ **Performance Optimized**: Handles 7,300+ games smoothly (lazy loading, SQLite indexing)
✅ **Safety First**: Dry-run previews, confirmations, rollback capability
✅ **Integration Friendly**: Wraps existing Python scripts (doesn't replace them)

---

## Core Views Designed

### 1. Dashboard (Home)
- Quick stats (library size, game count, recent activity)
- Storage overview (T5 drive, SD card space)
- Must-have series tracker
- Quick actions (one-key navigation)

### 2. Library Browser
- Three-panel layout: Systems | Games | Details
- Multi-select with checkboxes
- Live search (fuzzy finding)
- Contextual actions per selection

### 3. Downloads Manager
- Auto-scan ~/Downloads on view
- Categorization: New (green), Duplicates (yellow), Errors (red)
- Smart defaults (new games pre-selected)
- Preview mode before import

### 4. Curation Studio
- Visual space management (live bar charts)
- Must-have series coverage tracker
- Auto-build using existing algorithm
- Manual curation tools

### 5. SD Card Manager
- Auto-detection (ArkOS/Batocera firmware)
- View current contents
- Flash workflow with progress tracking
- Save state backup/restore

### 6. Search Overlay (Global)
- Press `/` from anywhere
- Fuzzy search across title/system/filename
- Live results as you type

---

## Technical Architecture

### Data Layer

**SQLite Database:**
- Games table (full metadata, checksums, curation flags)
- Collections table (128GB, custom collections)
- Full-text search index (FTS5)
- Indexes on system, title, priority, CRC32

**Models:**
- Game (40+ fields: metadata, quality flags, curation, usage stats)
- Collection (games list, size limits, timestamps)
- Config (paths, preferences, must-have series, theme)

### Integration Layer

**Python Script Wrappers:**
- `scanDownloads()` → `scan_new_downloads.py`
- `addToLibrary()` → `add_gaps_to_library.py`
- `buildCuration()` → `build_128gb_favorites.py`
- `flashSDCard()` → `copy_to_sd_card.py`

**Benefits:**
- Reuses proven logic
- No code duplication
- Maintains conversation-awareness
- Async execution with progress updates

### Performance Strategy

**Lazy Loading:**
- Virtualized scrolling (render only visible items)
- On-demand metadata loading
- Paginated views (100-500 games at a time)

**Caching:**
- In-memory cache for current view
- SQLite cache for full library metadata
- Filesystem cache (avoid re-scanning unchanged directories)

**Async Operations:**
- Background threads for scanning/copying
- Progress modals with ETA
- Non-blocking UI updates

---

## Custom OpenTUI Components

### Designed Components

1. **GameListItem**: Display game with metadata, region coloring, checkboxes
2. **SpaceBar**: Visual space usage (progress bar with labels)
3. **SystemIcon**: Visual system identifiers (emoji or text)
4. **PriorityBadge**: Curation priority tiers (URGENT, MUST-HAVE, PRIORITY, BACKFILL)
5. **StatCard**: Dashboard statistic display
6. **ThreePanelLayout**: Responsive 3-panel layout
7. **ProgressModal**: Long-running operation progress
8. **ConfirmDialog**: Safety confirmation for destructive ops

### Layout Patterns

**Responsive Design:**
- Large (160×40): 3 panels (systems | list | details)
- Medium (120×30): 2 panels (list | details)
- Small (80×24): 1 panel (list only)

**Box-Based Architecture:**
- Header (fixed, 2-3 lines)
- Content (flex grow with ScrollBox)
- Status bar (fixed, 1 line)

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- SQLite database schema
- Configuration management (YAML)
- Library scanner (filesystem → DB)
- Dashboard and Library Browser (read-only)
- Search functionality

### Phase 2: Downloads Integration (Week 3)
- Downloads scanner wrapper
- Downloads Manager screen
- Import workflow
- Progress indicators

### Phase 3: Curation Studio (Week 4)
- Curation algorithm wrapper
- Curation Studio screen
- Space visualization
- Must-have series tracker
- Auto-build workflow

### Phase 4: SD Card Manager (Week 5-6)
- SD card detection
- Flash workflow
- Save state backup/restore
- Verification (checksums)

### Phase 5: Polish & Features (Week 7-8)
- Duplicate detection
- Batch operations
- Metadata editor
- Theme customization
- Keyboard shortcuts help overlay

### Phase 6: Advanced Features (Future)
- ScreenScraper integration
- Cover art management
- gamelist.xml import/export
- 1G1R filtering UI
- Statistics and reports

---

## Key Differentiators

Your TUI will be unique in the ROM management space:

1. **Conversation-Aware Curation**: No other tool tracks user's expressed interests across 60+ series
2. **Integrated Workflows**: Seamless download → library → curation → SD card pipeline
3. **Performance-First**: Built for 10,000+ ROM collections from day one
4. **Keyboard-Driven**: Vim-style efficiency (most tools are mouse-centric)
5. **Safety-Focused**: Dry-run previews and confirmations throughout
6. **OpenTUI-Powered**: Beautiful, modern TUI with sub-millisecond rendering

---

## Color Palette

**Dark Theme** (Default):
- Background: `#1f2933` (Dark blue-gray)
- Surface: `#2d3748` (Lighter blue-gray)
- Accent: `#4299e1` (Blue)
- Success: `#48bb78` (Green)
- Warning: `#ed8936` (Orange)
- Error: `#f56565` (Red)

**Region Colors**:
- USA: Green `#48bb78`
- Europe: Blue `#4299e1`
- Japan: Orange `#ed8936`
- World: Purple `#805ad5`

---

## Keyboard Shortcuts (Essential)

**Global:**
- `/` = Search
- `?` = Help
- `Esc` = Cancel/Back
- `:` = Command mode (vim-style)

**Navigation:**
- `h`/`l` or `←`/`→` = Panel/tab navigation
- `j`/`k` or `↓`/`↑` = Move up/down
- `Space` = Toggle checkbox

**Views:**
- `H` = Home (Dashboard)
- `L` = Library Browser
- `D` = Downloads Manager
- `C` = Curation Studio
- `S` = SD Card Manager

---

## Next Steps

1. ✅ Research complete (2 comprehensive reports)
2. ✅ Architecture designed (17,000+ word spec)
3. ⏭️ Implement Phase 1 (Foundation)
4. ⏭️ Test with real library (7,300 games)
5. ⏭️ Iterate based on usage

---

## Documentation

- **Full Architecture**: `docs/TUI_ARCHITECTURE_DESIGN.md` (17,000+ words)
- **Project Analysis**: Research agent output (comprehensive project understanding)
- **Domain Research**: Research agent output (ecosystem best practices)

---

**Summary**: A beautiful, powerful, ROM management TUI tailored to your exact workflows, backed by comprehensive research into both your specific project and the broader retro gaming ecosystem. Built to handle 7,300+ games smoothly while preserving your conversation-aware curation intelligence and wrapping your existing automation scripts.
