import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useDocumentStore } from '../../store/useDocumentStore';

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72, 96];

const FontSizeControl: React.FC = () => {
  const { formatState, setFormatState } = useDocumentStore();
  const size = formatState.fontSize;

  const increase = () => {
    const next = FONT_SIZES.find((s) => s > size);
    if (next) setFormatState({ fontSize: next });
  };

  const decrease = () => {
    const prev = [...FONT_SIZES].reverse().find((s) => s < size);
    if (prev) setFormatState({ fontSize: prev });
  };

  return (
    <div className="flex items-center h-7 border border-neutral-300 rounded overflow-hidden text-[11px]">
      <button
        onClick={decrease}
        className="px-1 h-full hover:bg-neutral-100 text-neutral-500 flex items-center border-r border-neutral-200"
      >
        <ChevronDown size={11} />
      </button>
      <input
        type="number"
        value={size}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if (val >= 6 && val <= 400) setFormatState({ fontSize: val });
        }}
        className="w-9 text-center bg-transparent text-neutral-700 focus:outline-none font-medium"
      />
      <button
        onClick={increase}
        className="px-1 h-full hover:bg-neutral-100 text-neutral-500 flex items-center border-l border-neutral-200"
      >
        <ChevronUp size={11} />
      </button>
    </div>
  );
};

export default FontSizeControl;
