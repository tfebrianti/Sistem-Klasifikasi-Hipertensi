import React, { useMemo } from 'react';
import { Users, Heart, Calendar } from 'lucide-react';
import { usePatientStore } from '../../../stores/patientStore';

export default function PatientSummaryCard() {
  const patients = usePatientStore((state) => state.patients);

  const stats = useMemo(() => {
    const total = patients.length;
    if (total === 0) {
      return {
        avgAge: 0,
        maleCount: 0,
        femaleCount: 0,
        malePercent: 0,
        femalePercent: 0,
        avgSys: 0,
        avgDia: 0,
      };
    }

    // Average Age
    const avgAge = Math.round(patients.reduce((sum, p) => sum + p.age, 0) / total);

    // Gender breakdown
    const maleCount = patients.filter((p) => p.gender === 'L').length;
    const femaleCount = patients.filter((p) => p.gender === 'P').length;
    const malePercent = Math.round((maleCount / total) * 100);
    const femalePercent = Math.round((femaleCount / total) * 100);

    // Average Blood Pressure (latest check in history per patient)
    const patientsWithBP = patients.filter((p) => p.bpHistory && p.bpHistory.length > 0);
    let avgSys = 0;
    let avgDia = 0;

    if (patientsWithBP.length > 0) {
      const totalSys = patientsWithBP.reduce((sum, p) => {
        const latest = p.bpHistory[p.bpHistory.length - 1];
        return sum + latest.systolic;
      }, 0);
      const totalDia = patientsWithBP.reduce((sum, p) => {
        const latest = p.bpHistory[p.bpHistory.length - 1];
        return sum + latest.diastolic;
      }, 0);
      avgSys = Math.round(totalSys / patientsWithBP.length);
      avgDia = Math.round(totalDia / patientsWithBP.length);
    }

    return { avgAge, maleCount, femaleCount, malePercent, femalePercent, avgSys, avgDia };
  }, [patients]);

  const hasData = patients.length > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 relative text-left h-full flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
      <div className="flex-shrink-0">
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-1">Ringkasan Klinis & Demografi</h4>
        <p className="text-xs text-slate-400 font-medium mb-6">Rangkuman data rata-rata pasien terdaftar di puskesmas</p>
      </div>

      {!hasData ? (
        <div className="h-48 flex items-center justify-center flex-grow">
          <p className="text-sm text-slate-400 font-medium">Belum ada data pasien.</p>
        </div>
      ) : (
        <div className="space-y-6 flex-grow flex flex-col justify-around select-none">
          {/* Row 1: Rata-rata Umur */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-800 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Rata-rata Umur</span>
                <span className="text-xs text-slate-400 font-semibold mt-0.5 block">Usia rata-rata pasien</span>
              </div>
            </div>
            <span className="text-2xl font-black text-slate-800">{stats.avgAge} <span className="text-xs font-bold text-slate-400">Tahun</span></span>
          </div>

          {/* Row 2: Rata-rata Tekanan Darah */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-slate-800 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Rata-rata Tekanan Darah</span>
                <span className="text-xs text-slate-400 font-semibold mt-0.5 block">SYS / DIA pemeriksaan terakhir</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-800">
                {stats.avgSys || '—'} <span className="text-slate-300">/</span> {stats.avgDia || '—'}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">mmHg</span>
            </div>
          </div>

          {/* Row 3: Rasio Gender */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Laki-laki ({stats.maleCount})</span>
              <span>Perempuan ({stats.femaleCount})</span>
            </div>
            
            {/* Horizontal dual progress bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
              <div 
                className="bg-slate-800 h-full transition-all duration-500"
                style={{ width: `${stats.malePercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] font-bold text-slate-400 tracking-wide select-none">
              <span>{stats.malePercent}% Laki-laki</span>
              <span>{stats.femalePercent}% Perempuan</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
