#!/usr/bin/env bun
/**
 * ROM Manager TUI - Main Entry Point
 * Built with OpenTUI v0.1.75
 */

import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";

async function main() {
  // Create renderer
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
  });

  // App component
  function App() {
    return (
      <box
        flexDirection="column"
        width="100%"
        height="100%"
        border
        borderStyle="rounded"
        title="ROM Manager TUI v0.0.1"
      >
        <box
          padding={2}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          flexGrow={1}
        >
          <text>Welcome to ROM Manager TUI!</text>
          <text> </text>
          <text>Built with OpenTUI v0.1.75</text>
          <text> </text>
          <text>Press Ctrl+C to exit</text>
        </box>

        <box
          borderStyle="single"
          padding={1}
          backgroundColor="#1f2933"
        >
          <text>Status: Ready | v0.0.1 | OpenTUI v0.1.75</text>
        </box>
      </box>
    );
  }

  // Render
  createRoot(renderer).render(<App />);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
