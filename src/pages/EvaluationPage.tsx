import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, TreeDeciduous, Trees, TrendingUp, Target, Crosshair, Award, Info, ChevronDown } from 'lucide-react';

// Data Evaluasi Model Skripsi BAB IV (Skenario 1 + SMOTE pada Data Uji X_test)
const evaluationData = {
  decisionTree: {
    name: 'Decision Tree (+ SMOTE)',
    icon: TreeDeciduous,
    color: 'blue',
    accuracy: 100.0,
    precision: 100.0,
    recall: 100.0,
    f1Score: 100.0,
    description: 'Model Decision Tree dengan penyeimbangan data latih SMOTE. Mampu merekonstruksi aturan deterministik JNC 7 secara sempurna tanpa data leakage.',
  },
  randomForest: {
    name: 'Random Forest (+ SMOTE)',
    icon: Trees,
    color: 'emerald',
    accuracy: 99.97,
    precision: 99.98,
    recall: 99.98,
    f1Score: 99.98,
    description: 'Ensemble 100 pohon keputusan dengan penyeimbangan SMOTE pada data latih. Menghasilkan generalisasi terbaik (F1-Score 99.98%) pada data uji murni.',
  },
};

const metrics = [
  { key: 'accuracy' as const, label: 'Akurasi', icon: Target, description: 'Persentase prediksi benar dari seluruh prediksi' },
  { key: 'precision' as const, label: 'Presisi', icon: Crosshair, description: 'Ketepatan prediksi positif terhadap seluruh prediksi positif' },
  { key: 'recall' as const, label: 'Recall', icon: TrendingUp, description: 'Kemampuan model mendeteksi seluruh kasus positif' },
  { key: 'f1Score' as const, label: 'F1-Score', icon: Award, description: 'Rata-rata harmonis dari presisi dan recall' },
];

type MetricKey = 'accuracy' | 'precision' | 'recall' | 'f1Score';

// Animated progress bar component
function MetricBar({ value, color, delay }: { value: number; color: string; delay: number }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
  };
  return (
    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, delay, ease: 'easeOut' }}
        className={`h-full rounded-full ${colorClasses[color]}`}
      />
    </div>
  );
}

export default function EvaluationPage() {
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

  const dt = evaluationData.decisionTree;
  const rf = evaluationData.randomForest;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 animate-fadeIn select-none pb-12">
      {/* Page header
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4"
      >
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hasil Evaluasi Model</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Perbandingan performa Decision Tree vs Random Forest</p>
            </div>
          </div>
        </div>
      </motion.div> */}

      {/* Model Overview Card (Combined) */}
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm cursor-pointer transition-all hover:shadow-md"
          onClick={() => setExpandedModel(expandedModel ? null : 'models')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-slate-800 shrink-0" />
              <div>
                <h2 className="text-sm font-bold text-slate-800">Ringkasan Model</h2>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Decision Tree & Random Forest</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600">
                DT {dt.accuracy}% · RF {rf.accuracy}%
              </span>
              <motion.div animate={{ rotate: expandedModel ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {expandedModel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  {/* Decision Tree */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <TreeDeciduous className="w-5 h-5 text-slate-800 shrink-0" />
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">Decision Tree</h3>
                        <p className="text-[9px] text-slate-500 font-medium">{dt.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {metrics.map((m) => (
                        <div key={m.key} className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-xs">
                          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{m.label}</p>
                          <p className="text-base font-bold text-slate-900 mt-0.5">{dt[m.key]}%</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Random Forest */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <Trees className="w-5 h-5 text-slate-800 shrink-0" />
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">Random Forest</h3>
                        <p className="text-[9px] text-slate-500 font-medium">{rf.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {metrics.map((m) => (
                        <div key={m.key} className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-xs">
                          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{m.label}</p>
                          <p className="text-base font-bold text-slate-900 mt-0.5">{rf[m.key]}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Full Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-4"
      >
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">Tabel Perbandingan Model</h2>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Decision Tree vs Random Forest — Semua metrik evaluasi</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3.5">Metrik</th>
                  <th className="text-center text-[11px] font-bold text-slate-700 uppercase tracking-wider px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <TreeDeciduous className="w-3.5 h-3.5 text-slate-700" />
                      Decision Tree
                    </div>
                  </th>
                  <th className="text-center text-[11px] font-bold text-slate-700 uppercase tracking-wider px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <Trees className="w-3.5 h-3.5 text-slate-700" />
                      Random Forest
                    </div>
                  </th>
                  <th className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3.5">Selisih</th>
                  <th className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3.5">Unggul</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.map((metric, idx) => {
                  const dtVal = dt[metric.key];
                  const rfVal = rf[metric.key];
                  const diff = Math.abs(rfVal - dtVal).toFixed(1);
                  const winner = rfVal > dtVal ? 'Random Forest' : dtVal > rfVal ? 'Decision Tree' : 'Sama';

                  return (
                    <motion.tr
                      key={metric.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.08 }}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <metric.icon className="w-4 h-4 text-slate-400" />
                          <div>
                            <span className="text-sm font-semibold text-slate-800">{metric.label}</span>
                            <p className="text-[10px] text-slate-400 font-medium">{metric.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-sm font-bold text-slate-800">{dtVal}%</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-sm font-bold text-slate-800">{rfVal}%</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-xs font-bold text-slate-600">{diff}%</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-xs font-semibold text-slate-700">
                          {winner}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary footer */}
          <div className="p-5 bg-slate-50/50 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <Award className="w-4 h-4 text-slate-700" />
              <span>
                Model <strong className="text-slate-900 font-bold">Random Forest</strong> menunjukkan performa lebih unggul di semua metrik evaluasi dengan rata-rata selisih{' '}
                <strong className="text-slate-900 font-bold">
                  +{(
                    ((rf.accuracy - dt.accuracy) + (rf.precision - dt.precision) + (rf.recall - dt.recall) + (rf.f1Score - dt.f1Score)) / 4
                  ).toFixed(1)}%
                </strong>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
