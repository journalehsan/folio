import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Minus, Square, X,
  FilePlus, FolderOpen, Save, Printer, Search, Settings,
  Sun, Moon,
} from 'lucide-react';
import { minimize, toggleMaximize, closeWindow, checkIsMaximized } from '../../tauri/window';
import { useDocumentStore } from '../../store/useDocumentStore';
import MenuBar from './MenuBar';

// ── Inline document title editor ──────────────────────────────────────────────
// Shows meta.title in display mode; double-click opens an input.
// Enter / Escape / blur exits edit mode without saving (UI prototype).
// TODO: wire Enter to updateMeta({ title: draft }) once file I/O is ready.

const DocumentTitleEditor: React.FC = () => {
  const { meta } = useDocumentStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = useCallback(() => {
    setDraft(meta.title);
    setEditing(true);
  }, [meta.title]);

  const exitEdit = useCallback(() => setEditing(false), []);

  // Select all text when the input mounts
  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  if (editing) {
    return (
      <input
        ref={inputRef}
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault();
            exitEdit();
          }
        }}
        onBlur={exitEdit}
        spellCheck={false}
        className="bg-white/10 text-[11px] text-white px-1.5 py-0.5 rounded outline-none border border-white/20 max-w-[220px] min-w-[60px]"
        // Width grows with content so it doesn't feel cramped
        style={{ width: Math.max(60, Math.min(220, draft.length * 7.2)) }}
      />
    );
  }

  return (
    <span
      onDoubleClick={startEdit}
      title="Double-click to rename"
      className="text-[11px] text-neutral-400 max-w-[220px] truncate cursor-default select-none hover:text-neutral-200 transition-colors"
    >
      {meta.title}
    </span>
  );
};

// ── TitleBar ──────────────────────────────────────────────────────────────────

const TitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized]       = useState(false);
  const [menuBarVisible, setMenuBarVisible] = useState(true);

  const { darkMode, setDarkMode, newDocument, clearOpenedFileReferencePlaceholder } =
    useDocumentStore();

  // ── Maximized state sync ────────────────────────────────────────────────────
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

  // ── Dark mode class on <html> ───────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // ── Reveal menubar on any pointer entry into the titlebar ───────────────────
  const handleTitleBarMouseEnter = useCallback(() => setMenuBarVisible(true), []);
  const handleMenuBarHide        = useCallback(() => setMenuBarVisible(false), []);

  // ── New document quick action ───────────────────────────────────────────────
  const handleNew = useCallback(() => {
    clearOpenedFileReferencePlaceholder();
    newDocument();
  }, [newDocument, clearOpenedFileReferencePlaceholder]);

  // ── Quick-action buttons ────────────────────────────────────────────────────
  const quickActions = [
    { icon: <FilePlus  size={12} />, title: 'New (Ctrl+N)',           onClick: handleNew  },
    { icon: <FolderOpen size={12} />, title: 'Open… (Ctrl+O)',        onClick: undefined  },
    { icon: <Save       size={12} />, title: 'Save (Ctrl+S)',          onClick: undefined  },
    { icon: <Printer    size={12} />, title: 'Print (Ctrl+P)',         onClick: undefined  },
    { icon: <Search     size={12} />, title: 'Find & Replace (Ctrl+H)',onClick: undefined  },
    { icon: <Settings   size={12} />, title: 'Settings',               onClick: undefined  },
  ];

  return (
    // data-tauri-drag-region on root = fallback for any uncovered pixel.
    // Tauri skips drag on interactive children (buttons, inputs).
    <div
      className="h-9 flex items-center bg-[#1a1a1a] text-white select-none flex-shrink-0 z-50"
      data-tauri-drag-region=""
      onMouseEnter={handleTitleBarMouseEnter}
    >
      {/* ── App icon + "Folio" (draggable) ───────────────────────────────────── */}
      <div
        className="flex items-center pl-3 gap-2 h-full pr-2 flex-shrink-0"
        data-tauri-drag-region=""
      >
        <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 pointer-events-none">
          <span className="text-[8px] text-white font-bold leading-none">F</span>
        </div>
        <span className="text-[11px] text-neutral-300 font-medium pointer-events-none">
          Folio
        </span>
      </div>

      {/* ── Separator + document title (NOT a drag region) ───────────────────── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-neutral-700 text-[11px] pointer-events-none select-none">|</span>
        <DocumentTitleEditor />
      </div>

      {/* ── Menubar (auto-hide) ───────────────────────────────────────────────── */}
      <div className="flex-shrink-0 pl-2">
        <MenuBar visible={menuBarVisible} onHide={handleMenuBarHide} />
      </div>

      {/* ── Flex spacer (draggable) ───────────────────────────────────────────── */}
      <div className="flex-1 h-full" data-tauri-drag-region="" />

      {/* ── Quick-action icon buttons ─────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5 px-2">
        {quickActions.map((a, i) => (
          <button
            key={i}
            title={a.title}
            onClick={a.onClick}
            disabled={!a.onClick}
            className="w-7 h-7 flex items-center justify-center rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-default"
          >
            {a.icon}
          </button>
        ))}
      </div>

      {/* ── Window controls ───────────────────────────────────────────────────── */}
      <div className="flex items-center h-full">
        <button
          title={darkMode ? 'Light mode' : 'Dark mode'}
          onClick={() => setDarkMode(!darkMode)}
          className="w-9 h-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          {darkMode ? <Sun size={12} /> : <Moon size={12} />}
        </button>

        <div className="w-px h-4 bg-white/15 mx-0.5" />

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
            <svg
              width="10" height="10" viewBox="0 0 10 10"
              className="text-neutral-300" fill="none"
              stroke="currentColor" strokeWidth="1.2"
            >
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
