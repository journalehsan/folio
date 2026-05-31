import React from 'react';
import { Hash, FileText } from 'lucide-react';
import { useDocumentStore } from '../../../store/useDocumentStore';
import { cn } from '../../../utils/cn';

const MOCK_OUTLINE = [
  { id: 'h1-1', level: 1, text: 'Untitled Document', pageId: 'page-1' },
  { id: 'h2-1', level: 2, text: 'Introduction', pageId: 'page-1' },
  { id: 'h3-1', level: 3, text: 'Background', pageId: 'page-1' },
  { id: 'h3-2', level: 3, text: 'Motivation', pageId: 'page-1' },
  { id: 'h2-2', level: 2, text: 'Methodology', pageId: 'page-1' },
  { id: 'h3-3', level: 3, text: 'Data Collection', pageId: 'page-1' },
  { id: 'h2-3', level: 2, text: 'Results', pageId: 'page-1' },
  { id: 'h2-4', level: 2, text: 'Conclusion', pageId: 'page-1' },
];

const INDENT_MAP: Record<number, string> = {
  1: 'pl-2',
  2: 'pl-5',
  3: 'pl-8',
  4: 'pl-11',
};

const SIZE_MAP: Record<number, string> = {
  1: 'text-[11px] font-semibold text-neutral-800',
  2: 'text-[11px] font-medium text-neutral-700',
  3: 'text-[11px] text-neutral-500',
  4: 'text-[10px] text-neutral-400',
};

const OutlinePanel: React.FC = () => {
  const { outline, pages, setActivePageId } = useDocumentStore();
  const displayNodes = outline.length > 0 ? outline : MOCK_OUTLINE;

  return (
    <div className="py-2">
      {/* Section header */}
      <div className="flex items-center justify-between px-3 py-1 mb-1">
        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
          Document Outline
        </span>
      </div>

      {/* Outline nodes */}
      {displayNodes.map((node) => (
        <button
          key={node.id}
          onClick={() => setActivePageId(node.pageId)}
          className={cn(
            'w-full flex items-center gap-1.5 py-1 pr-3 rounded-sm transition-colors',
            'hover:bg-blue-50 hover:text-blue-700 group text-left',
            INDENT_MAP[node.level] ?? 'pl-2',
            SIZE_MAP[node.level] ?? 'text-[10px] text-neutral-400'
          )}
        >
          {node.level === 1 ? (
            <FileText size={11} className="flex-shrink-0 text-neutral-400 group-hover:text-blue-500" />
          ) : (
            <Hash size={10} className="flex-shrink-0 text-neutral-300 group-hover:text-blue-400" />
          )}
          <span className="truncate leading-tight">{node.text}</span>
        </button>
      ))}

      {displayNodes.length === 0 && (
        <div className="px-3 py-6 text-center">
          <Hash size={20} className="mx-auto text-neutral-300 mb-2" />
          <p className="text-[11px] text-neutral-400">
            Add headings to your document to build an outline.
          </p>
        </div>
      )}

      {/* Pages section */}
      <div className="mt-4 border-t border-neutral-200 pt-3">
        <div className="px-3 mb-2">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            Pages ({pages.length})
          </span>
        </div>
        {pages.map((page, i) => (
          <button
            key={page.id}
            onClick={() => setActivePageId(page.id)}
            className="w-full flex items-center gap-2 px-3 py-1 hover:bg-neutral-100 transition-colors"
          >
            <span className="text-[10px] text-neutral-400 w-4 text-right">{i + 1}</span>
            <FileText size={11} className="text-neutral-400" />
            <span className="text-[11px] text-neutral-600 truncate text-left">{page.title}</span>
            {page.wordCount > 0 && (
              <span className="text-[9px] text-neutral-400 ml-auto">{page.wordCount}w</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OutlinePanel;
