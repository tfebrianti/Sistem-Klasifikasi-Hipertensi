import React, { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  icon?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options = [], icon, id, children, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-4 text-slate-400 pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full bg-white text-slate-800 border rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 appearance-none',
              'py-2.5 pr-10',
              icon ? 'pl-11' : 'pl-4',
              error
                ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-500 bg-rose-50/10'
                : 'border-slate-200 hover:border-slate-300 focus:ring-violet-100 focus:border-violet-500'
            )}
            {...props}
          >
            {children ||
              options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
          {/* Chevron Icon overlay for appearance-none drop down */}
          <div className="absolute right-4 pointer-events-none text-slate-400 flex items-center justify-center">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error ? (
          <p className="text-xs font-medium text-rose-500">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
