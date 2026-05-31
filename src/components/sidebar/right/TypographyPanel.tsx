import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronDown } from 'lucide-react';
import { useDocumentStore } from '../../../store/useDocumentStore';
import { cn } from '../../../utils/cn';

const FONT_FAMILIES = [
  'Inter', 'Georgia', 'Times New Roman', 'Arial', 'Helvetica', 'Courier New',
  'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
];

const LINE_HEIGHTS = [1, 1.15, 1.25, 1.5, 1.75, 2, 2.5, 3];

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-3 pt-3 pb-1">
    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">{children}</span>
  </div>
);

const TypographyPanel: React.FC = () => {
  const { formatState, setFormatState, activeEditor } = useDocumentStore();

  const setAlign = (align: 'left' | 'center' | 'right' | 'justify') => {
    setFormatState({ textAlign: align });
    activeEditor?.chain().focus().setTextAlign(align).run();
  };

  return (
    <div className="pb-4">
      <SectionLabel>Font</SectionLabel>
      <div className="px-3 flex flex-col gap-2">
        {/* Font family */}
        <div className="relative">
          <select
            value={formatState.fontFamily}
            onChange={(e) => setFormatState({ fontFamily: e.target.value })}
            className="w-full h-7 pl-2 pr-7 text-[11px] border border-neutral-300 rounded bg-white text-neutral-700 focus:outline-none focus:border-blue-400 appearance-none"
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>

        {/* Font size + line height */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-neutral-400 mb-1">Size</label>
            <input
              type="number"
              value={formatState.fontSize}
              onChange={(e) => setFormatState({ fontSize: Number(e.target.value) })}
              className="w-full h-7 px-2 text-[11px] border border-neutral-300 rounded bg-white text-neutral-700 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-[10px] text-neutral-400 mb-1">Line Height</label>
            <div className="relative">
              <select
                value={formatState.lineHeight}
                onChange={(e) => setFormatState({ lineHeight: Number(e.target.value) })}
                className="w-full h-7 pl-2 pr-6 text-[11px] border border-neutral-300 rounded bg-white text-neutral-700 focus:outline-none focus:border-blue-400 appearance-none"
              >
                {LINE_HEIGHTS.map((lh) => (
                  <option key={lh} value={lh}>{lh}</option>
                ))}
              </select>
              <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Letter spacing */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] text-neutral-400">Letter Spacing</label>
            <span className="text-[10px] text-neutral-500">{formatState.letterSpacing}px</span>
          </div>
          <input
            type="range"
            min={-3}
            max={10}
            step={0.5}
            value={formatState.letterSpacing}
            onChange={(e) => setFormatState({ letterSpacing: Number(e.target.value) })}
            className="w-full h-1.5 accent-blue-500"
          />
        </div>
      </div>

      <SectionLabel>Alignment</SectionLabel>
      <div className="px-3">
        <div className="flex gap-0.5 bg-neutral-100 rounded-lg p-0.5">
          {([
            { align: 'left' as const,    icon: AlignLeft },
            { align: 'center' as const,  icon: AlignCenter },
            { align: 'right' as const,   icon: AlignRight },
            { align: 'justify' as const, icon: AlignJustify },
          ] as const).map(({ align, icon: Icon }) => (
            <button
              key={align}
              onClick={() => setAlign(align)}
              className={cn(
                'flex-1 h-7 flex items-center justify-center rounded-md transition-all',
                formatState.textAlign === align
                  ? 'bg-white shadow text-blue-600'
                  : 'text-neutral-400 hover:text-neutral-600'
              )}
            >
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>

      <SectionLabel>Color</SectionLabel>
      <div className="px-3 grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-neutral-400 mb-1">Text</label>
          <div className="flex items-center gap-1.5 h-7 border border-neutral-300 rounded px-2 bg-white">
            <input
              type="color"
              value={formatState.textColor}
              onChange={(e) => {
                setFormatState({ textColor: e.target.value });
                activeEditor?.chain().focus().setColor(e.target.value).run();
              }}
              className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent p-0"
            />
            <span className="text-[10px] text-neutral-500 font-mono">{formatState.textColor}</span>
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-neutral-400 mb-1">Highlight</label>
          <div className="flex items-center gap-1.5 h-7 border border-neutral-300 rounded px-2 bg-white">
            <input
              type="color"
              value={formatState.highlight === 'none' ? '#ffff00' : formatState.highlight}
              onChange={(e) => {
                setFormatState({ highlight: e.target.value });
                activeEditor?.chain().focus().setHighlight({ color: e.target.value }).run();
              }}
              className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent p-0"
            />
            <span className="text-[10px] text-neutral-400">Pick</span>
          </div>
        </div>
      </div>

      <SectionLabel>Spacing</SectionLabel>
      <div className="px-3 grid grid-cols-2 gap-2">
        {[
          { label: 'Before', key: 'marginTop' as const },
          { label: 'After',  key: 'marginBottom' as const },
        ].map(({ label }) => (
          <div key={label}>
            <label className="block text-[10px] text-neutral-400 mb-1">{label}</label>
            <input
              type="number"
              defaultValue={0}
              className="w-full h-7 px-2 text-[11px] border border-neutral-300 rounded bg-white text-neutral-700 focus:outline-none focus:border-blue-400"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypographyPanel;
