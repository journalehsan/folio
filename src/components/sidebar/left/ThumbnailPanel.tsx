import React from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
import { useDocumentStore } from '../../../store/useDocumentStore';
import { cn } from '../../../utils/cn';

const ThumbnailPanel: React.FC = () => {
  const { pages, activePageId, setActivePageId, addPage, removePage } = useDocumentStore();

  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-3 py-1 mb-2">
        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
          Pages ({pages.length})
        </span>
        <button
          onClick={addPage}
          className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus size={11} />
          Add
        </button>
      </div>

      <div className="flex flex-col gap-2 px-2">
        {pages.map((page, index) => (
          <div
            key={page.id}
            className={cn(
              'group relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer',
              activePageId === page.id
                ? 'border-blue-500 shadow-md shadow-blue-200'
                : 'border-transparent hover:border-neutral-300'
            )}
            onClick={() => setActivePageId(page.id)}
          >
            {/* Thumbnail preview (placeholder) */}
            <div
              className="relative bg-white"
              style={{ paddingTop: '141.4%' }} // A4 aspect ratio
            >
              {/* A4 page preview */}
              <div className="absolute inset-0 p-2 flex flex-col gap-1 overflow-hidden">
                {/* Simulated content lines */}
                <div className="bg-neutral-800 rounded-sm h-2 w-3/4 opacity-60" />
                <div className="bg-neutral-200 rounded-sm h-1 w-full" />
                <div className="bg-neutral-200 rounded-sm h-1 w-full" />
                <div className="bg-neutral-200 rounded-sm h-1 w-5/6" />
                <div className="h-1" />
                <div className="bg-neutral-300 rounded-sm h-1.5 w-1/2 opacity-70" />
                <div className="bg-neutral-200 rounded-sm h-1 w-full" />
                <div className="bg-neutral-200 rounded-sm h-1 w-full" />
                <div className="bg-neutral-200 rounded-sm h-1 w-4/5" />
                <div className="bg-neutral-200 rounded-sm h-1 w-full" />
                <div className="h-1" />
                <div className="bg-neutral-300 rounded-sm h-1.5 w-2/3 opacity-70" />
                <div className="bg-neutral-200 rounded-sm h-1 w-full" />
                <div className="bg-neutral-200 rounded-sm h-1 w-3/4" />
              </div>

              {/* Page number badge */}
              <div className="absolute bottom-1 right-1 bg-neutral-800/60 text-white text-[9px] rounded px-1">
                {index + 1}
              </div>

              {/* Action overlay */}
              <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5">
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  title="Duplicate page"
                  className="w-5 h-5 rounded bg-white/90 shadow hover:bg-blue-50 flex items-center justify-center"
                >
                  <Copy size={9} className="text-neutral-600" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); removePage(page.id); }}
                  title="Delete page"
                  className="w-5 h-5 rounded bg-white/90 shadow hover:bg-red-50 flex items-center justify-center"
                >
                  <Trash2 size={9} className="text-red-500" />
                </button>
              </div>
            </div>

            {/* Page label */}
            <div className={cn(
              'px-2 py-1 text-[10px] text-center font-medium truncate',
              activePageId === page.id ? 'text-blue-600 bg-blue-50' : 'text-neutral-500 bg-neutral-50'
            )}>
              {page.title}
            </div>
          </div>
        ))}

        {/* Add page button */}
        <button
          onClick={addPage}
          className="flex items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-neutral-200 py-4 text-[11px] text-neutral-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all"
        >
          <Plus size={13} />
          Add Page
        </button>
      </div>
    </div>
  );
};

export default ThumbnailPanel;
