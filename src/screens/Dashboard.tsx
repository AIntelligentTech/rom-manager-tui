import React, { useEffect, useState } from 'react';
import { Database } from '../models/database';
import { ConfigManager } from '../models/config';

interface DashboardProps {
  db: Database;
  config: ConfigManager;
  onNavigate: (screen: string) => void;
}

export default function Dashboard({ db, config }: DashboardProps) {
  const [stats, setStats] = useState({
    totalGames: 0,
    systems: 0,
    totalSize: 0,
  });

  useEffect(() => {
    // Load statistics
    const loadStats = () => {
      try {
        const dbStats = db.getStatistics();
        setStats({
          totalGames: dbStats.totalGames,
          systems: dbStats.systemCounts.length,
          totalSize: dbStats.totalSize,
        });
      } catch (error) {
        console.error('Failed to load statistics:', error);
      }
    };

    loadStats();
  }, [db]);

  const formatSize = (bytes: number): string => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  return (
    <box
      flexDirection="column"
      width="100%"
      height="100%"
      border
      borderStyle="rounded"
      title=" ROM Manager TUI v1.0.0 "
    >
      {/* Header */}
      <box
        padding={1}
        borderStyle="single"
      >
        <text>
          Library: {stats.totalGames} games | {stats.systems} systems | {formatSize(stats.totalSize)}
        </text>
      </box>

      {/* Main Content */}
      <box
        flexDirection="row"
        flexGrow={1}
        padding={1}
      >
        {/* Quick Stats */}
        <box
          flexDirection="column"
          width="30%"
          padding={1}
          border
          borderStyle="single"
          title=" Quick Stats "
        >
          <text> </text>
          <text>  Total Games: {stats.totalGames}</text>
          <text>  Systems: {stats.systems}</text>
          <text>  Library Size: {formatSize(stats.totalSize)}</text>
          <text> </text>
        </box>

        {/* Quick Actions */}
        <box
          flexDirection="column"
          width="40%"
          padding={1}
          marginLeft={1}
          border
          borderStyle="single"
          title=" Quick Actions "
        >
          <text> </text>
          <text>  [L] Browse Library</text>
          <text>  [D] Scan Downloads</text>
          <text>  [C] Curation Studio</text>
          <text>  [S] SD Card Manager</text>
          <text>  [/] Search Games</text>
          <text>  [?] Help</text>
          <text> </text>
        </box>

        {/* Welcome Message */}
        <box
          flexDirection="column"
          flexGrow={1}
          padding={1}
          marginLeft={1}
          border
          borderStyle="single"
          title=" Welcome "
        >
          <text> </text>
          <text>  Welcome to ROM Manager TUI!</text>
          <text> </text>
          <text>  This is v1.0.0 - Initial Release</text>
          <text> </text>
          <text>  Press [?] for keyboard shortcuts</text>
          <text>  Press [q] or Ctrl+C to quit</text>
          <text> </text>
        </box>
      </box>

      {/* Status Bar */}
      <box
        padding={1}
        borderStyle="single"
        backgroundColor="#1f2933"
      >
        <text>[L]ibrary [D]ownloads [C]uration [S]D Card [/]Search [?]Help [q]Quit</text>
      </box>
    </box>
  );
}
