import React, { ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
  overflowVisible?: boolean;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
  overflowVisible = false,
}) => {
  const borderHoverMap = {
    blue: 'hover:border-blue-300',
    purple: 'hover:border-purple-300',
    green: 'hover:border-emerald-300',
    red: 'hover:border-rose-300',
    orange: 'hover:border-amber-300',
  };

  const sizeMap = {
    sm: 'w-48 h-64',
    md: 'w-64 h-80',
    lg: 'w-80 h-96',
  };

  // Determine sizing class
  const sizeClass = customSize ? '' : sizeMap[size];

  // Inline styles for width/height
  const inlineStyles: React.CSSProperties = {};
  if (width !== undefined) {
    inlineStyles.width = typeof width === 'number' ? `${width}px` : width;
  }
  if (height !== undefined) {
    inlineStyles.height = typeof height === 'number' ? `${height}px` : height;
  }

  return (
    <div
      style={inlineStyles}
      className={`group relative ${
        overflowVisible ? '' : 'overflow-hidden'
      } rounded-xl border border-slate-200 bg-white shadow-xs p-6 transition-all duration-150 ${
        borderHoverMap[glowColor]
      } hover:shadow-sm ${sizeClass} ${className}`}
    >
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export type { GlowCardProps };

