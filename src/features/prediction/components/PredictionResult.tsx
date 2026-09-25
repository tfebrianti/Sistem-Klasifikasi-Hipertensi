import React from 'react';
import { motion } from 'motion/react';
import { Activity, ShieldCheck, UserPlus, CheckCircle, FileText, Info, HeartPulse } from 'lucide-react';
import StageIndicator from './StageIndicator';
import { HypertensionLevel, getHypertensionStageDetails } from '../../../utils/hypertension';
import { EmptyState } from '../../../components/ui/interactive-empty-state';

interface PredictionResultProps {
  result: HypertensionLevel | null;
  confidence: number | null;
  accuracyDT?: number | null;
  accuracyRF?: number | null;
  sistolik?: number | '';
  diastolik?: number | '';
  
  patientType: 'registered' | 'new';
  patientName: string;
  isSaved: boolean;
  onSavePatient: () => void;
  isSaving?: boolean;
}

export default function PredictionResult({
  result,
  confidence,
  sistolik,
  diastolik,
  patientType,
  patientName,
  isSaved,
  onSavePatient,
  isSaving,
}: PredictionResultProps) {
  if (result === null || confidence === null) {
    return (
      <EmptyState
        theme="light"
        className="h-full min-h-[480px] bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-colors p-6"
        title="Menunggu Proses Klasifikasi"
        description="Silakan masukkan data klinis pasien di formulir sebelah kiri, lalu tekan tombol Proses Klasifikasi."
        icons={[
          <Activity key="e1" className="w-8 h-8 text-slate-800" />
        ]}
      />
    );
  }

  const details = getHypertensionStageDetails(result);

  const sys = typeof sistolik === 'number' ? sistolik : null;
  const dia = typeof diastolik === 'number' ? diastolik : null;
  const pulsePressure = sys !== null && dia !== null ? sys - dia : null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs text-left h-full flex flex-col justify-between">
      {/* Header Card */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Hasil Klasifikasi Klinis
          </span>
          <h3 className="text-base font-bold text-slate-800 mt-0.5">
            Kategori Hipertensi Pasien
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Standar JNC 7
        </span>
      </div>

      {/* Main Diagnosis Stage & Criteria */}
      <div className="py-4 space-y-4">
        <div className="text-center">
          <motion.div
            key={result}
            initial={{ scale: 0.96, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {result}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {result === 'Normal' ? 'Kondisi Optimal & Dalam Batas Wajar' : 'Perlu Perhatian & Evaluasi Klinis'}
            </p>
          </motion.div>

          <p className="text-xs text-slate-500 mt-3 font-medium">
            Kriteria Klinis: <span className="font-bold text-slate-700">{details.range}</span>
          </p>
        </div>

        {/* 4-Stage visual progress indicator */}
        <div className="pt-2">
          <StageIndicator result={result} />
        </div>

        {/* Confidence Score Metric Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
              <ShieldCheck className="w-5 h-5 text-slate-800" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Skor Kepercayaan (Confidence)</span>
              <p className="text-[11px] text-slate-400 font-medium">Tingkat keyakinan probabilitas model</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-extrabold text-slate-900 block leading-none">{confidence}%</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              {confidence >= 80 ? 'Sangat Tinggi' : confidence >= 65 ? 'Tinggi' : 'Cukup'}
            </span>
          </div>
        </div>

        {/* Pulse Pressure / Tekanan Nadi Clinical Analysis Card */}
        {pulsePressure !== null && (
          <div
            className={`p-4 rounded-xl border text-xs space-y-1.5 transition-all ${
              pulsePressure >= 60
                ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                : pulsePressure < 30
                ? 'bg-sky-50/80 border-sky-300 text-sky-950'
                : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5 text-xs">
                <HeartPulse className="w-4 h-4 shrink-0 text-current" />
                <span>Tekanan Nadi (Pulse Pressure): {pulsePressure} mmHg</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-extrabold border ${
                  pulsePressure >= 60
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : pulsePressure < 30
                    ? 'bg-sky-100 border-sky-300 text-sky-900'
                    : 'bg-emerald-100 border-emerald-300 text-emerald-900'
                }`}
              >
                {pulsePressure >= 60
                  ? 'Tinggi (≥ 60)'
                  : pulsePressure < 30
                  ? 'Sempit (< 30)'
                  : 'Fisiologis Normal'}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed font-medium opacity-90">
              {pulsePressure >= 60
                ? 'Peringatan Klinis: Tekanan nadi ≥ 60 mmHg mengindikasikan peningkatan kekakuan dinding arteri (arterial stiffness), berkurangnya komplians aorta, serta peningkatan risiko komplikasi kardiovaskular lanjut pada pasien.'
                : pulsePressure < 30
                ? 'Catatan Klinis: Tekanan nadi < 30 mmHg dapat mencerminkan penurunan isi sekuncup jantung (stroke volume), vasokonstriksi perifer, atau dehidrasi/hipovolemia.'
                : 'Catatan Klinis: Tekanan nadi berada dalam rentang fisiologis ideal (30–50 mmHg), mencerminkan elastisitas vaskular dan daya regang dinding aorta yang baik.'}
            </p>
          </div>
        )}

        {/* Clinical Note & Guidance Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Catatan & Rekomendasi Klinis</span>
          </div>
          <p className="text-slate-600 leading-relaxed font-medium">
            {details.description}
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-slate-700">
            <Info className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-[11px] font-medium leading-normal text-slate-500">
              <strong className="text-slate-700 font-bold">Tindakan: </strong>
              {details.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer: Quick save new patient */}
      <div className="pt-4 border-t border-slate-100">
        {patientType === 'new' ? (
          <div>
            {!isSaved ? (
              <button
                onClick={onSavePatient}
                disabled={isSaving}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-black active:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 border border-slate-900 border-b-2 shadow-xs active:border-b active:translate-y-[1px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-4 h-4 text-white" />
                <span>{isSaving ? 'Menyimpan ke Database...' : 'Daftarkan Pasien & Simpan Riwayat'}</span>
              </button>
            ) : (
              <div className="w-full py-3 px-4 bg-slate-50 text-slate-800 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 select-none border border-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Pasien & Riwayat Berhasil Disimpan ke Sistem</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Pasien Terdaftar: <strong className="text-slate-800 font-bold">{patientName}</strong></span>
            <span className="text-xs text-emerald-700 font-semibold">Riwayat tersinkronisasi</span>
          </div>
        )}
      </div>
    </div>
  );
}
