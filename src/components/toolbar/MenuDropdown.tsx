import { forwardRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export interface MenuItemDef {
  type: 'item' | 'separator';
  label?: string;
  shortcut?: string;
  action?: () => void;
  disabled?: boolean;
}

interface MenuDropdownProps {
  items: MenuItemDef[];
  anchorRect: DOMRect;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const MenuDropdown = forwardRef<HTMLDivElement, MenuDropdownProps>(
  ({ items, anchorRect, onClose, onMouseEnter, onMouseLeave }, ref) => {
    // Escape key closes the dropdown
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
      <div
        ref={ref}
        style={{
          position: 'fixed',
          left: anchorRect.left,
          top: anchorRect.bottom + 2,
          minWidth: 210,
          zIndex: 9999,
        }}
        className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-neutral-200/80 py-1.5 overflow-hidden"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {items.map((item, i) => {
          if (item.type === 'separator') {
            return <div key={i} className="my-1 h-px bg-neutral-100 mx-2" />;
          }

          return (
            <button
              key={i}
              disabled={item.disabled}
              onClick={() => {
                item.action?.();
                onClose();
              }}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-left transition-colors',
                item.disabled
                  ? 'text-neutral-300 cursor-default'
                  : 'text-neutral-700 hover:bg-blue-50 hover:text-blue-700 cursor-default'
              )}
            >
              <span className="flex-1">{item.label}</span>
              {item.shortcut && (
                <span
                  className={cn(
                    'text-[10px] font-mono ml-6 flex-shrink-0',
                    item.disabled ? 'text-neutral-300' : 'text-neutral-400'
                  )}
                >
                  {item.shortcut}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }
);

MenuDropdown.displayName = 'MenuDropdown';

export default MenuDropdown;
