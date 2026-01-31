import React, { useState } from 'react';
import { createCliRenderer } from '@opentui/core';
import { createRoot } from '@opentui/react';
import Dashboard from './screens/Dashboard';
import { Database } from './models/database';
import { ConfigManager } from './models/config';

interface AppProps {
  db: Database;
  config: ConfigManager;
}

function App({ db, config }: AppProps) {
  const [currentScreen, setCurrentScreen] = useState<'dashboard'>('dashboard');

  return (
    <box
      flexDirection="column"
      width="100%"
      height="100%"
    >
      {currentScreen === 'dashboard' && (
        <Dashboard db={db} config={config} onNavigate={setCurrentScreen} />
      )}
    </box>
  );
}

export async function startApp() {
  try {
    // Initialize configuration
    const config = new ConfigManager();

    // Initialize database
    const db = new Database(config.get('paths.database'));

    // Create CLI renderer
    const renderer = await createCliRenderer({
      exitOnCtrlC: true,
    });

    // Render app
    createRoot(renderer).render(<App db={db} config={config} />);

    console.log('ROM Manager TUI started successfully!');
  } catch (error) {
    console.error('Failed to start ROM Manager TUI:', error);
    process.exit(1);
  }
}
