import React, { useCallback } from 'react';
import { AlignLeft, LayoutGrid } from 'lucide-react';
import { useDocumentStore } from '../../../store/useDocumentStore';
import { cn } from '../../../utils/cn';
import OutlinePanel from './OutlinePanel';
import ThumbnailPanel from './ThumbnailPanel';

const LeftSidebar: React.FC = () => {
  const {
    leftSidebarOpen,
    leftSidebarTab,
    setLeftSidebarTab,
    leftSidebarWidth,
    setLeftSidebarWidth,
  } = useDocumentStore();

  const startResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startW = leftSidebarWidth;

      const onMove = (mv: MouseEvent) => {
        const newW = Math.max(160, Math.min(400, startW + mv.clientX - startX));
        setLeftSidebarWidth(newW);
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [leftSidebarWidth, setLeftSidebarWidth]
  );

  if (!leftSidebarOpen) return null;

  return (
    <div
      className="relative flex flex-col bg-[#fafafa] border-r border-neutral-200 overflow-hidden flex-shrink-0"
      style={{ width: leftSidebarWidth }}
    >
      {/* Tab bar */}
      <div className="flex items-center border-b border-neutral-200 bg-[#f3f3f3] h-9 px-1 gap-0.5 flex-shrink-0">
        <button
          onClick={() => setLeftSidebarTab('outline')}
          className={cn(
            'flex items-center gap-1.5 px-2.5 h-7 rounded text-[11px] font-medium transition-colors',
            leftSidebarTab === 'outline'
              ? 'bg-white text-neutral-800 shadow-sm border border-neutral-200'
              : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/60'
          )}
        >
          <AlignLeft size={12} />
          Outline
        </button>
        <button
          onClick={() => setLeftSidebarTab('thumbnails')}
          className={cn(
            'flex items-center gap-1.5 px-2.5 h-7 rounded text-[11px] font-medium transition-colors',
            leftSidebarTab === 'thumbnails'
              ? 'bg-white text-neutral-800 shadow-sm border border-neutral-200'
              : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/60'
          )}
        >
          <LayoutGrid size={12} />
          Pages
        </button>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {leftSidebarTab === 'outline' ? <OutlinePanel /> : <ThumbnailPanel />}
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={startResize}
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-400/40 transition-colors z-10"
      />
    </div>
  );
};

export default LeftSidebar;
