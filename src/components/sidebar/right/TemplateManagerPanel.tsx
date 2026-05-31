import React, { useState } from 'react';
import { FileText, Check, ChevronRight, Grid, LayoutTemplate } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}

const TEMPLATES: Template[] = [
  { id: 'blank',        name: 'Blank',          category: 'Basic',       description: 'Clean empty document',           color: 'bg-neutral-100', icon: <FileText size={16} /> },
  { id: 'report',       name: 'Report',         category: 'Business',    description: 'Formal business report',         color: 'bg-blue-100',    icon: <FileText size={16} /> },
  { id: 'essay',        name: 'Essay',          category: 'Academic',    description: 'Academic essay with citations',  color: 'bg-purple-100',  icon: <FileText size={16} /> },
  { id: 'letter',       name: 'Letter',         category: 'Business',    description: 'Professional business letter',   color: 'bg-green-100',   icon: <FileText size={16} /> },
  { id: 'resume',       name: 'Resume / CV',    category: 'Personal',    description: 'Modern resume template',         color: 'bg-orange-100',  icon: <FileText size={16} /> },
  { id: 'newsletter',   name: 'Newsletter',     category: 'Marketing',   description: 'Two-column newsletter layout',   color: 'bg-pink-100',    icon: <Grid size={16} /> },
  { id: 'minutes',      name: 'Meeting Notes',  category: 'Business',    description: 'Structured meeting minutes',     color: 'bg-teal-100',    icon: <FileText size={16} /> },
  { id: 'manuscript',   name: 'Manuscript',     category: 'Creative',    description: 'Book / novel manuscript format', color: 'bg-amber-100',   icon: <LayoutTemplate size={16} /> },
];

const CATEGORIES = ['All', 'Basic', 'Business', 'Academic', 'Personal', 'Marketing', 'Creative'];

const TemplateManagerPanel: React.FC = () => {
  const [selected, setSelected] = useState('blank');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div className="pb-4">
      {/* Category filter */}
      <div className="px-2 pt-3 pb-2">
        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-1">
          Templates
        </span>
        <div className="flex flex-wrap gap-1 mt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors',
                activeCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template grid */}
      <div className="px-2 grid grid-cols-2 gap-2">
        {filtered.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => setSelected(tmpl.id)}
            className={cn(
              'relative flex flex-col items-center rounded-xl border-2 p-2 transition-all text-center',
              selected === tmpl.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
            )}
          >
            {selected === tmpl.id && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <Check size={9} className="text-white" />
              </div>
            )}
            {/* Template preview */}
            <div
              className={cn(
                'w-full rounded-lg flex items-center justify-center mb-2',
                tmpl.color
              )}
              style={{ paddingTop: '70%', position: 'relative' }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
                {tmpl.icon}
              </div>
              {/* Simulated lines */}
              <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-0.5">
                <div className="h-0.5 bg-neutral-300/60 rounded w-3/4" />
                <div className="h-0.5 bg-neutral-300/60 rounded w-full" />
                <div className="h-0.5 bg-neutral-300/60 rounded w-5/6" />
              </div>
            </div>
            <span className="text-[10px] font-semibold text-neutral-700 leading-tight">{tmpl.name}</span>
            <span className="text-[9px] text-neutral-400 mt-0.5">{tmpl.category}</span>
          </button>
        ))}
      </div>

      {/* Apply button */}
      <div className="px-3 mt-4">
        <button className="w-full flex items-center justify-center gap-2 h-8 bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-semibold rounded-lg transition-colors shadow-sm">
          Apply Template
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

export default TemplateManagerPanel;
