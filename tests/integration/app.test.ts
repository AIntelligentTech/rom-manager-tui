import { describe, expect, test } from 'bun:test';
import { Database } from '../../src/models/database';
import { ConfigManager } from '../../src/models/config';
import { existsSync, unlinkSync } from 'fs';

describe('Application Integration', () => {
  const testDbPath = '/tmp/test-rom-manager.db';

  test('should initialize application components', () => {
    // Clean up any existing test database
    if (existsSync(testDbPath)) {
      unlinkSync(testDbPath);
    }

    // Initialize config
    const config = new ConfigManager();
    expect(config).toBeDefined();

    // Initialize database
    const db = new Database(testDbPath);
    expect(db).toBeDefined();

    // Verify database is empty initially
    const stats = db.getStatistics();
    expect(stats.totalGames).toBe(0);
    expect(stats.systemCounts).toEqual([]);

    // Clean up
    db.close();
    if (existsSync(testDbPath)) {
      unlinkSync(testDbPath);
    }
  });

  test('should have correct default configuration', () => {
    const config = new ConfigManager();

    const regionPriority = config.get('preferences.regionPriority');
    expect(regionPriority).toEqual(['USA', 'World', 'Europe', 'Japan']);

    const colorScheme = config.get('theme.colorScheme');
    expect(colorScheme).toBe('dark');
  });
});
