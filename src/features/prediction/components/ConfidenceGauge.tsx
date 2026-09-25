import React from 'react';
import { motion } from 'motion/react';
import { HypertensionLevel } from '../../../utils/hypertension';

interface ConfidenceGaugeProps {
  confidence: number;
  result: HypertensionLevel;
}

export default function ConfidenceGauge({ confidence, result }: ConfidenceGaugeProps) {
  // Determine stroke color based on hypertension result
  const getStrokeColor = () => {
    switch (result) {
      case 'Normal':
        return '#10b981'; // emerald-500
      case 'Pra Hipertensi':
        return '#f59e0b'; // amber-500
      case 'Tingkat 1':
        return '#f97316'; // orange-500
      case 'Tingkat 2':
        return '#dc2626'; // red-600
      default:
        return '#3b82f6'; // blue-500
    }
  };

  // Circumference of a circle with r=40 is 2 * pi * 40 ≈ 251.2
  const strokeColor = getStrokeColor();

  return (
    <div className="relative w-40 h-40 mx-auto mt-6 mb-2 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background track */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#f1f5f9"
          strokeWidth="8"
        />
        {/* Dynamic colored progress indicator */}
        <motion.circle
          initial={{ strokeDashoffset: 251.2 }}
          animate={{ strokeDashoffset: 251.2 - (251.2 * confidence) / 100 }}
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="251.2"
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      {/* Central absolute overlay text */}
      <div className="absolute inset-0 flex flex-col justify-center items-center select-none pointer-events-none">
        <span className="text-3xl font-extrabold text-slate-800 leading-none">{confidence}%</span>
        <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Confidence</span>
      </div>
    </div>
  );
}
