import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface AboutDialogProps {
  onClose: () => void;
}

const AboutDialog: React.FC<AboutDialogProps> = ({ onClose }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200/80 w-72 overflow-hidden select-none">
        {/* Title row */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <span className="text-[11px] text-neutral-400 font-medium tracking-wide uppercase">
            About
          </span>
          <button
            onClick={onClose}
            className="w-5 h-5 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X size={11} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 flex flex-col items-center text-center">
          {/* App icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center shadow-lg mb-3 mt-1">
            <span className="text-white text-2xl font-bold leading-none">F</span>
          </div>

          <h2 className="text-[15px] font-semibold text-neutral-900 mb-0.5">
            Folio Word Processor
          </h2>
          <p className="text-[11px] text-neutral-400 mb-4">Version 0.1.0</p>

          <div className="w-full h-px bg-neutral-100 mb-4" />

          <p className="text-[13px] text-neutral-600 mb-4">Made with ❤️ and coffee ☕</p>

          <div className="space-y-1.5 text-left w-full">
            <div className="flex justify-between text-[11px]">
              <span className="text-neutral-500">Author</span>
              <span className="text-neutral-800 font-medium">ehsan tork</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-neutral-500">License</span>
              <span className="text-neutral-800 font-medium">MIT License</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-neutral-500">Built with</span>
              <span className="text-neutral-800 font-medium">Rust · Tauri v2 · React</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-5 w-full h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[12px] font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutDialog;
