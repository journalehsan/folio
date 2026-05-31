import React from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Outdent,
  Clipboard, ClipboardPaste, Scissors, Copy,
  Link, Image, Table, Code, Quote,
  Undo, Redo,
  PanelLeft, PanelRight, Minus, Plus,
} from 'lucide-react';
import { useDocumentStore } from '../../store/useDocumentStore';
import ToolbarButton from './ToolbarButton';
import ToolbarGroup from './ToolbarGroup';
import StyleDropdown from './StyleDropdown';
import FontSizeControl from './FontSizeControl';
import { cn } from '../../utils/cn';

const TopToolbar: React.FC = () => {
  const {
    activeEditor,
    formatState,
    leftSidebarOpen, setLeftSidebarOpen,
    rightSidebarOpen, setRightSidebarOpen,
    zoom, setZoom,
  } = useDocumentStore();

  const cmd = () => activeEditor?.chain().focus();

  const ZOOM_LEVELS = [50, 75, 90, 100, 110, 125, 150, 175, 200];

  return (
    <div className="flex flex-col bg-[#f3f3f3] border-b border-neutral-300 select-none">
      {/* ── Ribbon toolbar ───────────────────────────────── */}
      <div className="flex items-end h-12 px-2 gap-0 overflow-x-auto overflow-y-hidden">
        {/* Undo / Redo */}
        <ToolbarGroup label="History">
          <ToolbarButton onClick={() => cmd()?.undo().run()} title="Undo (Ctrl+Z)">
            <Undo size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => cmd()?.redo().run()} title="Redo (Ctrl+Y)">
            <Redo size={14} />
          </ToolbarButton>
        </ToolbarGroup>

        <div className="w-px h-8 bg-neutral-300/70 mx-1.5 self-center" />

        {/* Clipboard */}
        <ToolbarGroup label="Clipboard">
          <ToolbarButton title="Cut (Ctrl+X)"><Scissors size={14} /></ToolbarButton>
          <ToolbarButton title="Copy (Ctrl+C)"><Copy size={14} /></ToolbarButton>
          <ToolbarButton title="Paste (Ctrl+V)"><ClipboardPaste size={14} /></ToolbarButton>
          <ToolbarButton title="Format Painter"><Clipboard size={14} /></ToolbarButton>
        </ToolbarGroup>

        <div className="w-px h-8 bg-neutral-300/70 mx-1.5 self-center" />

        {/* Style + Font size */}
        <ToolbarGroup label="Style">
          <StyleDropdown />
          <FontSizeControl />
        </ToolbarGroup>

        <div className="w-px h-8 bg-neutral-300/70 mx-1.5 self-center" />

        {/* Basic Formatting */}
        <ToolbarGroup label="Formatting">
          <ToolbarButton
            active={formatState.bold}
            onClick={() => cmd()?.toggleBold().run()}
            title="Bold (Ctrl+B)"
          >
            <Bold size={14} />
          </ToolbarButton>
          <ToolbarButton
            active={formatState.italic}
            onClick={() => cmd()?.toggleItalic().run()}
            title="Italic (Ctrl+I)"
          >
            <Italic size={14} />
          </ToolbarButton>
          <ToolbarButton
            active={formatState.underline}
            onClick={() => cmd()?.toggleUnderline().run()}
            title="Underline (Ctrl+U)"
          >
            <Underline size={14} />
          </ToolbarButton>
          <ToolbarButton
            active={formatState.strikethrough}
            onClick={() => cmd()?.toggleStrike().run()}
            title="Strikethrough"
          >
            <Strikethrough size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => cmd()?.toggleCode().run()}
            title="Inline Code"
          >
            <Code size={14} />
          </ToolbarButton>
        </ToolbarGroup>

        <div className="w-px h-8 bg-neutral-300/70 mx-1.5 self-center" />

        {/* Paragraph / Alignment */}
        <ToolbarGroup label="Paragraph">
          <ToolbarButton
            active={formatState.textAlign === 'left'}
            onClick={() => cmd()?.setTextAlign('left').run()}
            title="Align Left"
          >
            <AlignLeft size={14} />
          </ToolbarButton>
          <ToolbarButton
            active={formatState.textAlign === 'center'}
            onClick={() => cmd()?.setTextAlign('center').run()}
            title="Align Center"
          >
            <AlignCenter size={14} />
          </ToolbarButton>
          <ToolbarButton
            active={formatState.textAlign === 'right'}
            onClick={() => cmd()?.setTextAlign('right').run()}
            title="Align Right"
          >
            <AlignRight size={14} />
          </ToolbarButton>
          <ToolbarButton
            active={formatState.textAlign === 'justify'}
            onClick={() => cmd()?.setTextAlign('justify').run()}
            title="Justify"
          >
            <AlignJustify size={14} />
          </ToolbarButton>
        </ToolbarGroup>

        <div className="w-px h-8 bg-neutral-300/70 mx-1.5 self-center" />

        {/* Lists */}
        <ToolbarGroup label="Lists">
          <ToolbarButton
            active={formatState.listType === 'bullet'}
            onClick={() => cmd()?.toggleBulletList().run()}
            title="Bullet List"
          >
            <List size={14} />
          </ToolbarButton>
          <ToolbarButton
            active={formatState.listType === 'ordered'}
            onClick={() => cmd()?.toggleOrderedList().run()}
            title="Numbered List"
          >
            <ListOrdered size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => cmd()?.sinkListItem('listItem').run()} title="Indent">
            <Indent size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => cmd()?.liftListItem('listItem').run()} title="Outdent">
            <Outdent size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => cmd()?.toggleBlockquote().run()}
            title="Blockquote"
          >
            <Quote size={14} />
          </ToolbarButton>
        </ToolbarGroup>

        <div className="w-px h-8 bg-neutral-300/70 mx-1.5 self-center" />

        {/* Insert */}
        <ToolbarGroup label="Insert">
          <ToolbarButton title="Insert Link"><Link size={14} /></ToolbarButton>
          <ToolbarButton title="Insert Image"><Image size={14} /></ToolbarButton>
          <ToolbarButton title="Insert Table"><Table size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => cmd()?.setHorizontalRule().run()} title="Horizontal Rule">
            <Minus size={14} />
          </ToolbarButton>
        </ToolbarGroup>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Sidebar toggles */}
        <div className="flex items-center gap-0.5 mb-1 mr-1">
          <button
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            title="Toggle left sidebar"
            className={cn(
              'flex items-center justify-center w-6 h-6 rounded transition-colors text-neutral-500',
              leftSidebarOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-neutral-200'
            )}
          >
            <PanelLeft size={13} />
          </button>
          <button
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            title="Toggle right sidebar"
            className={cn(
              'flex items-center justify-center w-6 h-6 rounded transition-colors text-neutral-500',
              rightSidebarOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-neutral-200'
            )}
          >
            <PanelRight size={13} />
          </button>
        </div>

        <div className="w-px h-5 bg-neutral-300/70 mx-1 self-center" />

        {/* Zoom control */}
        <div className="flex items-center gap-1 mb-1 mr-2">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="w-5 h-5 rounded hover:bg-neutral-200 flex items-center justify-center text-neutral-500"
          >
            <Minus size={11} />
          </button>
          <select
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="text-[10px] bg-white border border-neutral-300 rounded px-1 h-6 text-neutral-600 focus:outline-none focus:border-blue-400"
          >
            {ZOOM_LEVELS.map((z) => (
              <option key={z} value={z}>{z}%</option>
            ))}
          </select>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="w-5 h-5 rounded hover:bg-neutral-200 flex items-center justify-center text-neutral-500"
          >
            <Plus size={11} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopToolbar;
