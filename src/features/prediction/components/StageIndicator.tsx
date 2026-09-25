import React from 'react';
import { HypertensionLevel } from '../../../utils/hypertension';

interface StageIndicatorProps {
  result: HypertensionLevel;
}

export default function StageIndicator({ result }: StageIndicatorProps) {
  return (
    <div className="w-full">
      {/* Stages Bar represent index mapping */}
      <div className="grid grid-cols-4 gap-1.5 mt-auto max-w-[280px] mx-auto w-full pt-4">
        <div className={`h-2 rounded-full transition-colors duration-150 ${result === 'Normal' ? 'bg-emerald-500' : 'bg-slate-200'}`} />
        <div className={`h-2 rounded-full transition-colors duration-150 ${result === 'Pra Hipertensi' ? 'bg-amber-500' : 'bg-slate-200'}`} />
        <div className={`h-2 rounded-full transition-colors duration-150 ${result === 'Tingkat 1' ? 'bg-orange-500' : 'bg-slate-200'}`} />
        <div className={`h-2 rounded-full transition-colors duration-150 ${result === 'Tingkat 2' ? 'bg-red-600' : 'bg-slate-200'}`} />
      </div>
      
      <div className="grid grid-cols-4 gap-1.5 max-w-[280px] mx-auto w-full mt-1.5 text-[9px] font-bold uppercase select-none">
        <span className={result === 'Normal' ? 'text-emerald-700 font-extrabold' : 'text-slate-400 font-semibold'}>Normal</span>
        <span className={result === 'Pra Hipertensi' ? 'text-amber-700 font-extrabold' : 'text-slate-400 font-semibold'}>Pra</span>
        <span className={result === 'Tingkat 1' ? 'text-orange-700 font-extrabold' : 'text-slate-400 font-semibold'}>Tingkat 1</span>
        <span className={result === 'Tingkat 2' ? 'text-red-700 font-extrabold' : 'text-slate-400 font-semibold'}>Tingkat 2</span>
      </div>
    </div>
  );
}
