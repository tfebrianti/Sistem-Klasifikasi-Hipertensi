import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  TreeDeciduous,
  Trees,
  TrendingUp,
  Target,
  Crosshair,
  Award,
  ShieldCheck,
  Sparkles,
  Database,
  CheckCircle2,
  Layers,
  Network,
  FileCheck2,
  Activity,
} from 'lucide-react';

type ScenarioKey = 'scenario1' | 'scenario2';

const scenarioModels = {
  scenario1: {
    badge: 'Skenario 1 • Clinical Staging Model (8 Fitur Lengkap)',
    subtitle:
      'Menggunakan 8 fitur klinis lengkap (Umur, Jenis Kelamin, Kategori Usia, BB, TB, IMT, Sistole, dan Diastole) sebagai modul verifikasi keputusan klinis (CDSS) berstandar JNC 7 & Permenkes RI.',
    decisionTree: {
      name: 'Decision Tree (+ SMOTE)',
      accuracy: 100.0,
      precision: 100.0,
      recall: 100.0,
      f1Score: 100.0,
      defaultAcc: 100.0,
      defaultF1: 100.0,
      description:
        'Merekonstruksi aturan ambang batas deterministik JNC 7 secara presisi melalui partisi ortogonal pohon keputusan pada data latih yang telah diseimbangkan dengan SMOTE.',
    },
    randomForest: {
      name: 'Random Forest (+ SMOTE)',
      accuracy: 99.97,
      precision: 99.98,
      recall: 99.98,
      f1Score: 99.98,
      defaultAcc: 99.97,
      defaultF1: 99.96,
      description:
        'Ensemble 100 pohon keputusan dengan SMOTE pada data latih. Menghasilkan probabilitas kelas (Confidence Score) terkalibrasi untuk mendeteksi risiko pada pasien di zona ambang batas (borderline).',
    },
    featureImportance: [
      { feature: 'Tekanan Darah Sistole (mmHg)', value: 47.5, category: 'Deterministik Utama JNC 7' },
      { feature: 'Tekanan Darah Diastole (mmHg)', value: 36.41, category: 'Deterministik Utama JNC 7' },
      { feature: 'Umur Pasien (Tahun)', value: 5.88, category: 'Faktor Degeneratif Vaskular' },
      { feature: 'Berat Badan (kg)', value: 3.34, category: 'Komorbid Antropometri' },
      { feature: 'Indeks Massa Tubuh / IMT (kg/m²)', value: 2.47, category: 'Indikator Obesitas' },
      { feature: 'Tinggi Badan (cm)', value: 2.42, category: 'Proporsi Antropometri' },
      { feature: 'Kategori Usia', value: 1.73, category: 'Demografi' },
      { feature: 'Jenis Kelamin', value: 0.24, category: 'Demografi' },
    ],
  },
  scenario2: {
    badge: 'Skenario 2 • Non-Invasive Screening Model (6 Fitur Tanpa Tekanan Darah)',
    subtitle:
      'Mengeliminasi fitur Sistole dan Diastole untuk menguji kemampuan murni algoritma menemukan pola tersembunyi dari 6 indikator fisik non-invasif (Umur, Jenis Kelamin, Kategori Usia, BB, TB, dan IMT) tanpa target leakage.',
    decisionTree: {
      name: 'Decision Tree (+ SMOTE)',
      accuracy: 50.6,
      precision: 48.26,
      recall: 47.77,
      f1Score: 47.94,
      defaultAcc: 50.52,
      defaultF1: 47.38,
      description:
        'Pohon keputusan tunggal berbasis fitur demografi dan antropometri. Penerapan SMOTE pada X_train meningkatkan Recall dan F1-Score dibanding model tanpa SMOTE (47,38% → 47,94%).',
    },
    randomForest: {
      name: 'Random Forest (+ SMOTE)',
      accuracy: 52.27,
      precision: 49.9,
      recall: 50.2,
      f1Score: 50.04,
      defaultAcc: 52.14,
      defaultF1: 49.68,
      description:
        'Model terbaik Skenario 2. Mencapai akurasi 52,27% (> 2x lipat di atas Random Guess 4 kelas = 25,00%) dan meningkatkan Recall kelas kritis Hipertensi Derajat 2 dari 46,58% menjadi 50,65%.',
    },
    featureImportance: [
      { feature: 'Umur Pasien (Tahun)', value: 35.39, category: 'Prediktor Utama #1 (Kekakuan Arteri Degeneratif)' },
      { feature: 'Indeks Massa Tubuh / IMT (kg/m²)', value: 22.18, category: 'Prediktor Utama #2 (Beban Metabolik & Obesitas)' },
      { feature: 'Berat Badan (kg)', value: 20.6, category: 'Prediktor Utama #3 (Komposisi Massa Tubuh)' },
      { feature: 'Tinggi Badan (cm)', value: 17.61, category: 'Prediktor Utama #4 (Proporsi Antropometri)' },
      { feature: 'Kategori Usia', value: 2.3, category: 'Kelompok Demografi Usia' },
      { feature: 'Jenis Kelamin', value: 1.94, category: 'Faktor Demografi Gender' },
    ],
  },
};

