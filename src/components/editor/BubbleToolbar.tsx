import React from 'react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Bold, Italic, Underline, Strikethrough, Code, Link, Highlighter } from 'lucide-react';
import type { Editor } from '@tiptap/react';
import { cn } from '../../utils/cn';

interface BubbleToolbarProps {
  editor: Editor;
}

const BubbleBtn: React.FC<{
  onClick: () => void;
  active?: boolean;
  title?: string;
  children: React.ReactNode;
}> = ({ onClick, active, title, children }) => (
  <button
    onClick={onClick}
    title={title}
    className={cn(
      'w-7 h-7 flex items-center justify-center rounded-md transition-colors text-[11px]',
      active
        ? 'bg-blue-500 text-white'
        : 'text-neutral-200 hover:bg-white/20 hover:text-white'
    )}
  >
    {children}
  </button>
);

const BubbleToolbar: React.FC<BubbleToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      className="flex items-center gap-0.5 px-1.5 py-1 bg-[#1e1e2e]/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/10"
    >
      <BubbleBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Bold"
      >
        <Bold size={13} />
      </BubbleBtn>
      <BubbleBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Italic"
      >
        <Italic size={13} />
      </BubbleBtn>
      <BubbleBtn
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
        title="Underline"
      >
        <Underline size={13} />
      </BubbleBtn>
      <BubbleBtn
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
        title="Strikethrough"
      >
        <Strikethrough size={13} />
      </BubbleBtn>
      <BubbleBtn
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive('code')}
        title="Code"
      >
        <Code size={13} />
      </BubbleBtn>

      {/* Divider */}
      <div className="w-px h-4 bg-white/20 mx-0.5" />

      <BubbleBtn
        onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
        active={editor.isActive('highlight')}
        title="Highlight"
      >
        <Highlighter size={13} />
      </BubbleBtn>
      <BubbleBtn onClick={() => {}} title="Link">
        <Link size={13} />
      </BubbleBtn>

      {/* Divider */}
      <div className="w-px h-4 bg-white/20 mx-0.5" />

      {/* Heading quick buttons */}
      {([1, 2, 3] as const).map((level) => (
        <BubbleBtn
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          active={editor.isActive('heading', { level })}
          title={`Heading ${level}`}
        >
          <span className="font-bold text-[10px]">H{level}</span>
        </BubbleBtn>
      ))}
    </BubbleMenu>
  );
};

export default BubbleToolbar;
