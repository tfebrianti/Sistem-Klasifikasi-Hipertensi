import React, { HTMLAttributes } from 'react';
import { HYPERTENSION_COLORS, HypertensionLevel } from '../../constants/colors';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: HypertensionLevel | 'default' | 'neutral' | 'success' | 'warning' | 'danger';
  children?: React.ReactNode;
  className?: string;
}

export const Badge = ({ className, variant = 'default', children, ...props }: BadgeProps) => {
  // If it matches a clinical status level, use the mapped theme
  if (variant in HYPERTENSION_COLORS) {
    const theme = HYPERTENSION_COLORS[variant as HypertensionLevel];
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 select-none',
          className
        )}
        {...props}
      >
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', theme.dot)} />
        {children || variant}
      </span>
    );
  }

  // Fallbacks for standard generic types
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 select-none',
        className
      )}
      {...props}
    >
      {variant === 'success' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />}
      {variant === 'warning' && <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />}
      {variant === 'danger' && <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />}
      {children}
    </span>
  );
};
