import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { cn } from '../../utils/cn';

const STYLE_OPTIONS = [
  { label: 'Normal',    action: (e: any) => e.setParagraph() },
  { label: 'Heading 1', action: (e: any) => e.toggleHeading({ level: 1 }) },
  { label: 'Heading 2', action: (e: any) => e.toggleHeading({ level: 2 }) },
  { label: 'Heading 3', action: (e: any) => e.toggleHeading({ level: 3 }) },
  { label: 'Heading 4', action: (e: any) => e.toggleHeading({ level: 4 }) },
  { label: 'Quote',     action: (e: any) => e.toggleBlockquote() },
  { label: 'Code Block',action: (e: any) => e.toggleCodeBlock() },
];

const StyleDropdown: React.FC = () => {
  const { activeEditor, formatState } = useDocumentStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const apply = (action: (e: any) => void) => {
    if (!activeEditor) return;
    action(activeEditor.chain().focus());
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-1 h-7 px-2 rounded text-[11px] font-medium',
          'text-neutral-700 hover:bg-neutral-200/80 transition-colors min-w-[100px]',
          open && 'bg-neutral-200'
        )}
      >
        <span className="flex-1 text-left truncate">{formatState.paragraphStyle}</span>
        <ChevronDown size={12} className="flex-shrink-0 text-neutral-400" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 py-1 overflow-hidden">
          {STYLE_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => apply(opt.action)}
              className={cn(
                'w-full text-left px-3 py-1.5 text-[12px] hover:bg-blue-50 hover:text-blue-700 transition-colors',
                formatState.paragraphStyle === opt.label && 'bg-blue-50 text-blue-700 font-medium'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StyleDropdown;
