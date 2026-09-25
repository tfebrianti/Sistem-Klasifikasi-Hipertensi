export const HYPERTENSION_COLORS = {
  Normal: {
    bg: 'bg-slate-50 text-slate-800 border-slate-200',
    dot: 'bg-emerald-600',
    text: 'text-slate-800',
    primary: '#059669',
    primaryLight: 'rgba(5, 150, 105, 0.08)',
  },
  'Pra Hipertensi': {
    bg: 'bg-slate-50 text-slate-800 border-slate-200',
    dot: 'bg-amber-600',
    text: 'text-slate-800',
    primary: '#d97706',
    primaryLight: 'rgba(217, 119, 6, 0.08)',
  },
  'Tingkat 1': {
    bg: 'bg-slate-50 text-slate-800 border-slate-200',
    dot: 'bg-orange-600',
    text: 'text-slate-800',
    primary: '#ea580c',
    primaryLight: 'rgba(234, 88, 12, 0.08)',
  },
  'Tingkat 2': {
    bg: 'bg-slate-50 text-slate-800 border-slate-200',
    dot: 'bg-red-600',
    text: 'text-slate-800',
    primary: '#dc2626',
    primaryLight: 'rgba(220, 38, 38, 0.08)',
  },
} as const;

export type HypertensionLevel = keyof typeof HYPERTENSION_COLORS;
