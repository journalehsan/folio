import React, { useEffect, useRef } from 'react';
import {
  Copy, Scissors, ClipboardPaste, Bold, Italic, Underline,
  Link, Image, Table, List, Trash2, Plus,
  Minus, Hash,
} from 'lucide-react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { cn } from '../../utils/cn';

interface MenuItem {
  type: 'item' | 'separator' | 'submenu';
  label?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  action?: () => void;
  danger?: boolean;
  disabled?: boolean;
}

const ContextMenu: React.FC = () => {
  const { contextMenu, setContextMenu, activeEditor, addPage, removePage, activePageId } =
    useDocumentStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContextMenu(null);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [setContextMenu]);

  if (!contextMenu) return null;

  const cmd = () => activeEditor?.chain().focus();

  const workspaceItems: MenuItem[] = [
    { type: 'item', label: 'Cut',             icon: <Scissors size={12} />,      shortcut: 'Ctrl+X', action: () => document.execCommand('cut') },
    { type: 'item', label: 'Copy',            icon: <Copy size={12} />,          shortcut: 'Ctrl+C', action: () => document.execCommand('copy') },
    { type: 'item', label: 'Paste',           icon: <ClipboardPaste size={12} />,shortcut: 'Ctrl+V', action: () => document.execCommand('paste') },
    { type: 'separator' },
    { type: 'item', label: 'Bold',            icon: <Bold size={12} />,          shortcut: 'Ctrl+B', action: () => cmd()?.toggleBold().run() },
    { type: 'item', label: 'Italic',          icon: <Italic size={12} />,        shortcut: 'Ctrl+I', action: () => cmd()?.toggleItalic().run() },
    { type: 'item', label: 'Underline',       icon: <Underline size={12} />,     shortcut: 'Ctrl+U', action: () => cmd()?.toggleUnderline().run() },
    { type: 'separator' },
    { type: 'item', label: 'Heading 1',       icon: <Hash size={12} />,          action: () => cmd()?.toggleHeading({ level: 1 }).run() },
    { type: 'item', label: 'Heading 2',       icon: <Hash size={12} />,          action: () => cmd()?.toggleHeading({ level: 2 }).run() },
    { type: 'item', label: 'Bullet List',     icon: <List size={12} />,          action: () => cmd()?.toggleBulletList().run() },
    { type: 'separator' },
    { type: 'item', label: 'Insert Link',     icon: <Link size={12} />,          action: () => {} },
    { type: 'item', label: 'Insert Image',    icon: <Image size={12} />,         action: () => {} },
    { type: 'item', label: 'Insert Table',    icon: <Table size={12} />,         action: () => {} },
    { type: 'item', label: 'Divider',         icon: <Minus size={12} />,         action: () => cmd()?.setHorizontalRule().run() },
    { type: 'separator' },
    { type: 'item', label: 'Add Page After',  icon: <Plus size={12} />,          action: () => addPage() },
    { type: 'item', label: 'Delete Page',     icon: <Trash2 size={12} />,        danger: true, action: () => removePage(activePageId) },
  ];

  // Calculate clamped position
  const menuWidth = 220;
  const menuHeight = 380;
  const x = Math.min(contextMenu.x, window.innerWidth - menuWidth - 8);
  const y = Math.min(contextMenu.y, window.innerHeight - menuHeight - 8);

  return (
    <div
      ref={ref}
      style={{ left: x, top: y, width: menuWidth }}
      className="fixed z-[9999] bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-neutral-200/80 py-1.5 overflow-hidden"
    >
      {workspaceItems.map((item, i) => {
        if (item.type === 'separator') {
          return <div key={i} className="my-1 h-px bg-neutral-100 mx-2" />;
        }

        return (
          <button
            key={i}
            onClick={() => {
              item.action?.();
              setContextMenu(null);
            }}
            disabled={item.disabled}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-1.5 text-[11px] text-left transition-colors',
              item.danger
                ? 'text-red-600 hover:bg-red-50'
                : 'text-neutral-700 hover:bg-blue-50 hover:text-blue-700',
              item.disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent'
            )}
          >
            <span className={cn('flex-shrink-0', item.danger ? 'text-red-500' : 'text-neutral-400')}>
              {item.icon}
            </span>
            <span className="flex-1">{item.label}</span>
            {item.shortcut && (
              <span className="text-[10px] text-neutral-400 font-mono">{item.shortcut}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ContextMenu;
