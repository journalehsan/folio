import React from 'react';
import { cn } from '../../utils/cn';

interface ToolbarButtonProps {
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'ghost' | 'accent';
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
  className,
  variant = 'default',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'relative inline-flex items-center justify-center h-7 min-w-7 px-1.5 rounded',
        'text-[11px] font-medium transition-all duration-100 select-none',
        'focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500',
        variant === 'default' && [
          'text-neutral-700 hover:bg-neutral-200/80 hover:text-neutral-900',
          active && 'bg-blue-100 text-blue-700 hover:bg-blue-200',
          disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-neutral-700',
        ],
        variant === 'ghost' && [
          'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700',
          active && 'text-blue-600 bg-blue-50',
        ],
        variant === 'accent' && [
          'bg-blue-500 text-white hover:bg-blue-600',
          active && 'bg-blue-700',
        ],
        className
      )}
    >
      {children}
    </button>
  );
};

export default ToolbarButton;
