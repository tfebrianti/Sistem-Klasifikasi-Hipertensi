import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Info } from 'lucide-react';

interface BPEntry {
  date: string;
  systolic: number;
  diastolic: number;
}

interface PatientBPTrendChartProps {
  bpHistory?: BPEntry[];
  patientName: string;
}

export default function PatientBPTrendChart({ bpHistory = [], patientName }: PatientBPTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!bpHistory || bpHistory.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-400 text-xs font-semibold">
        Belum ada rekam jejak tekanan darah tersimpan untuk pasien ini.
      </div>
    );
  }

  // Dimension setup
  const chartWidth = 560;
  const chartHeight = 180;
  const paddingLeft = 45;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 30;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  const bpMin = 50;
  const bpMax = 190;

  const mapBPToY = (val: number) => {
    const clamped = Math.max(bpMin, Math.min(bpMax, val));
    return paddingTop + plotHeight - ((clamped - bpMin) / (bpMax - bpMin)) * plotHeight;
  };

  const getX = (idx: number, count: number) => {
    if (count <= 1) return paddingLeft + plotWidth / 2;
    return paddingLeft + (idx / (count - 1)) * plotWidth;
  };

  const sysPoints = bpHistory.map((item, idx) => ({
    x: getX(idx, bpHistory.length),
    y: mapBPToY(item.systolic),
    val: item.systolic,
  }));

  const diaPoints = bpHistory.map((item, idx) => ({
    x: getX(idx, bpHistory.length),
    y: mapBPToY(item.diastolic),
    val: item.diastolic,
  }));

  // Build curved SVG path
  const buildCurve = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x},${points[0].y} h 1`;
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpx = (curr.x + next.x) / 2;
      d += ` C ${cpx},${curr.y} ${cpx},${next.y} ${next.x},${next.y}`;
    }
    return d;
  };

  const buildArea = (points: { x: number; y: number }[]) => {
    const curve = buildCurve(points);
    if (!curve) return '';
    const bottomY = paddingTop + plotHeight;
    const last = points[points.length - 1];
    const first = points[0];
    return `${curve} L ${last.x},${bottomY} L ${first.x},${bottomY} Z`;
  };

  // Helper to categorize reading
  const getReadingCategory = (sys: number, dia: number) => {
    if (sys >= 160 || dia >= 100) return 'Tingkat 2';
    if (sys >= 140 || dia >= 90) return 'Tingkat 1';
    if (sys >= 120 || dia >= 80) return 'Pra Hipertensi';
    return 'Normal';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
      {/* Legend & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-800" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Grafik Riwayat Tekanan Darah Pasien
          </h4>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-600 select-none">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            Sistolik (SYS)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
            Diastolik (DIA)
          </span>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full h-[190px] overflow-visible select-none">
        <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="patSysGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="patDiaGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Y Axis Grid lines & values */}
          {[60, 90, 120, 140, 160].map((bpVal) => {
            const y = mapBPToY(bpVal);
            const isThreshold = bpVal === 120 || bpVal === 140;
            return (
              <g key={`grid-bp-${bpVal}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke={isThreshold ? '#cbd5e1' : '#f1f5f9'}
                  strokeWidth={isThreshold ? 1 : 0.75}
                  strokeDasharray={isThreshold ? '4 3' : '2 2'}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[9px] font-bold fill-slate-400"
                >
                  {bpVal}
                </text>
              </g>
            );
          })}

          {/* Area under curves */}
          <path d={buildArea(sysPoints)} fill="url(#patSysGlow)" className="pointer-events-none" />
          <path d={buildArea(diaPoints)} fill="url(#patDiaGlow)" className="pointer-events-none" />

          {/* Curved lines */}
          <path d={buildCurve(sysPoints)} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" className="pointer-events-none" />
          <path d={buildCurve(diaPoints)} fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="4 3" className="pointer-events-none" />

          {/* Vertical indicator guideline on hover */}
          {hoveredIndex !== null && sysPoints[hoveredIndex] && (
            <line
              x1={sysPoints[hoveredIndex].x}
              y1={paddingTop}
              x2={sysPoints[hoveredIndex].x}
              y2={paddingTop + plotHeight}
              stroke="#64748b"
              strokeWidth="1"
              strokeDasharray="3 3"
              className="pointer-events-none"
            />
          )}

          {/* Coordinate Circles for Systolic */}
          {sysPoints.map((pt, idx) => (
            <g key={`sys-dot-${idx}`} className="pointer-events-none">
              {hoveredIndex === idx && (
                <circle cx={pt.x} cy={pt.y} r="10" fill="#2563eb" fillOpacity="0.18" />
              )}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIndex === idx ? '6' : '4.5'}
                fill="#ffffff"
                stroke="#2563eb"
                strokeWidth={hoveredIndex === idx ? '3' : '2'}
              />
            </g>
          ))}

          {/* Coordinate Circles for Diastolic */}
          {diaPoints.map((pt, idx) => (
            <g key={`dia-dot-${idx}`} className="pointer-events-none">
              {hoveredIndex === idx && (
                <circle cx={pt.x} cy={pt.y} r="8" fill="#6366f1" fillOpacity="0.18" />
              )}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIndex === idx ? '5.5' : '4'}
                fill="#ffffff"
                stroke="#6366f1"
                strokeWidth={hoveredIndex === idx ? '2.5' : '2'}
              />
            </g>
          ))}

          {/* X Axis Month / Date Labels */}
          {bpHistory.map((item, idx) => (
            <text
              key={`lbl-${idx}`}
              x={getX(idx, bpHistory.length)}
              y={chartHeight - 6}
              textAnchor="middle"
              className="text-[10px] font-bold fill-slate-500 uppercase"
            >
              {item.date}
            </text>
          ))}

          {/* Hover hit areas */}
          {bpHistory.map((_, idx) => {
            const spacing = bpHistory.length > 1 ? plotWidth / (bpHistory.length - 1) : plotWidth;
            const x = getX(idx, bpHistory.length) - spacing / 2;
            return (
              <rect
                key={`hit-${idx}`}
                x={x}
                y={paddingTop}
                width={spacing}
                height={plotHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Floating Tooltip Box */}
        <AnimatePresence>
          {hoveredIndex !== null && bpHistory[hoveredIndex] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute p-3 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-semibold shadow-xl z-30 pointer-events-none min-w-[210px]"
              style={
                hoveredIndex >= Math.ceil(bpHistory.length / 2)
                  ? {
                      right: `${100 - (sysPoints[hoveredIndex].x / chartWidth) * 100}%`,
                      marginRight: '12px',
                      top: '15px',
                    }
                  : {
                      left: `${(sysPoints[hoveredIndex].x / chartWidth) * 100}%`,
                      marginLeft: '12px',
                      top: '15px',
                    }
              }
            >
              <div className="border-b border-slate-800 pb-1.5 flex items-center justify-between gap-4 text-slate-300">
                <span className="font-bold">{bpHistory[hoveredIndex].date} ({patientName})</span>
                <span className="text-xs font-bold text-slate-300">
                  {getReadingCategory(bpHistory[hoveredIndex].systolic, bpHistory[hoveredIndex].diastolic)}
                </span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center text-blue-400">
                  <span>Sistolik (SYS):</span>
                  <span className="text-white font-extrabold">{bpHistory[hoveredIndex].systolic} <span className="text-[10px] font-normal text-slate-400">mmHg</span></span>
                </div>
                <div className="flex justify-between items-center text-indigo-300">
                  <span>Diastolik (DIA):</span>
                  <span className="text-white font-extrabold">{bpHistory[hoveredIndex].diastolic} <span className="text-[10px] font-normal text-slate-400">mmHg</span></span>
                </div>
                <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800">
                  <span>Pulse Pressure:</span>
                  <span className="text-white font-bold">{bpHistory[hoveredIndex].systolic - bpHistory[hoveredIndex].diastolic} <span className="text-[10px] font-normal text-slate-400">mmHg</span></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Numerical Data Badges Grid */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {bpHistory.map((item, idx) => {
            const cat = getReadingCategory(item.systolic, item.diastolic);
            return (
              <div
                key={`pill-${idx}`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                  hoveredIndex === idx ? 'bg-slate-100 border-slate-300 shadow-xs' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-500 uppercase block">{item.date}</span>
                <div className="text-xs font-black text-slate-800 mt-0.5">
                  <span className="text-blue-700">{item.systolic}</span>
                  <span className="text-slate-400 mx-0.5">/</span>
                  <span className="text-indigo-600">{item.diastolic}</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">
                  {cat}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
