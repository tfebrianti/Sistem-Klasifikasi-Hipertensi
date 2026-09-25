import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const isInteractive = !disabled && !isLoading;

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base: tactile realistic button with physical click feel
          'group relative inline-flex items-center justify-center font-semibold select-none outline-none cursor-pointer shrink-0',
          'transition-all duration-100 active:translate-y-[1px]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:translate-y-0',
          // Size Mappings
          {
            'h-9 px-3.5 text-xs gap-1.5 rounded-lg': size === 'sm',
            'h-10 px-4 text-sm gap-2 rounded-lg': size === 'md',
            'h-12 px-5 text-base gap-2 rounded-xl': size === 'lg',
          },
          // Variant styles — realistic skeuomorphic solid tactile colors
          {
            // Primary: solid tactile blue
            'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border border-blue-700 border-b-2 shadow-xs active:border-b active:shadow-none':
              variant === 'primary',
            // Secondary: tactile neutral
            'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-300 border-b-2 shadow-xs active:border-b active:shadow-none':
              variant === 'secondary',
            // Outline: crisp border with tactile depth
            'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-300 border-b-2 shadow-xs active:border-b active:shadow-none':
              variant === 'outline',
            // Danger: solid tactile red
            'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border border-red-700 border-b-2 shadow-xs active:border-b active:shadow-none':
              variant === 'danger',
            // Ghost: transparent with subtle hover
            'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent active:translate-y-0':
              variant === 'ghost',
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