const metrics = [
  { key: 'accuracy' as const, label: 'Accuracy', icon: Target, description: 'Ketepatan klasifikasi keseluruhan pada data uji murni (X_test)' },
  { key: 'precision' as const, label: 'Precision (Macro)', icon: Crosshair, description: 'Rata-rata ketepatan prediksi positif lintas 4 kelas hipertensi' },
  { key: 'recall' as const, label: 'Recall (Macro)', icon: TrendingUp, description: 'Sensitivitas model dalam mendeteksi seluruh kasus tiap kelas' },
  { key: 'f1Score' as const, label: 'F1-Score (Macro)', icon: Award, description: 'Rata-rata harmonis Precision dan Recall sebagai metrik utama' },
];

const smoteDistribution = [
  {
    kelas: 'Normal (<120 / <80 mmHg)',
    raw: '7.204 (36,72%)',
    trainPre: '5.763 sampel',
    trainPost: '5.763 sampel (Seimbang)',
    testPure: '1.441 sampel (Murni)',
  },
  {
    kelas: 'Pra-Hipertensi (120–139 / 80–89 mmHg)',
    raw: '5.807 (29,60%)',
    trainPre: '4.645 sampel',
    trainPost: '5.763 sampel (+1.118 Sintetis)',
    testPure: '1.162 sampel (Murni)',
  },
  {
    kelas: 'Hipertensi Derajat 1 (140–159 / 90–99 mmHg)',
    raw: '3.841 (19,58%)',
    trainPre: '3.073 sampel',
    trainPost: '5.763 sampel (+2.690 Sintetis)',
    testPure: '768 sampel (Murni)',
  },
  {
    kelas: 'Hipertensi Derajat 2 (≥160 / ≥100 mmHg)',
    raw: '2.766 (14,10%)',
    trainPre: '2.213 sampel',
    trainPost: '5.763 sampel (+3.550 Sintetis)',
    testPure: '459 sampel (Murni)',
  },
];

