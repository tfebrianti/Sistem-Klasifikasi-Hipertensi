import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Info } from 'lucide-react';
import { usePatientStore } from '../../../stores/patientStore';

export default function AgeDistributionChart() {
  const patients = usePatientStore((state) => state.patients);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const ageData = useMemo(() => {
    const total = patients.length;
    const groups = [
      { label: '< 35', category: 'Dewasa Muda', min: 0, max: 34, color: '#334155' },
      { label: '35 - 44', category: 'Dewasa', min: 35, max: 44, color: '#2563eb' },
      { label: '45 - 54', category: 'Pra-Lansia', min: 45, max: 54, color: '#1d4ed8' },
      { label: '55 - 64', category: 'Lansia', min: 55, max: 64, color: '#4338ca' },
      { label: '≥ 65', category: 'Manula', min: 65, max: 150, color: '#312e81' },
    ];

    if (total === 0) {
      return groups.map((g) => ({ ...g, count: 0, percentage: 0, hypertensiveCount: 0 }));
    }

    return groups.map((g) => {
      const inGroup = patients.filter((p) => p.age >= g.min && p.age <= g.max);
      const count = inGroup.length;
      const percentage = Math.round((count / total) * 100);
      const hypertensiveCount = inGroup.filter((p) => p.status === 'Tingkat 1' || p.status === 'Tingkat 2').length;
      return { ...g, count, percentage, hypertensiveCount };
    });
  }, [patients]);

  const maxCount = useMemo(() => {
    return Math.max(...ageData.map((d) => d.count), 1);
  }, [ageData]);

  const barMaxHeight = 135;
  const hasData = patients.length > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 relative text-left h-full flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
      <div className="flex-shrink-0 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-800" />
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Distribusi Kelompok Usia</h4>
        </div>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">Sebaran rekam medis pasien berdasarkan rentang umur</p>
      </div>

      {!hasData ? (
        <div className="h-48 flex items-center justify-center flex-grow">
          <p className="text-xs text-slate-400 font-semibold">Belum ada data pasien tersimpan.</p>
        </div>
      ) : (
        <div className="relative h-52 w-full flex items-end justify-between px-2 sm:px-6 select-none flex-grow pb-2 pt-6">
          {/* Horizontal Grid lines */}
          <div className="absolute inset-x-0 top-6 bottom-[30px] flex flex-col justify-between pointer-events-none opacity-40 z-0">
            <div className="border-b border-slate-200 w-full h-0" />
            <div className="border-b border-slate-200 w-full h-0" />
            <div className="border-b border-slate-200 w-full h-0" />
            <div className="border-b border-slate-200 w-full h-0" />
          </div>

          {/* Bar Chart items */}
          {ageData.map((item, idx) => {
            const barHeight = (item.count / maxCount) * barMaxHeight;
            const isHovered = hoveredBarIndex === idx;

            return (
              <div 
                key={item.label}
                className="flex flex-col items-center flex-1 relative z-10 cursor-pointer"
                onMouseEnter={() => setHoveredBarIndex(idx)}
                onMouseLeave={() => setHoveredBarIndex(null)}
              >
                {/* Visual Bar */}
                <div 
                  className="w-9 sm:w-12 rounded-t-lg relative transition-all duration-200"
                  style={{ height: `${Math.max(barHeight, 8)}px` }}
                >
                  <div 
                    className={`absolute inset-0 rounded-t-lg transition-all duration-200 ${
                      isHovered ? 'ring-2 ring-slate-400/40 brightness-110 shadow-sm' : ''
                    }`}
                    style={{ backgroundColor: item.color }}
                  />
                  {item.count > 0 && (
                    <span className="absolute -top-5 inset-x-0 text-center text-[10px] font-extrabold text-slate-700">
                      {item.count}
                    </span>
                  )}
                </div>

                {/* X Axis Label */}
                <span className="text-[10px] font-bold text-slate-500 mt-2.5 uppercase tracking-wide">
                  {item.label}
                </span>
                <span className="text-[9px] font-semibold text-slate-400 hidden sm:block">
                  {item.category}
                </span>
              </div>
            );
          })}

          {/* Floating informative tooltip */}
          <AnimatePresence>
            {hoveredBarIndex !== null && ageData[hoveredBarIndex] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute p-3 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-semibold shadow-xl z-20 pointer-events-none min-w-[210px]"
                style={{
                  left: `${((hoveredBarIndex + 0.5) / ageData.length) * 100}%`,
                  transform: 'translateX(-50%)',
                  top: '-10px',
                }}
              >
                <div className="border-b border-slate-800 pb-1.5 flex items-center justify-between text-slate-300">
                  <span className="font-bold">Usia {ageData[hoveredBarIndex].label} Thn</span>
                  <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-bold uppercase">
                    {ageData[hoveredBarIndex].category}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Jumlah Pasien:</span>
                    <span className="text-white font-extrabold">{ageData[hoveredBarIndex].count} Pasien</span>
                  </div>
                  <div className="flex justify-between items-center text-blue-400">
                    <span>Persentase Total:</span>
                    <span className="text-white font-extrabold">{ageData[hoveredBarIndex].percentage}%</span>
                  </div>
                  <div className="flex justify-between items-center text-rose-400 pt-1 border-t border-slate-800">
                    <span>Kasus Hipertensi:</span>
                    <span className="text-white font-bold">{ageData[hoveredBarIndex].hypertensiveCount} Pasien</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
