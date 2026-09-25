import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Info } from 'lucide-react';
import { usePatientStore } from '../../../stores/patientStore';

const DONUT_RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS; // ≈ 226.19

const STATUS_CONFIG = [
  { label: 'Normal', color: '#10b981', svgColor: '#10b981', criteria: 'Sistolik < 120 & Diastolik < 80' },
  { label: 'Pra Hipertensi', color: '#f59e0b', svgColor: '#f59e0b', criteria: 'Sistolik 120–139 / Diastolik 80–89' },
  { label: 'Tingkat 1', color: '#ea580c', svgColor: '#ea580c', criteria: 'Sistolik 140–159 / Diastolik 90–99' },
  { label: 'Tingkat 2', color: '#dc2626', svgColor: '#dc2626', criteria: 'Sistolik ≥ 160 / Diastolik ≥ 100' },
] as const;

export default function DiagnosisDonut() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const patients = usePatientStore((state) => state.patients);

  const doughnutData = useMemo(() => {
    const total = patients.length;
    if (total === 0) {
      return STATUS_CONFIG.map((cfg) => ({ ...cfg, value: 0, count: 0 }));
    }

    return STATUS_CONFIG.map((cfg) => {
      const count = patients.filter((p) => p.status === cfg.label).length;
      const value = Math.round((count / total) * 1000) / 10;
      return { ...cfg, value, count };
    });
  }, [patients]);

  const segments = useMemo(() => {
    let cumulativeOffset = 0;
    return doughnutData.map((item) => {
      const dash = (item.value / 100) * CIRCUMFERENCE;
      const offset = -cumulativeOffset;
      cumulativeOffset += dash;
      return { dash, offset };
    });
  }, [doughnutData]);

  const hasData = patients.length > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 relative text-left shadow-xs hover:border-slate-300 transition-colors">
      <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-slate-800" />
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Distribusi Diagnosis Pasien</h4>
          </div>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Proporsi profil klasifikasi menurut standar JNC 7</p>
        </div>
        <span className="text-xs font-semibold text-slate-400 select-none">
          Standar JNC 7
        </span>
      </div>

      {!hasData ? (
        <div className="flex items-center justify-center h-60">
          <p className="text-xs text-slate-400 font-semibold">Belum ada data pasien tersimpan.</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 h-auto sm:h-60">
          {/* Custom SVG Donut Chart */}
          <div className="relative w-44 h-44 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90 scale-x-[-1]" viewBox="0 0 100 100">
              {/* Background circular track */}
              <circle
                cx="50"
                cy="50"
                r={DONUT_RADIUS}
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth="10"
              />
              {doughnutData.map((item, idx) => {
                if (item.value === 0) return null;
                const isHovered = hoveredIndex === idx;
                return (
                  <circle
                    key={item.label}
                    cx="50"
                    cy="50"
                    r={DONUT_RADIUS}
                    fill="transparent"
                    stroke={item.svgColor}
                    strokeWidth={isHovered ? '13' : '10'}
                    strokeDasharray={`${segments[idx].dash} ${CIRCUMFERENCE}`}
                    strokeDashoffset={segments[idx].offset}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}
            </svg>
            
            {/* Center Dynamic Label */}
            <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none select-none">
              <AnimatePresence mode="wait">
                {hoveredIndex === null ? (
                  <motion.div
                    key="total"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center"
                  >
                    <span className="text-2xl font-black text-slate-900 tracking-tight block leading-none">
                      {patients.length}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                      Total Pasien
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`hover-${hoveredIndex}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center px-1"
                  >
                    <span 
                      className="text-2xl font-black tracking-tight block leading-none"
                      style={{ color: doughnutData[hoveredIndex].svgColor }}
                    >
                      {doughnutData[hoveredIndex].value}%
                    </span>
                    <span className="text-[9px] font-extrabold text-slate-700 block mt-1 uppercase leading-tight">
                      {doughnutData[hoveredIndex].label}
                    </span>
                    <span className="text-[8px] font-semibold text-slate-400 block mt-0.5">
                      {doughnutData[hoveredIndex].count} Pasien
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Interactive Legend Items */}
          <div className="flex-1 space-y-2 select-none w-full text-left">
            {doughnutData.map((item, idx) => {
              const isHovered = hoveredIndex === idx;
              return (
                <div 
                  key={item.label}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isHovered 
                      ? 'bg-slate-50 border-slate-300 shadow-xs' 
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ backgroundColor: item.svgColor }} 
                      />
                      <span className="text-xs font-bold text-slate-800">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500">{item.count} org</span>
                      <span className="text-xs font-black text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {item.value}%
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium pl-4.5 mt-0.5">
                    {item.criteria} mmHg
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
