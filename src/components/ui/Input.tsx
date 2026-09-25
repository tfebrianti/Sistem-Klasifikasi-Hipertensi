import React, { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, icon, rightIcon, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 tracking-normal flex items-center justify-between">
            <span>{label}</span>
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-4 text-slate-400 pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={cn(
              // Base Input Classes
              'w-full bg-white text-slate-800 placeholder-slate-400 border rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2',
              'py-2.5',
              icon ? 'pl-11' : 'pl-4',
              rightIcon ? 'pr-11' : 'pr-4',
              // Focus, Hover, Error configurations
              error
                ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-500 bg-rose-50/10'
                : 'border-slate-200 hover:border-slate-300 focus:ring-blue-100 focus:border-blue-600',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 text-slate-400 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
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

Input.displayName = 'Input';
