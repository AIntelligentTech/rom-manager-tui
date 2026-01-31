#!/usr/bin/env bun
/**
 * ROM Manager TUI - Main Entry Point
 * Built with OpenTUI v0.1.75
 */

import { startApp } from './app';

startApp().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
