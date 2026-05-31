import React, { useState } from 'react';
import { Plus, MoreHorizontal, Paintbrush, Check } from 'lucide-react';
import { useDocumentStore } from '../../../store/useDocumentStore';
import { cn } from '../../../utils/cn';

const STYLE_TAG_COLORS: Record<string, string> = {
  normal:   'bg-neutral-200 text-neutral-600',
  title:    'bg-purple-100 text-purple-700',
  subtitle: 'bg-purple-50 text-purple-500',
  heading1: 'bg-blue-100 text-blue-700',
  heading2: 'bg-blue-50 text-blue-600',
  heading3: 'bg-sky-50 text-sky-600',
  heading4: 'bg-sky-50 text-sky-500',
  quote:    'bg-amber-50 text-amber-700',
  code:     'bg-green-50 text-green-700',
  caption:  'bg-neutral-100 text-neutral-500',
};

const PREVIEW_SIZES: Record<string, string> = {
  normal:   'text-[12px]',
  title:    'text-[18px] font-bold',
  subtitle: 'text-[14px] font-semibold',
  heading1: 'text-[16px] font-bold',
  heading2: 'text-[14px] font-semibold',
  heading3: 'text-[13px] font-semibold',
  heading4: 'text-[12px] font-medium',
  quote:    'text-[12px] italic border-l-2 border-amber-400 pl-2',
  code:     'text-[11px] font-mono bg-green-50 px-1 rounded',
  caption:  'text-[10px] text-neutral-400',
};

const StyleManagerPanel: React.FC = () => {
  const { styles, selectedStyleId, setSelectedStyle, activeEditor } = useDocumentStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const applyStyle = (styleId: string) => {
    setSelectedStyle(styleId);
    if (!activeEditor) return;
    const chain = activeEditor.chain().focus();
    switch (styleId) {
      case 'heading1': chain.toggleHeading({ level: 1 }).run(); break;
      case 'heading2': chain.toggleHeading({ level: 2 }).run(); break;
      case 'heading3': chain.toggleHeading({ level: 3 }).run(); break;
      case 'heading4': chain.toggleHeading({ level: 4 }).run(); break;
      case 'quote':    chain.toggleBlockquote().run(); break;
      case 'code':     chain.toggleCodeBlock().run(); break;
      default:         chain.setParagraph().run(); break;
    }
  };

  return (
    <div className="py-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 mb-1">
        <div className="flex items-center gap-1.5">
          <Paintbrush size={12} className="text-neutral-400" />
          <span className="text-[11px] font-semibold text-neutral-600">Paragraph Styles</span>
        </div>
        <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600">
          <Plus size={12} />
        </button>
      </div>

      {/* Style list */}
      <div className="flex flex-col gap-0.5 px-1.5">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => applyStyle(style.id)}
            onMouseEnter={() => setHoveredId(style.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={cn(
              'w-full flex items-center gap-2 px-2 py-2 rounded-lg transition-all text-left group',
              selectedStyleId === style.id
                ? 'bg-blue-50 border border-blue-200'
                : 'hover:bg-neutral-100 border border-transparent'
            )}
          >
            {/* Tag badge */}
            <span
              className={cn(
                'text-[9px] font-mono px-1.5 py-0.5 rounded-sm font-semibold flex-shrink-0',
                STYLE_TAG_COLORS[style.id] ?? 'bg-neutral-200 text-neutral-500'
              )}
            >
              {style.htmlTag}
            </span>

            {/* Preview + name */}
            <div className="flex-1 min-w-0">
              <div className={cn(
                'truncate leading-tight',
                PREVIEW_SIZES[style.id] ?? 'text-[12px]'
              )}>
                {style.name}
              </div>
              {hoveredId === style.id && (
                <div className="text-[9px] text-neutral-400 truncate">{style.description}</div>
              )}
            </div>

            {/* Check / actions */}
            <div className="flex-shrink-0 flex items-center gap-1">
              {selectedStyleId === style.id && (
                <Check size={11} className="text-blue-500" />
              )}
              <button
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded hover:bg-neutral-200"
              >
                <MoreHorizontal size={11} className="text-neutral-400" />
              </button>
            </div>
          </button>
        ))}
      </div>

      {/* Character styles section */}
      <div className="mt-4 border-t border-neutral-100 pt-3 px-3">
        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
          Character Styles
        </span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[
            { label: 'Bold',   cls: 'font-bold' },
            { label: 'Italic', cls: 'italic' },
            { label: 'Code',   cls: 'font-mono text-green-700 bg-green-50' },
            { label: 'Small',  cls: 'text-[10px]' },
            { label: 'Caps',   cls: 'uppercase tracking-wide' },
          ].map((cs) => (
            <button
              key={cs.label}
              className={cn(
                'px-2 py-1 rounded border border-neutral-200 text-[11px] hover:border-blue-400 hover:bg-blue-50 transition-colors',
                cs.cls
              )}
            >
              {cs.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StyleManagerPanel;
