import React, { useRef } from 'react';
import { Plus } from 'lucide-react';
import { useDocumentStore } from '../../store/useDocumentStore';
import PageCanvas from './PageCanvas';
import Ruler from './Ruler';
import ContextMenu from './ContextMenu';

const Workspace: React.FC = () => {
  const { pages, addPage, setContextMenu, zoom, showRuler, showGrid } = useDocumentStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, target: 'workspace' });
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-[#e8e8e8] relative">
      {/* Horizontal ruler */}
      {showRuler && <Ruler zoom={zoom} orientation="horizontal" />}

      <div className="flex flex-1 overflow-hidden">
        {/* Vertical ruler */}
        {showRuler && <Ruler zoom={zoom} orientation="vertical" />}

        {/* Canvas area */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto relative"
          onContextMenu={handleContextMenu}
          onClick={() => setContextMenu(null)}
        >
          {/* Grid overlay */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #888 1px, transparent 1px),
                  linear-gradient(to bottom, #888 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />
          )}

          {/* Pages */}
          <div className="flex flex-col items-center py-10 px-8 min-h-full">
            {pages.map((page, index) => (
              <PageCanvas
                key={page.id}
                pageId={page.id}
                pageNumber={index + 1}
              />
            ))}

            {/* Add page CTA */}
            <button
              onClick={addPage}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-dashed border-neutral-400/40 text-neutral-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/40 transition-all text-[12px] font-medium mt-2 group"
            >
              <Plus size={16} className="group-hover:scale-110 transition-transform" />
              Add New Page
            </button>
          </div>
        </div>
      </div>

      {/* Context menu */}
      <ContextMenu />
    </div>
  );
};

export default Workspace;
