import React from 'react';
import { useDocumentStore } from '../../store/useDocumentStore';
import PageEditor from '../editor/PageEditor';
import { cn } from '../../utils/cn';

interface PageCanvasProps {
  pageId: string;
  pageNumber: number;
}

// A4 dimensions at 96dpi: 210mm × 297mm = 794px × 1123px
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const MM_TO_PX = 3.7795275591; // 1mm in px at 96dpi

const PageCanvas: React.FC<PageCanvasProps> = ({ pageId, pageNumber }) => {
  const { pages, meta, activePageId, zoom } = useDocumentStore();
  const page = pages.find((p) => p.id === pageId);
  const isActive = activePageId === pageId;
  const scale = zoom / 100;

  if (!page) return null;

  const marginTop    = meta.marginTop    * MM_TO_PX;
  const marginBottom = meta.marginBottom * MM_TO_PX;
  const marginLeft   = meta.marginLeft   * MM_TO_PX;
  const marginRight  = meta.marginRight  * MM_TO_PX;

  const width  = meta.orientation === 'Landscape' ? A4_HEIGHT_PX : A4_WIDTH_PX;
  const height = meta.orientation === 'Landscape' ? A4_WIDTH_PX  : A4_HEIGHT_PX;

  return (
    <div
      className="flex flex-col items-center mb-8 flex-shrink-0"
      style={{
        width: width * scale,
        transform: 'none',
      }}
    >
      {/* Page number label */}
      <div className="text-[10px] text-neutral-400 mb-1.5 font-medium select-none">
        Page {pageNumber}
      </div>

      {/* Page shadow + border */}
      <div
        className={cn(
          'relative bg-white transition-shadow duration-200 overflow-hidden',
          isActive
            ? 'shadow-[0_0_0_2px_#3b82f6,_0_4px_32px_rgba(0,0,0,0.18)]'
            : 'shadow-[0_2px_16px_rgba(0,0,0,0.14)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.18)]'
        )}
        style={{
          width:  width  * scale,
          height: height * scale,
        }}
      >
        {/* Scale wrapper */}
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width,
            height,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {/* Header zone */}
          {meta.headerEnabled && (
            <div
              className="absolute top-0 left-0 right-0 border-b border-neutral-200/60 flex items-center px-8"
              style={{ height: marginTop * 0.8, paddingLeft: marginLeft, paddingRight: marginRight }}
            >
              <span className="text-[10px] text-neutral-400 italic">{meta.title}</span>
            </div>
          )}

          {/* Main editor area */}
          <div
            className="absolute overflow-hidden"
            style={{
              top: marginTop,
              bottom: marginBottom,
              left: marginLeft,
              right: marginRight,
            }}
          >
            <PageEditor page={page} isActive={isActive} />
          </div>

          {/* Footer zone */}
          {meta.footerEnabled && (
            <div
              className="absolute bottom-0 left-0 right-0 border-t border-neutral-200/60 flex items-center justify-between"
              style={{ height: marginBottom * 0.8, paddingLeft: marginLeft, paddingRight: marginRight }}
            >
              <span className="text-[10px] text-neutral-400">{meta.author}</span>
              {meta.pageNumbering && (
                <span className="text-[10px] text-neutral-400">{pageNumber}</span>
              )}
            </div>
          )}

          {/* Page number (bottom center) */}
          {meta.pageNumbering && !meta.footerEnabled && (
            <div
              className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
              style={{ height: marginBottom }}
            >
              <span className="text-[10px] text-neutral-300">{pageNumber}</span>
            </div>
          )}

          {/* Column guides (visual only) */}
          {meta.columnCount > 1 && (
            <div
              className="absolute pointer-events-none"
              style={{ top: marginTop, bottom: marginBottom, left: marginLeft, right: marginRight }}
            >
              {Array.from({ length: meta.columnCount - 1 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 border-l border-dashed border-blue-200/50"
                  style={{ left: `${((i + 1) / meta.columnCount) * 100}%` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Word count badge */}
      {page.wordCount > 0 && (
        <div className="text-[9px] text-neutral-400 mt-1 select-none">
          {page.wordCount} words · {page.characterCount} chars
        </div>
      )}
    </div>
  );
};

export default PageCanvas;
