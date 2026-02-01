import { describe, expect, test } from 'bun:test';
import { DatabaseManager } from '../../src/models/database';
import { ConfigManager } from '../../src/models/config';
import { existsSync, unlinkSync, mkdtempSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('Application Integration', () => {
  test('should initialize application components', () => {
    const dir = mkdtempSync(join(tmpdir(), 'rom-int-'));
    const testDbPath = join(dir, 'test.db');

    // Initialize config
    const config = new ConfigManager();
    expect(config).toBeDefined();

    // Initialize database
    const db = new DatabaseManager(testDbPath);
    expect(db).toBeDefined();

    // Verify database is empty initially
    const stats = db.getStats();
    expect(stats.totalGames).toBe(0);
    expect(Object.keys(stats.gamesBySystem)).toHaveLength(0);

    // Clean up
    db.close();
    try { unlinkSync(testDbPath); } catch {}
  });

  test('should have correct default configuration', () => {
    const config = new ConfigManager();

    const regionPriority = config.get('preferences.regionPriority');
    expect(regionPriority).toEqual(['USA', 'World', 'Europe', 'Japan']);

    const colorScheme = config.get('theme.colorScheme');
    expect(colorScheme).toBe('dark');
  });
});
