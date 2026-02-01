/**
 * Database Tests
 * Tests for SQLite database manager
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { DatabaseManager } from '../src/models/database';
import { GameInput } from '../src/models/game';
import { mkdtempSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('DatabaseManager', () => {
  let db: DatabaseManager;
  let dbPath: string;

  beforeEach(() => {
    const dir = mkdtempSync(join(tmpdir(), 'rom-test-'));
    dbPath = join(dir, 'test.db');
    db = new DatabaseManager(dbPath);
  });

  afterEach(() => {
    db.close();
    try {
      unlinkSync(dbPath);
    } catch {}
  });

  describe('initialization', () => {
    it('should create database with schema', () => {
      const tables = db.getRawDatabase().prepare(
        "SELECT name FROM sqlite_master WHERE type='table'"
      ).all() as any[];

      const tableNames = tables.map((t: any) => t.name);
      expect(tableNames).toContain('games');
      expect(tableNames).toContain('collections');
      expect(tableNames).toContain('collection_games');
    });

    it('should have indexes created', () => {
      const indexes = db.getRawDatabase().prepare(
        "SELECT name FROM sqlite_master WHERE type='index'"
      ).all() as any[];

      const indexNames = indexes.map((i: any) => i.name);
      expect(indexNames).toContain('idx_system');
      expect(indexNames).toContain('idx_title');
    });
  });

  describe('game operations', () => {
    const createTestGame = (): GameInput => ({
      filename: 'Pokemon Emerald (U) [!].gba',
      path: '/games/gba/Pokemon Emerald.gba',
      size: 1200000,
      title: 'Pokemon Emerald',
      system: 'GBA',
      region: 'USA',
      verified: true,
    });

    it('should insert a game', () => {
      const game = createTestGame();
      const id = db.upsertGame(game);

      expect(id).toBeTruthy();
      const retrieved = db.getGame(id);
      expect(retrieved).toBeTruthy();
      expect(retrieved?.title).toBe('Pokemon Emerald');
    });

    it('should get game by path', () => {
      const game = createTestGame();
      const id = db.upsertGame(game);

      const retrieved = db.getGameByPath(game.path);
      expect(retrieved?.id).toBe(id);
    });

    it('should get games by system', () => {
      const gba1: GameInput = {
        ...createTestGame(),
        path: '/games/gba/game1.gba',
      };
      const gba2: GameInput = {
        ...createTestGame(),
        title: 'Fire Emblem',
        path: '/games/gba/game2.gba',
      };
      const nes1: GameInput = {
        filename: 'Mario.nes',
        path: '/games/nes/mario.nes',
        size: 500000,
        title: 'Super Mario Bros',
        system: 'NES',
        region: 'USA',
      };

      db.upsertGame(gba1);
      db.upsertGame(gba2);
      db.upsertGame(nes1);

      const gbaGames = db.getGamesBySystem('GBA');
      const nesGames = db.getGamesBySystem('NES');

      expect(gbaGames).toHaveLength(2);
      expect(nesGames).toHaveLength(1);
    });

    it('should update game', () => {
      const game = createTestGame();
      const id = db.upsertGame(game);

      db.updateGame(id, { favorite: true, priority: 100 });

      const updated = db.getGame(id);
      expect(updated?.favorite).toBe(true);
      expect(updated?.priority).toBe(100);
    });

    it('should delete game', () => {
      const game = createTestGame();
      const id = db.upsertGame(game);

      const deleted = db.deleteGame(id);
      expect(deleted).toBe(true);
      expect(db.getGame(id)).toBeNull();
    });

    it('should get all games', () => {
      const games: GameInput[] = [
        { ...createTestGame(), path: '/games/gba/1.gba' },
        { ...createTestGame(), title: 'Fire Emblem', path: '/games/gba/2.gba' },
      ];

      for (const game of games) {
        db.upsertGame(game);
      }

      const all = db.getAllGames();
      expect(all.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('statistics', () => {
    beforeEach(() => {
      const games: GameInput[] = [
        {
          filename: 'Pokemon (U).gba',
          path: '/1.gba',
          size: 1000000,
          title: 'Pokemon',
          system: 'GBA',
          region: 'USA',
          verified: true,
        },
        {
          filename: 'Mario (U).nes',
          path: '/2.nes',
          size: 500000,
          title: 'Super Mario',
          system: 'NES',
          region: 'USA',
        },
        {
          filename: 'Zelda (E).snes',
          path: '/3.sfc',
          size: 2000000,
          title: 'Zelda',
          system: 'SNES',
          region: 'Europe',
        },
      ];

      for (const game of games) {
        db.upsertGame(game);
      }
    });

    it('should get statistics', () => {
      const stats = db.getStats();

      expect(stats.totalGames).toBe(3);
      expect(stats.totalSize).toBe(3500000);
      expect(stats.verifiedCount).toBe(1);
      expect(stats.gamesBySystem['GBA']).toBe(1);
      expect(stats.gamesBySystem['NES']).toBe(1);
      expect(stats.gamesBySystem['SNES']).toBe(1);
    });

    it('should get systems', () => {
      const systems = db.getSystems();
      expect(systems).toContain('GBA');
      expect(systems).toContain('NES');
      expect(systems).toContain('SNES');
    });

    it('should get regions', () => {
      const regions = db.getRegions();
      expect(regions).toContain('USA');
      expect(regions).toContain('Europe');
    });
  });

  describe('collections', () => {
    it('should create collection', () => {
      const id = db.createCollection(
        '128GB Favorites',
        'My curated collection'
      );

      expect(id).toBeTruthy();
      const collection = db.getCollection(id);
      expect(collection.name).toBe('128GB Favorites');
    });

    it('should add game to collection', () => {
      const collectionId = db.createCollection('Test');
      const gameId = db.upsertGame({
        filename: 'test.gba',
        path: '/test.gba',
        size: 1000,
        title: 'Test Game',
        system: 'GBA',
      });

      const added = db.addToCollection(collectionId, gameId);
      expect(added).toBe(true);
    });

    it('should get collection games', () => {
      const collectionId = db.createCollection('Test');
      const gameId1 = db.upsertGame({
        filename: 'game1.gba',
        path: '/1.gba',
        size: 1000,
        title: 'Game 1',
        system: 'GBA',
      });
      const gameId2 = db.upsertGame({
        filename: 'game2.gba',
        path: '/2.gba',
        size: 1000,
        title: 'Game 2',
        system: 'GBA',
      });

      db.addToCollection(collectionId, gameId1);
      db.addToCollection(collectionId, gameId2);

      const games = db.getCollectionGames(collectionId);
      expect(games).toHaveLength(2);
    });

    it('should remove game from collection', () => {
      const collectionId = db.createCollection('Test');
      const gameId = db.upsertGame({
        filename: 'test.gba',
        path: '/test.gba',
        size: 1000,
        title: 'Test',
        system: 'GBA',
      });

      db.addToCollection(collectionId, gameId);
      const removed = db.removeFromCollection(collectionId, gameId);

      expect(removed).toBe(true);
      const games = db.getCollectionGames(collectionId);
      expect(games).toHaveLength(0);
    });
  });

  describe('search', () => {
    beforeEach(() => {
      const games: GameInput[] = [
        {
          filename: 'Pokemon Red.gb',
          path: '/1.gb',
          size: 1000000,
          title: 'Pokemon Red',
          system: 'GB',
        },
        {
          filename: 'Pokemon Blue.gb',
          path: '/2.gb',
          size: 1000000,
          title: 'Pokemon Blue',
          system: 'GB',
        },
        {
          filename: 'Mario Bros.nes',
          path: '/3.nes',
          size: 500000,
          title: 'Mario Bros',
          system: 'NES',
        },
      ];

      for (const game of games) {
        db.upsertGame(game);
      }
    });

    it('should search by title', () => {
      const results = db.searchByTitle('Pokemon');
      expect(results.length).toBeGreaterThanOrEqual(2);
      expect(results.some(g => g.title === 'Pokemon Red')).toBe(true);
    });

    it('should get favorites', () => {
      const all = db.getAllGames();
      if (all.length > 0) {
        db.updateGame(all[0].id, { favorite: true });
        const favorites = db.getFavorites();
        expect(favorites.length).toBeGreaterThanOrEqual(1);
      }
    });
  });
});
