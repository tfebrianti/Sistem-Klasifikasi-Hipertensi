import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, X } from 'lucide-react';
import { useDialogStore } from '../../stores/dialogStore';

export default function GlobalDialogModal() {
  const { isOpen, options, confirm, cancel } = useDialogStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        cancel();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        confirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, confirm, cancel]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (options.variant) {
      case 'danger':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-rose-600" />,
          iconBg: 'bg-rose-100 text-rose-600 border border-rose-200',
          confirmBtn: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-rose-600/20',
        };
      case 'warning':
        return {
          icon: <AlertCircle className="w-6 h-6 text-amber-600" />,
          iconBg: 'bg-amber-100 text-amber-600 border border-amber-200',
          confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500 shadow-amber-600/20',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
          iconBg: 'bg-emerald-100 text-emerald-600 border border-emerald-200',
          confirmBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-emerald-600/20',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-6 h-6 text-blue-600" />,
          iconBg: 'bg-blue-100 text-blue-600 border border-blue-200',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-blue-600/20',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={options.isAlert ? confirm : cancel}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-10"
        >
          {/* Close button in top-right */}
          <button
            type="button"
            onClick={cancel}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6">
            <div className="flex items-start gap-4">
              {/* Icon badge */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBg}`}>
                {styles.icon}
              </div>

              {/* Title & Message */}
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {options.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                  {options.message}
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-slate-50/80 px-6 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2.5">
            {!options.isAlert && (
              <button
                type="button"
                onClick={cancel}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all cursor-pointer shadow-2xs"
              >
                {options.cancelText || 'Batal'}
              </button>
            )}
            <button
              type="button"
              onClick={confirm}
              autoFocus
              className={`px-4 py-2 text-xs font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all cursor-pointer shadow-sm ${styles.confirmBtn}`}
            >
              {options.confirmText || (options.isAlert ? 'Mengerti' : 'Konfirmasi')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
