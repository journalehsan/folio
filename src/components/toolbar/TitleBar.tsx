import React, { useEffect, useState } from 'react';
import {
  Minus, Square, X,
  FolderOpen, Save, FileDown, Printer,
  Undo2, Redo2, Settings,
  Sun, Moon,
} from 'lucide-react';
import { minimize, toggleMaximize, closeWindow, checkIsMaximized } from '../../tauri/window';
import { useDocumentStore } from '../../store/useDocumentStore';

const TitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const { darkMode, setDarkMode } = useDocumentStore();

  // Track maximized state so we can show the right restore icon
  useEffect(() => {
    let cancelled = false;
    const sync = async () => {
      const m = await checkIsMaximized();
      if (!cancelled) setIsMaximized(m);
    };
    sync();
    const interval = setInterval(sync, 500);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  // Apply dark mode class to document root
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const quickActions = [
    { icon: <FolderOpen size={12} />, title: 'Open (Ctrl+O)' },
    { icon: <Save size={12} />, title: 'Save (Ctrl+S)' },
    { icon: <FileDown size={12} />, title: 'Export to PDF' },
    { icon: <Printer size={12} />, title: 'Print (Ctrl+P)' },
  ];

  const editActions = [
    { icon: <Undo2 size={12} />, title: 'Undo (Ctrl+Z)' },
    { icon: <Redo2 size={12} />, title: 'Redo (Ctrl+Y)' },
  ];

  return (
    <div className="h-9 flex items-center bg-[#1a1a1a] text-white select-none flex-shrink-0 z-50">
      {/* Drag region — app icon + name */}
      <div
        className="flex items-center pl-3 gap-2 h-full cursor-default"
        data-tauri-drag-region=""
      >
        <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 pointer-events-none">
          <span className="text-[8px] text-white font-bold leading-none">F</span>
        </div>
        <span className="text-[11px] text-neutral-300 font-medium pointer-events-none">
          Folio — Word Processor
        </span>
      </div>

      {/* Flex spacer — still draggable */}
      <div className="flex-1 h-full" data-tauri-drag-region="" />

      {/* Quick-action buttons — NOT draggable */}
      <div className="flex items-center gap-0.5 px-2">
        {quickActions.map((a, i) => (
          <button
            key={i}
            title={a.title}
            className="w-7 h-7 flex items-center justify-center rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {a.icon}
          </button>
        ))}

        <div className="w-px h-4 bg-white/15 mx-1" />

        {editActions.map((a, i) => (
          <button
            key={i}
            title={a.title}
            className="w-7 h-7 flex items-center justify-center rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {a.icon}
          </button>
        ))}

        <div className="w-px h-4 bg-white/15 mx-1" />

        <button
          title="Settings"
          className="w-7 h-7 flex items-center justify-center rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Settings size={12} />
        </button>
      </div>

      {/* Window controls — NOT draggable */}
      <div className="flex items-center h-full">
        {/* Dark / Light toggle */}
        <button
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          onClick={() => setDarkMode(!darkMode)}
          className="w-9 h-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          {darkMode ? <Sun size={12} /> : <Moon size={12} />}
        </button>

        <div className="w-px h-4 bg-white/15" />

        <button
          title="Minimize"
          onClick={minimize}
          className="w-11 h-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <Minus size={11} className="text-neutral-300" />
        </button>

        <button
          title={isMaximized ? 'Restore' : 'Maximize'}
          onClick={async () => {
            await toggleMaximize();
            setIsMaximized(await checkIsMaximized());
          }}
          className="w-11 h-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          {isMaximized ? (
            /* Two overlapping squares = restore icon */
            <svg width="10" height="10" viewBox="0 0 10 10" className="text-neutral-300" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="2" y="0" width="8" height="8" rx="0.5" />
              <rect x="0" y="2" width="8" height="8" rx="0.5" fill="#1a1a1a" />
              <rect x="0" y="2" width="8" height="8" rx="0.5" />
            </svg>
          ) : (
            <Square size={10} className="text-neutral-300" />
          )}
        </button>

        <button
          title="Close"
          onClick={closeWindow}
          className="w-11 h-full flex items-center justify-center hover:bg-red-600 transition-colors group"
        >
          <X size={13} className="text-neutral-300 group-hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
