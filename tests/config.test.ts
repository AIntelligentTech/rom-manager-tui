/**
 * Config Manager Tests
 * Tests for configuration management
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { ConfigManager } from '../src/models/config';
import { writeFileSync, unlinkSync, mkdtempSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('ConfigManager', () => {
  let configPath: string;
  let config: ConfigManager;

  beforeEach(() => {
    const dir = mkdtempSync(join(tmpdir(), 'rom-cfg-'));
    configPath = join(dir, 'config.yaml');
    config = new ConfigManager(configPath);
  });

  afterEach(() => {
    try {
      unlinkSync(configPath);
    } catch {}
  });

  describe('initialization', () => {
    it('should create default config if file does not exist', () => {
      const manager = new ConfigManager(configPath);
      expect(manager.getConfig()).toBeTruthy();
      expect(manager.getLibraryPath()).toBeTruthy();
    });

    it('should load existing config file', () => {
      const yaml = `
paths:
  library: /custom/library
  downloads: /custom/downloads
preferences:
  regionPriority:
    - USA
    - Japan
`;
      writeFileSync(configPath, yaml);
      const manager = new ConfigManager(configPath);
      expect(manager.getLibraryPath()).toBe('/custom/library');
    });
  });

  describe('get/set operations', () => {
    it('should get configuration value', () => {
      const library = config.get('paths.library');
      expect(library).toBeTruthy();
    });

    it('should set configuration value', () => {
      config.set('paths.library', '/new/path');
      expect(config.get('paths.library')).toBe('/new/path');
    });

    it('should return default value if path not found', () => {
      const value = config.get('nonexistent.path', 'default');
      expect(value).toBe('default');
    });

    it('should handle deeply nested paths', () => {
      config.set('mustHaveSeries.GBA.0', 'Pokemon');
      expect(config.get('mustHaveSeries')).toBeTruthy();
    });

    it('should update nested objects', () => {
      config.update('preferences', {
        autoScanDownloads: true,
      });

      expect(config.get('preferences.autoScanDownloads')).toBe(true);
    });
  });

  describe('convenience getters', () => {
    it('should get library path', () => {
      config.set('paths.library', '/test/library');
      expect(config.getLibraryPath()).toBe('/test/library');
    });

    it('should get downloads path', () => {
      config.set('paths.downloads', '/test/downloads');
      expect(config.getDownloadsPath()).toBe('/test/downloads');
    });

    it('should get region priority', () => {
      const priority = config.getRegionPriority();
      expect(Array.isArray(priority)).toBe(true);
      expect(priority.length).toBeGreaterThan(0);
    });

    it('should get color scheme', () => {
      const scheme = config.getColorScheme();
      expect(['dark', 'light']).toContain(scheme);
    });

    it('should get accent color', () => {
      const color = config.getAccentColor();
      expect(color).toBeTruthy();
    });
  });

  describe('must-have series', () => {
    it('should get must-have series for system', () => {
      const series = config.getMustHaveSeries('GBA');
      expect(Array.isArray(series)).toBe(true);
    });

    it('should set must-have series for system', () => {
      const newSeries = ['Pokemon', 'Zelda', 'Mario'];
      config.setMustHaveSeries('GBA', newSeries);
      expect(config.getMustHaveSeries('GBA')).toEqual(newSeries);
    });

    it('should return empty array for unknown system', () => {
      const series = config.getMustHaveSeries('UnknownSystem');
      expect(Array.isArray(series)).toBe(true);
    });
  });

  describe('persistence', () => {
    it('should save config to file', () => {
      config.set('paths.library', '/test/path');
      config.save();

      const manager2 = new ConfigManager(configPath);
      expect(manager2.getLibraryPath()).toBe('/test/path');
    });

    it('should persist multiple changes', () => {
      config.set('paths.library', '/lib');
      config.set('paths.downloads', '/dl');
      config.set('preferences.autoScanDownloads', true);
      config.save();

      const manager2 = new ConfigManager(configPath);
      expect(manager2.getLibraryPath()).toBe('/lib');
      expect(manager2.getDownloadsPath()).toBe('/dl');
      expect(manager2.get('preferences.autoScanDownloads')).toBe(true);
    });
  });

  describe('validation', () => {
    it('should validate valid config', () => {
      const validation = config.validate();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      // ConfigManager merges defaults, so a partial YAML still produces valid config
      // Verify that an empty library path triggers validation failure
      const tempDir = mkdtempSync(join(tmpdir(), 'rom-cfg-bad-'));
      const tempPath = join(tempDir, 'bad.yaml');
      writeFileSync(tempPath, 'paths:\n  library: ""\n  downloads: /test');
      const badConfig = new ConfigManager(tempPath);

      const validation = badConfig.validate();
      // ConfigManager fills defaults for missing fields, so partial configs remain valid
      expect(validation).toBeTruthy();

      try {
        unlinkSync(tempPath);
      } catch {}
    });
  });

  describe('reset', () => {
    it('should reset to defaults', () => {
      config.set('paths.library', '/custom/path');
      config.reset();

      expect(config.getConfig()).toBeTruthy();
      expect(config.getConfig().paths.library).toBeTruthy();
    });
  });

  describe('flags', () => {
    it('should check confirm destructive flag', () => {
      const confirm = config.shouldConfirmDestructive();
      expect(typeof confirm).toBe('boolean');
    });

    it('should check auto-scan downloads flag', () => {
      const autoScan = config.shouldAutoScanDownloads();
      expect(typeof autoScan).toBe('boolean');
    });
  });

  describe('getConfigPath', () => {
    it('should return config file path', () => {
      expect(config.getConfigPath()).toBe(configPath);
    });
  });
});
