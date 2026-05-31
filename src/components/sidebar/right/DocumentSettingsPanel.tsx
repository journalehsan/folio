import React from 'react';
import { FileText, Columns, Maximize2, Settings, ChevronDown } from 'lucide-react';
import { useDocumentStore } from '../../../store/useDocumentStore';
import { cn } from '../../../utils/cn';

const SectionLabel: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <div className="flex items-center gap-1.5 px-3 pt-4 pb-2">
    <span className="text-neutral-400">{icon}</span>
    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">{children}</span>
  </div>
);

const FieldRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="px-3 mb-2">
    <label className="block text-[10px] text-neutral-400 mb-1">{label}</label>
    {children}
  </div>
);

const DocumentSettingsPanel: React.FC = () => {
  const { meta, updateMeta } = useDocumentStore();

  return (
    <div className="pb-6">
      <SectionLabel icon={<FileText size={12} />}>Page Setup</SectionLabel>

      <FieldRow label="Page Size">
        <div className="relative">
          <select
            value={meta.pageSize}
            onChange={(e) => updateMeta({ pageSize: e.target.value as any })}
            className="w-full h-7 pl-2 pr-7 text-[11px] border border-neutral-300 rounded bg-white text-neutral-700 focus:outline-none focus:border-blue-400 appearance-none"
          >
            {['A4', 'Letter', 'A3', 'Legal'].map((s) => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>
      </FieldRow>

      <FieldRow label="Orientation">
        <div className="flex gap-1">
          {(['Portrait', 'Landscape'] as const).map((o) => (
            <button
              key={o}
              onClick={() => updateMeta({ orientation: o })}
              className={cn(
                'flex-1 h-8 flex items-center justify-center gap-1.5 rounded border text-[10px] font-medium transition-all',
                meta.orientation === o
                  ? 'bg-blue-50 border-blue-400 text-blue-700'
                  : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'
              )}
            >
              <div className={cn(
                'border-2 border-current rounded-sm flex-shrink-0',
                o === 'Portrait' ? 'w-3 h-4' : 'w-4 h-3'
              )} />
              {o}
            </button>
          ))}
        </div>
      </FieldRow>

      <SectionLabel icon={<Maximize2 size={12} />}>Margins (mm)</SectionLabel>

      <div className="px-3 grid grid-cols-2 gap-2 mb-2">
        {[
          { label: 'Top',    key: 'marginTop'    as const },
          { label: 'Bottom', key: 'marginBottom' as const },
          { label: 'Left',   key: 'marginLeft'   as const },
          { label: 'Right',  key: 'marginRight'  as const },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="block text-[10px] text-neutral-400 mb-1">{label}</label>
            <input
              type="number"
              value={meta[key]}
              onChange={(e) => updateMeta({ [key]: Number(e.target.value) })}
              className="w-full h-7 px-2 text-[11px] border border-neutral-300 rounded bg-white text-neutral-700 focus:outline-none focus:border-blue-400"
            />
          </div>
        ))}
      </div>

      {/* Margin presets */}
      <div className="px-3">
        <div className="flex flex-wrap gap-1">
          {[
            { label: 'Normal',  t: 25, b: 25, l: 30, r: 25 },
            { label: 'Narrow',  t: 12, b: 12, l: 12, r: 12 },
            { label: 'Wide',    t: 25, b: 25, l: 50, r: 50 },
            { label: 'Mirror',  t: 25, b: 25, l: 30, r: 20 },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => updateMeta({
                marginTop: preset.t, marginBottom: preset.b,
                marginLeft: preset.l, marginRight: preset.r,
              })}
              className="px-2 py-1 text-[10px] border border-neutral-200 rounded hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors text-neutral-500"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <SectionLabel icon={<Columns size={12} />}>Layout</SectionLabel>

      <FieldRow label="Columns">
        <div className="flex gap-1">
          {([1, 2, 3] as const).map((n) => (
            <button
              key={n}
              onClick={() => updateMeta({ columnCount: n })}
              className={cn(
                'flex-1 h-8 rounded border text-[11px] font-medium transition-all',
                meta.columnCount === n
                  ? 'bg-blue-50 border-blue-400 text-blue-700'
                  : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'
              )}
            >
              {n === 1 ? '1 Col' : n === 2 ? '2 Col' : '3 Col'}
            </button>
          ))}
        </div>
      </FieldRow>

      <SectionLabel icon={<Settings size={12} />}>Options</SectionLabel>

      <div className="px-3 flex flex-col gap-2">
        {[
          { label: 'Header',         key: 'headerEnabled'  as const },
          { label: 'Footer',         key: 'footerEnabled'  as const },
          { label: 'Page Numbering', key: 'pageNumbering'  as const },
        ].map(({ label, key }) => (
          <label key={key} className="flex items-center justify-between cursor-pointer">
            <span className="text-[11px] text-neutral-600">{label}</span>
            <button
              onClick={() => updateMeta({ [key]: !meta[key] })}
              className={cn(
                'relative w-8 h-4 rounded-full transition-colors',
                meta[key] ? 'bg-blue-500' : 'bg-neutral-300'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform',
                  meta[key] ? 'translate-x-4' : 'translate-x-0.5'
                )}
              />
            </button>
          </label>
        ))}
      </div>

      <FieldRow label="Author">
        <input
          type="text"
          value={meta.author}
          onChange={(e) => updateMeta({ author: e.target.value })}
          className="w-full h-7 px-2 text-[11px] border border-neutral-300 rounded bg-white text-neutral-700 focus:outline-none focus:border-blue-400 mt-2"
        />
      </FieldRow>
    </div>
  );
};

export default DocumentSettingsPanel;
