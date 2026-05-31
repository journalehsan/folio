import React from 'react';
import { FileText, AlignLeft, Clock, CheckCircle, Grid, Ruler } from 'lucide-react';
import { useDocumentStore } from '../store/useDocumentStore';
import { cn } from '../utils/cn';

const StatusBar: React.FC = () => {
  const { pages, meta, zoom, setZoom, showRuler, toggleRuler, showGrid, toggleGrid } =
    useDocumentStore();

  const totalWords = pages.reduce((sum, p) => sum + p.wordCount, 0);
  const totalChars = pages.reduce((sum, p) => sum + p.characterCount, 0);

  return (
    <div className="h-6 flex items-center bg-[#f0f0f0] border-t border-neutral-300 px-3 gap-4 text-[10px] text-neutral-500 select-none flex-shrink-0">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <FileText size={10} className="text-neutral-400" />
          <span>{pages.length} {pages.length === 1 ? 'page' : 'pages'}</span>
        </div>
        <div className="w-px h-3 bg-neutral-300" />
        <div className="flex items-center gap-1">
          <AlignLeft size={10} className="text-neutral-400" />
          <span>{totalWords.toLocaleString()} words</span>
        </div>
        <div className="w-px h-3 bg-neutral-300" />
        <span>{totalChars.toLocaleString()} characters</span>
        <div className="w-px h-3 bg-neutral-300" />
        <span>{meta.pageSize} · {meta.orientation}</span>
        <div className="w-px h-3 bg-neutral-300" />
        <span>{meta.template}</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Saved status */}
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle size={10} />
          <span>Saved</span>
        </div>
        <div className="w-px h-3 bg-neutral-300" />

        {/* Toggle controls */}
        <button
          onClick={toggleRuler}
          title="Toggle Ruler"
          className={cn(
            'flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors',
            showRuler ? 'text-blue-600 bg-blue-50' : 'hover:bg-neutral-200'
          )}
        >
          <Ruler size={10} />
          <span>Ruler</span>
        </button>
        <button
          onClick={toggleGrid}
          title="Toggle Grid"
          className={cn(
            'flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors',
            showGrid ? 'text-blue-600 bg-blue-50' : 'hover:bg-neutral-200'
          )}
        >
          <Grid size={10} />
          <span>Grid</span>
        </button>
        <div className="w-px h-3 bg-neutral-300" />

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="w-4 h-4 flex items-center justify-center rounded hover:bg-neutral-200"
          >
            −
          </button>
          <input
            type="range"
            min={50}
            max={200}
            step={10}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-16 h-1.5 accent-blue-500"
          />
          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="w-4 h-4 flex items-center justify-center rounded hover:bg-neutral-200"
          >
            +
          </button>
          <span className="w-8 text-center font-medium text-neutral-600">{zoom}%</span>
        </div>

        {/* Modified date */}
        <div className="w-px h-3 bg-neutral-300" />
        <div className="flex items-center gap-1">
          <Clock size={10} className="text-neutral-400" />
          <span>
            {meta.modifiedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
