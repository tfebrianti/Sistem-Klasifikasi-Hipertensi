import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, User, ChevronDown } from 'lucide-react';
import { usePatientStore } from '../../../stores/patientStore';

export default function BPTrendChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const patients = usePatientStore((state) => state.patients);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  // Find all patients with BP history
  const patientsWithHistory = useMemo(() => {
    return patients.filter((p) => p.bpHistory && p.bpHistory.length > 0);
  }, [patients]);

  // Active patient for trend visualization
  const activePatient = useMemo(() => {
    if (patientsWithHistory.length === 0) return null;
    if (selectedPatientId) {
      const found = patientsWithHistory.find((p) => p.id === selectedPatientId);
      if (found) return found;
    }
    return patientsWithHistory[0];
  }, [patientsWithHistory, selectedPatientId]);

  const chartData = useMemo(() => {
    if (!activePatient || !activePatient.bpHistory || activePatient.bpHistory.length === 0) {
      return null;
    }
    const entries = activePatient.bpHistory.slice(0, 7);
    const months = entries.map((e) => e.date);
    const systolicValues = entries.map((e) => e.systolic);
    const diastolicValues = entries.map((e) => e.diastolic);
    return { months, systolicValues, diastolicValues, patientName: activePatient.name };
  }, [activePatient]);

  // SVG coordinate mapping
  const chartWidth = 700;
  const paddingLeft = 48;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 35;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = 220 - paddingTop - paddingBottom;

  const bpMin = 50;
  const bpMax = 190;

  const mapBPtoY = (bp: number) => {
    const clamped = Math.max(bpMin, Math.min(bpMax, bp));
    return paddingTop + plotHeight - ((clamped - bpMin) / (bpMax - bpMin)) * plotHeight;
  };

  const getPoints = (values: number[], count: number) => {
    if (count <= 1) return [{ x: paddingLeft + plotWidth / 2, y: mapBPtoY(values[0] || 120), val: values[0] || 120 }];
    const spacing = plotWidth / (count - 1);
    return values.map((val, idx) => ({
      x: paddingLeft + idx * spacing,
      y: mapBPtoY(val),
      val,
    }));
  };

  const buildCurvePath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpx = (curr.x + next.x) / 2;
      d += ` C ${cpx},${curr.y} ${cpx},${next.y} ${next.x},${next.y}`;
    }
    return d;
  };

  const buildAreaPath = (points: { x: number; y: number }[]) => {
    const curvePath = buildCurvePath(points);
    if (!curvePath) return '';
    const bottomY = paddingTop + plotHeight;
    const lastPt = points[points.length - 1];
    const firstPt = points[0];
    return `${curvePath} L ${lastPt.x},${bottomY} L ${firstPt.x},${bottomY} Z`;
  };

  const getCategory = (sys: number, dia: number) => {
    if (sys >= 160 || dia >= 100) return 'Hipertensi Tk. 2';
    if (sys >= 140 || dia >= 90) return 'Hipertensi Tk. 1';
    if (sys >= 120 || dia >= 80) return 'Pra Hipertensi';
    return 'Normal';
  };

  if (!chartData) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-left shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-slate-800" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tren Tekanan Darah Pasien</h4>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-xs text-slate-400 font-semibold">Belum ada riwayat tekanan darah pasien tersimpan.</p>
        </div>
      </div>
    );
  }

  const { months, systolicValues, diastolicValues, patientName } = chartData;
  const sysPoints = getPoints(systolicValues, systolicValues.length);
  const diaPoints = getPoints(diastolicValues, diastolicValues.length);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 relative text-left shadow-xs hover:border-slate-300 transition-colors">
      {/* Header with Title and Patient Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-800" />
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Tren Tekanan Darah Klinis</h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-semibold">
            Profil fluktuasi sistolik vs diastolik pasien rekam medis
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Patient Selector */}
          {patientsWithHistory.length > 1 && (
            <div className="relative">
              <select
                value={activePatient?.id || ''}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {patientsWithHistory.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
              Sistolik (SYS)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
              Diastolik (DIA)
            </span>
          </div>
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="h-64 w-full relative">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 700 220" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sysFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="diaFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y scale labels */}
          {[60, 90, 120, 140, 160].map((bpVal) => {
            const y = mapBPtoY(bpVal);
            const isThreshold = bpVal === 120 || bpVal === 140;
            return (
              <g key={`grid-y-${bpVal}`}>
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
                  className="text-[10px] font-bold fill-slate-400"
                >
                  {bpVal}
                </text>
              </g>
            );
          })}

          {/* Area fills */}
          <path d={buildAreaPath(sysPoints)} fill="url(#sysFade)" className="pointer-events-none" />
          <path d={buildAreaPath(diaPoints)} fill="url(#diaFade)" className="pointer-events-none" />

          {/* Spline lines */}
          <path d={buildCurvePath(sysPoints)} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" className="pointer-events-none" />
          <path d={buildCurvePath(diaPoints)} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 3" className="pointer-events-none" />

          {/* Guideline on hover */}
          {hoveredIndex !== null && sysPoints[hoveredIndex] && (
            <line
              x1={sysPoints[hoveredIndex].x}
              y1={paddingTop}
              x2={sysPoints[hoveredIndex].x}
              y2={paddingTop + plotHeight}
              stroke="#64748b"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              className="pointer-events-none"
            />
          )}

          {/* Points for Systolic */}
          {sysPoints.map((pt, idx) => (
            <g key={`sys-dot-${idx}`} className="pointer-events-none">
              {hoveredIndex === idx && (
                <circle cx={pt.x} cy={pt.y} r="11" fill="#2563eb" fillOpacity="0.16" />
              )}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIndex === idx ? '6.5' : '4.5'}
                fill="#ffffff"
                stroke="#2563eb"
                strokeWidth={hoveredIndex === idx ? '3' : '2'}
              />
            </g>
          ))}

          {/* Points for Diastolic */}
          {diaPoints.map((pt, idx) => (
            <g key={`dia-dot-${idx}`} className="pointer-events-none">
              {hoveredIndex === idx && (
                <circle cx={pt.x} cy={pt.y} r="9" fill="#6366f1" fillOpacity="0.16" />
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

          {/* X Axis Month Labels */}
          {months.map((m, idx) => (
            <text
              key={`x-lbl-${idx}`}
              x={sysPoints[idx]?.x ?? 0}
              y={paddingTop + plotHeight + 18}
              textAnchor="middle"
              className="text-[10px] font-bold fill-slate-500 uppercase select-none"
            >
              {m}
            </text>
          ))}

          {/* Interactive Hover columns */}
          {sysPoints.map((pt, idx) => {
            const spacing = sysPoints.length > 1 ? plotWidth / (sysPoints.length - 1) : plotWidth;
            return (
              <rect
                key={`trigger-${idx}`}
                x={pt.x - spacing / 2}
                y={paddingTop}
                width={spacing}
                height={plotHeight}
                fill="transparent"
                className="cursor-crosshair select-none"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Informative Dynamic Tooltip Box */}
        <AnimatePresence>
          {hoveredIndex !== null && sysPoints[hoveredIndex] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute p-3 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-semibold shadow-xl z-20 pointer-events-none min-w-[200px]"
              style={
                hoveredIndex >= Math.ceil(months.length / 2)
                  ? {
                      right: `${100 - (sysPoints[hoveredIndex].x / 700) * 100}%`,
                      marginRight: '14px',
                      top: '20px',
                    }
                  : {
                      left: `${(sysPoints[hoveredIndex].x / 700) * 100}%`,
                      marginLeft: '14px',
                      top: '20px',
                    }
              }
            >
              <div className="border-b border-slate-800 pb-1.5 flex items-center justify-between text-slate-300">
                <span className="font-bold">{months[hoveredIndex]} ({patientName})</span>
                <span className="text-xs font-bold text-slate-300">
                  {getCategory(systolicValues[hoveredIndex], diastolicValues[hoveredIndex])}
                </span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center text-blue-400">
                  <span>Sistolik (SYS):</span>
                  <span className="text-white font-extrabold">{systolicValues[hoveredIndex]} <span className="text-[10px] font-normal text-slate-400">mmHg</span></span>
                </div>
                <div className="flex justify-between items-center text-indigo-300">
                  <span>Diastolik (DIA):</span>
                  <span className="text-white font-extrabold">{diastolicValues[hoveredIndex]} <span className="text-[10px] font-normal text-slate-400">mmHg</span></span>
                </div>
                <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800">
                  <span>Pulse Pressure:</span>
                  <span className="text-white font-bold">{systolicValues[hoveredIndex] - diastolicValues[hoveredIndex]} <span className="text-[10px] font-normal text-slate-400">mmHg</span></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
