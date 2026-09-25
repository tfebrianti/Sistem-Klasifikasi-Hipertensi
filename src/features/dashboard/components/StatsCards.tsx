import React, { useMemo } from 'react';
import { Activity, BrainCircuit, Cpu, AlertTriangle, Users, Calendar } from 'lucide-react';
import { usePredictionStore } from '../../../stores/predictionStore';
import { usePatientStore } from '../../../stores/patientStore';
import { useSettingsStore } from '../../../stores/settingsStore';

export default function StatsCards() {
  const records = usePredictionStore((state) => state.records);
  const patients = usePatientStore((state) => state.patients);
  const modelConfig = useSettingsStore((state) => state.modelConfig);

  // High Risk count from database (Stage 2 and Crisis)
  const highRiskPatientsCount = useMemo(() => {
    return patients.filter(
      (p) => p.status === 'Tingkat 2'
    ).length;
  }, [patients]);

  // Average confidence score computed from real prediction records
  const avgConfidence = useMemo(() => {
    return records.length > 0
      ? (records.reduce((sum, r) => sum + r.confidenceScore, 0) / records.length).toFixed(1)
      : null;
  }, [records]);

  // Classifications Today calculation matching Indonesian month abbreviations
  const classificationsTodayCount = useMemo(() => {
    const now = new Date();
    const day = now.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    // Match both "d Mon yyyy" and "dd Mon yyyy" formats
    const match1 = `${day} ${month} ${year}`;
    const match2 = `${String(day).padStart(2, '0')} ${month} ${year}`;

    return records.filter((r) => {
      return r.date.includes(match1) || r.date.includes(match2);
    }).length;
  }, [records]);

  const activeModel = modelConfig.activeModel;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 p-4">
      {/* Metric 1: Total Pasien */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex justify-between items-start">
          <Users className="w-5 h-5 text-slate-800 shrink-0" />
        </div>
        <div className="mt-4 text-left">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Pasien</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{patients.length}</p>
        </div>
      </div>

      {/* Metric 2: Total Klasifikasi */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex justify-between items-start">
          <Activity className="w-5 h-5 text-slate-800 shrink-0" />
        </div>
        <div className="mt-4 text-left">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Klasifikasi</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{records.length}</p>
        </div>
      </div>

      {/* Metric 3: Klasifikasi Hari Ini */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex justify-between items-start">
          <Calendar className="w-5 h-5 text-slate-800 shrink-0" />
        </div>
        <div className="mt-4 text-left">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider" title="Total pemeriksaan klasifikasi yang tercatat pada hari ini">Klasifikasi Hari Ini</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{classificationsTodayCount}</p>
        </div>
      </div>

      {/* Metric 4: Rata-rata Confidence */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex justify-between items-start">
          <BrainCircuit className="w-5 h-5 text-slate-800 shrink-0" />
        </div>
        <div className="mt-4 text-left">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider" title="Rerata tingkat keyakinan prediksi dari seluruh rekor klinis">Rerata Confidence</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{avgConfidence !== null ? `${avgConfidence}%` : '—'}</p>
        </div>
      </div>

      {/* Metric 5: Model Classifier Aktif */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex justify-between items-start">
          <Cpu className="w-5 h-5 text-slate-800 shrink-0" />
        </div>
        <div className="mt-4 text-left">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider" title="Model Machine Learning yang aktif digunakan untuk inferensi">Model Classifier</p>
          <p className="text-sm font-extrabold text-slate-900 mt-1.5 truncate">Decision Tree <br/>& Random Forest</p>
        </div>
      </div>

      {/* Metric 6: Pasien Risiko Tinggi */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex justify-between items-start">
          <AlertTriangle className="w-5 h-5 text-slate-800 shrink-0" />
        </div>
        <div className="mt-4 text-left">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider" title="Pasien teridentifikasi dengan klasifikasi Hipertensi Tingkat 2">Risiko Tinggi (Tingkat 2)</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{highRiskPatientsCount}</p>
        </div>
      </div>
    </section>
  );
}

