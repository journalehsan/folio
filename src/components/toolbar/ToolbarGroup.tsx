import React from 'react';
import { cn } from '../../utils/cn';

interface ToolbarGroupProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

const ToolbarGroup: React.FC<ToolbarGroupProps> = ({ label, children, className }) => {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="flex items-center gap-0.5 px-1">{children}</div>
      <span className="text-[9px] text-neutral-400 mt-0.5 font-medium tracking-wide uppercase leading-none">
        {label}
      </span>
    </div>
  );
};

export default ToolbarGroup;