export default function EvaluationPage() {
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>('scenario1');

  const current = scenarioModels[activeScenario];
  const dt = current.decisionTree;
  const rf = current.randomForest;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fadeIn select-none pb-12 text-left">
      {/* Header & Scenario Switcher */}
      <div className="px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Hasil Evaluasi Model & Metodologi Penelitian
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Komparasi eksperimen Skenario 1 (Clinical Staging) vs Skenario 2 (Non-Invasive Screening), Validasi Zero Data Leakage SMOTE, dan Uji UAT Puskesmas Kembaran 1.
                </p>
              </div>
            </div>

            {/* Scenario Toggle Buttons */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setActiveScenario('scenario1')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeScenario === 'scenario1'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Skenario 1: Clinical Staging (8 Fitur)
              </button>
              <button
                type="button"
                onClick={() => setActiveScenario('scenario2')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeScenario === 'scenario2'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Skenario 2: Non-Invasive (6 Fitur Tanpa Tensi)
              </button>
            </div>
          </div>

          {/* Active Scenario Description Banner */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                {current.badge}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">{current.subtitle}</p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                Zero Data Leakage (SMOTE Khusus X_train)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Cards (Decision Tree vs Random Forest) */}
      <div className="px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Decision Tree Card */}
        <motion.div
          key={`dt-${activeScenario}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <TreeDeciduous className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">{dt.name}</h2>
                <p className="text-[11px] text-slate-500">Tanpa SMOTE (Default): Akurasi {dt.defaultAcc}% · F1 {dt.defaultF1}%</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              F1: {dt.f1Score}%
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{dt.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {metrics.map((m) => (
              <div key={m.key} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{m.label}</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">{dt[m.key]}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Random Forest Card */}
        <motion.div
          key={`rf-${activeScenario}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <Trees className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">{rf.name}</h2>
                <p className="text-[11px] text-slate-500">Tanpa SMOTE (Default): Akurasi {rf.defaultAcc}% · F1 {rf.defaultF1}%</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              F1: {rf.f1Score}%
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{rf.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {metrics.map((m) => (
              <div key={m.key} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{m.label}</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">{rf[m.key]}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Feature Importance & Tabel Perbandingan */}
      <div className="px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gini Feature Importance */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span>Kontribusi Fitur (Gini Feature Importance)</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {activeScenario === 'scenario1'
                  ? 'Dominasi variabel tekanan darah (83,91%) beserta kontribusi variabel komorbid'
                  : 'Penemuan pola tersembunyi ketika fitur tekanan darah dieliminasi: Usia (35,39%) & Antropometri (60,39%)'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {current.featureImportance.map((item, idx) => (
              <div key={item.feature} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    {idx + 1}. {item.feature}
                  </span>
                  <span className="font-bold text-slate-900">{item.value.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(item.value * 1.8, 100)}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className={`h-full rounded-full ${
                      idx === 0
                        ? 'bg-blue-600'
                        : idx === 1
                        ? 'bg-emerald-600'
                        : idx < 4
                        ? 'bg-indigo-500'
                        : 'bg-slate-400'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-slate-400">{item.category}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Klarifikasi Akademis Skenario 1 & Novelty Skenario 2 */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Justifikasi Akademis & Temuan Penelitian (BAB IV)</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Analisis metodologis atas hasil pengujian kedua skenario pemodelan
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1.5">
              <h4 className="font-bold text-blue-950">
                1. Mengapa Skenario 1 Menggunakan ML Dibanding Statis IF-ELSE?
              </h4>
              <p className="text-[11px] text-blue-900/90">
                Capaian 100% pada Skenario 1 terjadi karena label target JNC 7 dibentuk dari ambang batas Sistole & Diastole (Target-Feature Determinism). Namun, algoritma Machine Learning tetap dibutuhkan karena:
              </p>
              <ul className="list-disc list-inside text-[11px] text-blue-900/90 space-y-0.5">
                <li>
                  <strong>Probabilistic Confidence Score:</strong> Random Forest mengevaluasi 100 pohon keputusan yang melibatkan Usia & IMT untuk memberi peringatan dini pada kasus tensi <em>borderline</em> (misal 139/89 mmHg), sedangkan fungsi IF-ELSE bersifat kaku (biner).
                </li>
                <li>
                  <strong>Multivariate Feature Importance & Skalabilitas:</strong> Mengukur bobot interaksi 8 fitur secara simultan dan memungkinkan <em>retraining</em> otomatis saat atribut laboratorium baru ditambahkan.
                </li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1.5">
              <h4 className="font-bold text-emerald-950">
                2. Signifikansi & Pola Tersembunyi pada Skenario 2 (Akurasi 52,27%)
              </h4>
              <p className="text-[11px] text-emerald-900/90">
                Tanpa tekanan darah, batas tebakan acak (<em>Random Guess</em>) pada klasifikasi 4 kelas adalah <strong>25,00%</strong>. Akurasi <strong>52,27%</strong> (&gt;2x lipat peluang acak) dan F1-Score kelas Normal <strong>69,85%</strong> membuktikan model berhasil menemukan pola fisiologis tersembunyi:
              </p>
              <ul className="list-disc list-inside text-[11px] text-emerald-900/90 space-y-0.5">
                <li>
                  <strong>Pola Degeneratif Usia (35,39%):</strong> Median usia meningkat konsisten dari Normal (20 thn) → Pra-HT (40 thn) → HT 1 (55 thn) → HT 2 (60 thn).
                </li>
                <li>
                  <strong>Pola Obesitas Antropometri (60,39%):</strong> Kombinasi IMT (22,18%), BB (20,60%), dan TB (17,61%) memisahkan individu Normal (median IMT 18,9) dari kelompok Hipertensi (median IMT 24,4).
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Validasi Eksplisit Zero Data Leakage (SMOTE) */}
      <div className="px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Validasi Metodologi Pencegahan Data Leakage (SMOTE Hanya pada Data Latih)</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Penyeimbangan kelas SMOTE dilakukan secara eksklusif pada X_train SETELAH Stratified Train-Test Split (80:20), bukan pada seluruh dataset awal.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold self-start sm:self-center">
              X_test Murni Tanpa SMOTE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                  <th className="py-3 px-4">Kelas Target Hipertensi</th>
                  <th className="py-3 px-4 text-center">Dataset Awal</th>
                  <th className="py-3 px-4 text-center">Data Latih (X_train Pre-SMOTE)</th>
                  <th className="py-3 px-4 text-center">Data Latih (X_train Post-SMOTE)</th>
                  <th className="py-3 px-4 text-center">Data Uji (X_test Murni)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {smoteDistribution.map((row) => (
                  <tr key={row.kelas} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-800">{row.kelas}</td>
                    <td className="py-3 px-4 text-center text-slate-600">{row.raw}</td>
                    <td className="py-3 px-4 text-center text-slate-700 font-medium">{row.trainPre}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">{row.trainPost}</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-700">{row.testPure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bukti Uji Implementasi (UAT Tenaga Medis) & Rencana Integrasi SIMPUS */}
      <div className="px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hasil UAT Puskesmas Kembaran 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <FileCheck2 className="w-4.5 h-4.5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Hasil Uji User Acceptance Testing (UAT) Puskesmas
                </h3>
                <p className="text-[11px] text-slate-500">
                  Evaluasi 5 Responden Tenaga Kesehatan & Operator SIMPUS Puskesmas Kembaran 1
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
              92,00% (Sangat Layak)
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { aspect: 'Kemudahan Navigasi & Tata Letak Antarmuka (UI/UX)', score: '96,00%' },
              { aspect: 'Kecepatan Kalkulasi IMT & Prediksi Real-Time (< 1 detik)', score: '96,00%' },
              { aspect: 'Kesesuaian Klasifikasi dengan Standar JNC 7 & Permenkes RI', score: '96,00%' },
              { aspect: 'Kejelasan Confidence Score & Grafik Riwayat Tekanan Darah', score: '92,00%' },
              { aspect: 'Kemanfaatan Ekspor Laporan PDF Ber-Kop Resmi & CSV/Excel', score: '92,00%' },
              { aspect: 'Kelayakan Operasional sebagai CDSS Pendamping Layanan Faskes', score: '88,00%' },
            ].map((u) => (
              <div key={u.aspect} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {u.aspect}
                </span>
                <span className="font-bold text-slate-900">{u.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rencana Integrasi SIMPUS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Network className="w-4.5 h-4.5 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Arsitektur Integrasi SIMPUS (Pencegahan Double Input)
              </h3>
              <p className="text-[11px] text-slate-500">
                Skema interoperabilitas sistem pendukung keputusan dengan SIMPUS Puskesmas
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">
                Tahap 1: Interoperabilitas Batch CSV / Excel Standar SIMPUS
              </span>
              <p className="text-[11px]">
                Pertukaran data kolektif melalui fitur ekspor/impor CSV dan JSON Backup berstandar struktur kolom rekam medis SIMPUS untuk pelaporan PTM ke Dinas Kesehatan tanpa pengetikan berulang.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block">
                Tahap 2: RESTful API Bridging Microservice (Zero Double Input)
              </span>
              <p className="text-[11px]">
                Backend inferensi dibangun secara <em>decoupled</em> melalui endpoint <code className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono">POST /api/predict</code>. Saat petugas menyimpan tanda vital pasien di SIMPUS, SIMPUS mengirimkan payload JSON otomatis di latar belakang dan menerima hasil klasifikasi serta <em>Confidence Score</em> secara instan (&lt; 50ms) tanpa input kedua kalinya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
