import React, { useEffect } from 'react';
import TitleBar from './components/toolbar/TitleBar';
import TopToolbar from './components/toolbar/TopToolbar';
import LeftSidebar from './components/sidebar/left/LeftSidebar';
import RightSidebar from './components/sidebar/right/RightSidebar';
import Workspace from './components/workspace/Workspace';
import StatusBar from './components/StatusBar';
import WindowResizeFrame from './components/window/WindowResizeFrame';
import { useDocumentStore } from './store/useDocumentStore';

const App: React.FC = () => {
  const { setContextMenu } = useDocumentStore();

  // Close context menu on window click
  useEffect(() => {
    const handler = () => setContextMenu(null);
    window.addEventListener('blur', handler);
    return () => window.removeEventListener('blur', handler);
  }, [setContextMenu]);

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden bg-[#e8e8e8]"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* ── Tauri Title Bar ── */}
      <TitleBar />

      {/* ── Top Toolbar (Win11-style Ribbon) ── */}
      <TopToolbar />

      {/* ── Main Layout (CSS Grid) ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar — Document Outline + Thumbnails */}
        <LeftSidebar />

        {/* Center — Page Canvas / Workspace */}
        <Workspace />

        {/* Right Sidebar — Format & Document panels */}
        <RightSidebar />
      </div>

      {/* ── Status Bar ── */}
      <StatusBar />

      {/* ── Window resize frame + handles (position:fixed, outside layout) ── */}
      <WindowResizeFrame />
    </div>
  );
};

export default App;
