import React, { memo, useId, forwardRef, ReactNode } from 'react';
import { motion, LazyMotion, domAnimation } from 'motion/react';
import { cn } from '../../utils/cn';

interface ActionProps {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icons?: ReactNode[];
  action?: ActionProps;
  variant?: 'default' | 'subtle' | 'error';
  size?: 'sm' | 'default' | 'lg';
  theme?: 'light' | 'dark' | 'neutral';
  isIconAnimated?: boolean;
  className?: string;
}

const ICON_VARIANTS = {
  left: {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    hover: { y: -2, transition: { duration: 0.15 } }
  },
  center: {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    hover: { y: -3, transition: { duration: 0.15 } }
  },
  right: {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    hover: { y: -2, transition: { duration: 0.15 } }
  }
};

const CONTENT_VARIANTS = {
  initial: { y: 10, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.25 } },
};

const BUTTON_VARIANTS = {
  initial: { y: 10, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.25 } },
};

interface IconContainerProps {
  children: ReactNode;
  variant: 'left' | 'center' | 'right';
  className?: string;
  theme?: 'light' | 'dark' | 'neutral';
}

const IconContainer = memo(({ children, variant, className = '', theme }: IconContainerProps) => (
  <motion.div
    variants={ICON_VARIANTS[variant]}
    className={cn(
      "w-11 h-11 rounded-lg flex items-center justify-center relative shadow-xs border border-b-2 transition-all duration-150",
      theme === 'dark' && "bg-neutral-800 border-neutral-700 text-neutral-200",
      theme === 'neutral' && "bg-slate-100 border-slate-300 text-slate-700",
      (!theme || theme === 'light') && "bg-slate-100 border-slate-300 text-slate-700",
      className
    )}
  >
    <div className="text-sm shrink-0">
      {children}
    </div>
  </motion.div>
));
IconContainer.displayName = "IconContainer";

interface MultiIconDisplayProps {
  icons?: ReactNode[];
  theme?: 'light' | 'dark' | 'neutral';
}

const MultiIconDisplay = memo(({ icons }: MultiIconDisplayProps) => {
  if (!icons || icons.length === 0) return null;

  return (
    <div className="flex justify-center items-center text-slate-800">
      {icons[0]}
    </div>
  );
});
MultiIconDisplay.displayName = "MultiIconDisplay";

const Background = (_props?: { theme?: 'light' | 'dark' | 'neutral' }) => null;

export const EmptyState = forwardRef<HTMLElement, EmptyStateProps>(({
  title,
  description,
  icons,
  action,
  variant = 'default',
  size = 'default',
  theme = 'light',
  isIconAnimated = true,
  className = '',
  ...props
}, ref) => {
  const titleId = useId();
  const descriptionId = useId();

  const baseClasses = "group transition-all duration-300 rounded-xl relative overflow-hidden text-center flex flex-col items-center justify-center";

  const sizeClasses = {
    sm: "p-6",
    default: "p-8",
    lg: "p-12"
  };

  const getVariantClasses = (v: 'default' | 'subtle' | 'error', t: 'light' | 'dark' | 'neutral') => {
    const variants = {
      default: {
        light: "bg-white border border-solid border-slate-200 hover:border-slate-200 hover:bg-white",
        dark: "bg-neutral-900 border-dashed border-2 border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50",
        neutral: "bg-stone-50 border-dashed border-2 border-stone-300 hover:border-stone-400 hover:bg-stone-100/50"
      },
      subtle: {
        light: "bg-white border border-transparent hover:bg-gray-50/30",
        dark: "bg-neutral-900 border border-transparent hover:bg-neutral-800/30",
        neutral: "bg-stone-50 border border-transparent hover:bg-stone-100/30"
      },
      error: {
        light: "bg-white border border-red-200 bg-red-50/50 hover:bg-red-50/80",
        dark: "bg-neutral-900 border border-red-800 bg-red-950/50 hover:bg-red-950/80",
        neutral: "bg-stone-50 border border-red-300 bg-red-50/50 hover:bg-red-50/80"
      }
    };
    return variants[v][t];
  };

  const getTextClasses = (type: 'title' | 'description', s: 'sm' | 'default' | 'lg', t: 'light' | 'dark' | 'neutral') => {
    const sizes = {
      title: {
        sm: "text-base",
        default: "text-lg",
        lg: "text-xl"
      },
      description: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base"
      }
    };

    const colors = {
      title: {
        light: "text-gray-900",
        dark: "text-neutral-100",
        neutral: "text-stone-900"
      },
      description: {
        light: "text-gray-600",
        dark: "text-neutral-400",
        neutral: "text-stone-600"
      }
    };

    return cn(sizes[type][s], colors[type][t], "font-semibold transition-colors duration-200");
  };

  const getButtonClasses = (s: 'sm' | 'default' | 'lg', t: 'light' | 'dark' | 'neutral') => {
    const sizeButtonClasses = {
      sm: "text-xs px-3 py-1.5",
      default: "text-sm px-4 py-2",
      lg: "text-base px-6 py-3"
    };

    const themeClasses = {
      light: "border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
      dark: "border-neutral-600 bg-neutral-800 hover:bg-neutral-700 text-neutral-200",
      neutral: "border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-700"
    };

    return cn(
      "inline-flex items-center gap-2 border rounded-md font-medium shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group/button disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
      sizeButtonClasses[s],
      themeClasses[t]
    );
  };

  return (
    <LazyMotion features={domAnimation}>
      <motion.section
        ref={ref}
        role="region"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={cn(
          baseClasses,
          sizeClasses[size === 'default' ? 'default' : size],
          getVariantClasses(variant, theme),
          className
        )}
        initial="initial"
        animate="animate"
        whileHover={isIconAnimated ? "hover" : "animate"}
        {...props}
      >
        <Background theme={theme} />
        <div className="relative z-10 flex flex-col items-center">
          {icons && (
            <div className="mb-6">
              <MultiIconDisplay icons={icons} theme={theme} />
            </div>
          )}

          <motion.div variants={CONTENT_VARIANTS} className="space-y-2 mb-6">
            <h2 id={titleId} className={getTextClasses('title', size === 'default' ? 'default' : size, theme)}>
              {title}
            </h2>
            {description && (
              <p
                id={descriptionId}
                className={cn(
                  getTextClasses('description', size === 'default' ? 'default' : size, theme).replace('font-semibold', ''),
                  "max-w-md leading-relaxed font-normal"
                )}
              >
                {description}
              </p>
            )}
          </motion.div>

          {action && (
            <motion.div variants={BUTTON_VARIANTS}>
              <motion.button
                type="button"
                onClick={action.onClick}
                disabled={action.disabled}
                className={getButtonClasses(size === 'default' ? 'default' : size, theme)}
                whileTap={{ scale: 0.98 }}
              >
                {action.icon && (
                  <div className="shrink-0">
                    {action.icon}
                  </div>
                )}
                <span className="relative z-10">{action.label}</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.section>
    </LazyMotion>
  );
});
EmptyState.displayName = "EmptyState";
