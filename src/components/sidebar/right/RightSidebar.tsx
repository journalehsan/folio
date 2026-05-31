import React, { useCallback, useState } from 'react';
import { Palette, FileText } from 'lucide-react';
import { useDocumentStore } from '../../../store/useDocumentStore';
import { cn } from '../../../utils/cn';
import StyleManagerPanel from './StyleManagerPanel';
import TypographyPanel from './TypographyPanel';
import TemplateManagerPanel from './TemplateManagerPanel';
import DocumentSettingsPanel from './DocumentSettingsPanel';

type FormatSubTab = 'styles' | 'typography';

const RightSidebar: React.FC = () => {
  const {
    rightSidebarOpen,
    rightSidebarTab,
    setRightSidebarTab,
    rightSidebarWidth,
    setRightSidebarWidth,
    formatState,
  } = useDocumentStore();

  const [formatSubTab, setFormatSubTab] = useState<FormatSubTab>('styles');
  const [docSubTab, setDocSubTab] = useState<'document' | 'template'>('document');

  const startResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startW = rightSidebarWidth;

      const onMove = (mv: MouseEvent) => {
        const newW = Math.max(200, Math.min(420, startW - (mv.clientX - startX)));
        setRightSidebarWidth(newW);
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [rightSidebarWidth, setRightSidebarWidth]
  );

  if (!rightSidebarOpen) return null;

  return (
    <div
      className="relative flex flex-col bg-[#fafafa] border-l border-neutral-200 overflow-hidden flex-shrink-0"
      style={{ width: rightSidebarWidth }}
    >
      {/* Resize handle */}
      <div
        onMouseDown={startResize}
        className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-blue-400/40 transition-colors z-10"
      />

      {/* Main tab bar (Format / Document) */}
      <div className="flex border-b border-neutral-200 bg-[#f3f3f3] h-9 px-1 gap-0.5 items-center flex-shrink-0">
        <button
          onClick={() => setRightSidebarTab('format')}
          className={cn(
            'flex items-center gap-1.5 px-3 h-7 rounded text-[11px] font-medium transition-colors',
            rightSidebarTab === 'format'
              ? 'bg-white text-neutral-800 shadow-sm border border-neutral-200'
              : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/60'
          )}
        >
          <Palette size={12} />
          Format
        </button>
        <button
          onClick={() => setRightSidebarTab('document')}
          className={cn(
            'flex items-center gap-1.5 px-3 h-7 rounded text-[11px] font-medium transition-colors',
            rightSidebarTab === 'document'
              ? 'bg-white text-neutral-800 shadow-sm border border-neutral-200'
              : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/60'
          )}
        >
          <FileText size={12} />
          Document
        </button>
      </div>

      {/* ── FORMAT TAB ── */}
      {rightSidebarTab === 'format' && (
        <>
          {/* Context indicator */}
          <div className="px-3 py-1.5 border-b border-neutral-100 bg-white flex items-center gap-2 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-neutral-400">Selection</div>
              <div className="text-[11px] text-neutral-700 font-medium truncate">
                {formatState.paragraphStyle}
                {(formatState.bold || formatState.italic || formatState.underline) && (
                  <span className="text-neutral-400 font-normal ml-1">
                    {[
                      formatState.bold && 'Bold',
                      formatState.italic && 'Italic',
                      formatState.underline && 'Underline',
                    ].filter(Boolean).join(', ')}
                  </span>
                )}
              </div>
            </div>
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: formatState.textColor }}
            />
          </div>

          {/* Sub-tab: Styles / Typography */}
          <div className="flex border-b border-neutral-100 bg-white px-2 gap-2 flex-shrink-0">
            {(['styles', 'typography'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFormatSubTab(tab)}
                className={cn(
                  'py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors border-b-2 -mb-px capitalize',
                  formatSubTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {formatSubTab === 'styles' ? <StyleManagerPanel /> : <TypographyPanel />}
          </div>
        </>
      )}

      {/* ── DOCUMENT TAB ── */}
      {rightSidebarTab === 'document' && (
        <>
          {/* Sub-tab: Document settings / Templates */}
          <div className="flex border-b border-neutral-100 bg-white px-2 gap-2 flex-shrink-0">
            {([
              { id: 'document' as const, label: 'Settings' },
              { id: 'template' as const, label: 'Templates' },
            ]).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setDocSubTab(id)}
                className={cn(
                  'py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors border-b-2 -mb-px',
                  docSubTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {docSubTab === 'document' ? <DocumentSettingsPanel /> : <TemplateManagerPanel />}
          </div>
        </>
      )}
    </div>
  );
};

export default RightSidebar;
