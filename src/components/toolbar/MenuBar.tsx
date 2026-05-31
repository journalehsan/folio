import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { closeWindow } from '../../tauri/window';
import { cn } from '../../utils/cn';
import MenuDropdown from './MenuDropdown';
import type { MenuItemDef } from './MenuDropdown';
import AboutDialog from './AboutDialog';

interface MenuBarProps {
  /** Controlled by parent TitleBar — hides/shows the whole row. */
  visible: boolean;
  /** Called by the 30-second idle timer when it decides to hide. */
  onHide: () => void;
}

const MENU_LABELS = ['File', 'Edit', 'View', 'Help'] as const;

const MenuBar: React.FC<MenuBarProps> = ({ visible, onHide }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  const barRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tracks whether the pointer is anywhere inside the interaction zone
  // (bar row OR open dropdown). A 150ms debounce bridges the gap between
  // mouseleave on the bar and mouseenter on the dropdown.
  const pointerInsideRef = useRef(false);
  const pointerDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stores the bounding rect of the button that was last clicked, so the
  // dropdown knows exactly where to anchor itself.
  const buttonRectsRef = useRef<Record<string, DOMRect>>({});

  const { newDocument, clearOpenedFileReferencePlaceholder } = useDocumentStore();

  // ── Auto-hide timer ────────────────────────────────────────────────────────
  // Every 30 seconds, if the pointer has been outside the zone and no menu is
  // open, signal the parent to hide the bar.
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      if (!pointerInsideRef.current && openMenu === null) {
        onHide();
      }
    }, 30_000);
    return () => clearInterval(id);
  }, [visible, openMenu, onHide]);

  // ── Close on outside mousedown ─────────────────────────────────────────────
  useEffect(() => {
    if (!openMenu) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      // Keep open if the click landed inside the bar row or the open dropdown.
      if (barRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
      setOpenMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenu]);

  // ── Pointer tracking helpers ───────────────────────────────────────────────
  const markInside = useCallback(() => {
    if (pointerDebounceRef.current) clearTimeout(pointerDebounceRef.current);
    pointerInsideRef.current = true;
  }, []);

  const markOutside = useCallback(() => {
    pointerDebounceRef.current = setTimeout(() => {
      pointerInsideRef.current = false;
    }, 150);
  }, []);

  // ── Menu button click ──────────────────────────────────────────────────────
  const handleMenuClick = (label: string, el: HTMLButtonElement | null) => {
    if (el) buttonRectsRef.current[label] = el.getBoundingClientRect();
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleNewDocument = useCallback(() => {
    clearOpenedFileReferencePlaceholder();
    newDocument();
  }, [newDocument, clearOpenedFileReferencePlaceholder]);

  // ── Menu definitions ───────────────────────────────────────────────────────
  const menus: Record<string, MenuItemDef[]> = {
    File: [
      { type: 'item',      label: 'New',          shortcut: 'Ctrl+N', action: handleNewDocument },
      { type: 'separator' },
      { type: 'item',      label: 'Open…',         shortcut: 'Ctrl+O', disabled: true },
      { type: 'item',      label: 'Save',          shortcut: 'Ctrl+S', disabled: true },
      { type: 'item',      label: 'Save As…',      shortcut: 'Ctrl+Shift+S', disabled: true },
      { type: 'separator' },
      { type: 'item',      label: 'Export to PDF',                     disabled: true },
      { type: 'item',      label: 'Print…',        shortcut: 'Ctrl+P', disabled: true },
      { type: 'separator' },
      { type: 'item',      label: 'Exit',                              action: closeWindow },
    ],
    Edit: [
      { type: 'item',      label: 'Undo',           shortcut: 'Ctrl+Z', disabled: true },
      { type: 'item',      label: 'Redo',           shortcut: 'Ctrl+Y', disabled: true },
      { type: 'separator' },
      { type: 'item',      label: 'Cut',            shortcut: 'Ctrl+X', disabled: true },
      { type: 'item',      label: 'Copy',           shortcut: 'Ctrl+C', disabled: true },
      { type: 'item',      label: 'Paste',          shortcut: 'Ctrl+V', disabled: true },
      { type: 'separator' },
      { type: 'item',      label: 'Find & Replace', shortcut: 'Ctrl+H', disabled: true },
    ],
    View: [
      { type: 'item',      label: 'Ruler',                             disabled: true },
      { type: 'item',      label: 'Grid',                              disabled: true },
      { type: 'separator' },
      { type: 'item',      label: 'Zoom In',        shortcut: 'Ctrl++', disabled: true },
      { type: 'item',      label: 'Zoom Out',       shortcut: 'Ctrl+-', disabled: true },
      { type: 'separator' },
      { type: 'item',      label: 'Full Screen',    shortcut: 'F11',    disabled: true },
    ],
    Help: [
      { type: 'item',      label: 'Documentation',                     disabled: true },
      { type: 'item',      label: 'Report Issue',                      disabled: true },
      { type: 'separator' },
      { type: 'item',      label: 'About',                             action: () => setShowAbout(true) },
    ],
  };

  const openMenuRect = openMenu ? buttonRectsRef.current[openMenu] : null;

  return (
    <>
      {/* ── Bar row ─────────────────────────────────────────────────────────── */}
      <div
        ref={barRef}
        className={cn(
          'flex items-center gap-0.5 px-1 transition-opacity duration-200',
          visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onMouseEnter={markInside}
        onMouseLeave={markOutside}
      >
        {MENU_LABELS.map((label) => (
          <button
            key={label}
            onClick={(e) => handleMenuClick(label, e.currentTarget)}
            className={cn(
              'h-6 px-2.5 rounded text-[11px] font-medium transition-colors cursor-default',
              openMenu === label
                ? 'bg-white/20 text-white'
                : 'text-neutral-300 hover:text-white hover:bg-white/10'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Open dropdown (fixed-position, outside drag regions) ────────────── */}
      {openMenu && openMenuRect && menus[openMenu] && (
        <MenuDropdown
          ref={dropdownRef}
          items={menus[openMenu]}
          anchorRect={openMenuRect}
          onClose={() => setOpenMenu(null)}
          onMouseEnter={markInside}
          onMouseLeave={markOutside}
        />
      )}

      {/* ── About dialog ────────────────────────────────────────────────────── */}
      {showAbout && <AboutDialog onClose={() => setShowAbout(false)} />}
    </>
  );
};

export default MenuBar;
