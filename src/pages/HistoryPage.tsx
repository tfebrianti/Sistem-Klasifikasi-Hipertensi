import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Download, Trash2, ChevronLeft, ChevronRight, Activity, Calendar, DownloadCloud, Eye, Scale, User, HeartPulse, Info, FileText } from 'lucide-react';
import { useHistory } from '../features/history/hooks/useHistory';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PredictionRecord } from '../types';
import { getHypertensionStageDetails } from '../utils/hypertension';
import { Modal } from '../components/ui/Modal';

export default function HistoryPage() {
  const {
    filterText,
    setFilterText,
    currentPage,
    setCurrentPage,
    exporting,
    showToast,
    toastMessage,
    filtered,
    paginated,
    totalPages,
    startIndex,
    itemsPerPage,
    handleExport,
    handleDeleteRecord,
  } = useHistory();

  const [selectedRecord, setSelectedRecord] = useState<PredictionRecord | null>(null);

  const getBmiCategory = (val: number) => {
    if (val <= 0) return '—';
    if (val < 18.5) return 'Berat Kurang';
    if (val < 23.0) return 'Normal';
    if (val < 25.0) return 'Kelebihan BB';
    return 'Obesitas';
  };

  const selectedDetails = selectedRecord ? getHypertensionStageDetails(selectedRecord.result) : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 select-none relative">
      {/* Toast notifications */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-24 right-8 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl text-xs font-bold border border-slate-700 flex items-center gap-2.5"
          >
            <DownloadCloud className="w-5 h-5 text-blue-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>      

      {/* Table grid wrapper card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        {/* Toolbar Header filters */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-slate-50/60 gap-4">
          <div className="relative flex items-center gap-2 w-full max-w-md">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                placeholder="Cari nama, ID pasien, atau ID rekam..."
                value={filterText}
                onChange={(e) => {
                  setFilterText(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all font-sans"
              />
            </div>
            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-300 px-2.5 py-1 tracking-wider rounded shadow-xs uppercase whitespace-nowrap">
              {filtered.length} Rekam
            </span>
          </div>
          <div className="flex gap-2 select-none">
            <Button
              size="sm"
              variant="primary"
              disabled={exporting}
              onClick={() => handleExport('PDF')}
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={exporting}
              onClick={() => handleExport('CSV')}
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
          </div>          
        </div>

        {/* Data Table contents */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-[#f8fafc]/80 border-b border-slate-200 select-none">
              <tr>
                <th className="py-3 px-5 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Pasien</th>
                <th className="py-3 px-5 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Demografi</th>
                <th className="py-3 px-5 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Antropometri</th>
                <th className="py-3 px-5 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Tekanan Darah</th>
                <th className="py-3 px-5 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Hasil Klasifikasi</th>
                <th className="py-3 px-5 text-[10px] font-bold text-slate-450 uppercase tracking-wider text-center">Confidence</th>
                <th className="py-3 px-5 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Tanggal & Waktu</th>
                <th className="py-3 px-5 text-[10px] font-bold text-slate-450 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 bg-white font-medium">
              <AnimatePresence mode="popLayout">
                {paginated.length > 0 ? (
                  paginated.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="hover:bg-slate-50/50 transition-colors group text-slate-750"
                    >
                      {/* Kolom 1: Nama & ID Pasien */}
                      <td className="py-4 px-5 text-xs select-text">
                        <div className="font-extrabold text-slate-900 leading-snug">{item.patientName}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[11px] font-bold text-blue-700">{item.patientId}</span>
                          <span className="text-slate-300">·</span>
                          <span className="font-mono text-[10px] text-slate-400">{item.id}</span>
                        </div>
                      </td>

                      {/* Kolom 2: Demografi (Usia & Gender) */}
                      <td className="py-4 px-5 text-xs select-text">
                        <div className="font-bold text-slate-800">{item.age} Tahun</div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {item.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </div>
                      </td>

                      {/* Kolom 3: Antropometri (BB, TB, IMT) */}
                      <td className="py-4 px-5 text-xs select-text">
                        <div className="font-bold text-slate-800">
                          {item.weight} kg <span className="text-slate-300 font-normal">/</span> {item.height} cm
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          IMT: <strong className="text-slate-700 font-semibold">{item.bmi}</strong> ({getBmiCategory(item.bmi)})
                        </div>
                      </td>

                      {/* Kolom 4: Tekanan Darah (SYS/DIA & Pulse Pressure) */}
                      <td className="py-4 px-5 text-xs select-text">
                        <div className="font-extrabold text-slate-900 text-sm leading-tight">
                          <span className="text-blue-700">{item.systolic}</span>
                          <span className="text-slate-400 mx-1">/</span>
                          <span className="text-indigo-600">{item.diastolic}</span>
                          <span className="text-[10px] text-slate-400 font-medium ml-1">mmHg</span>
                        </div>
                        <div className="text-[10px] font-semibold mt-0.5 flex items-center gap-1">
                          <span className={item.systolic - item.diastolic >= 60 ? 'text-amber-800 font-bold' : 'text-slate-400'}>
                            PP: {item.systolic - item.diastolic} mmHg
                          </span>
                          {item.systolic - item.diastolic >= 60 && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-100 text-amber-900 font-bold border border-amber-300" title="Peringatan Klinis: Tekanan Nadi Tinggi (≥ 60 mmHg) - Indikasi Kekakuan Arteri">
                              Tinggi
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Kolom 5: Hasil Klasifikasi */}
                      <td className="py-4 px-5">
                        <Badge variant={item.result}>{item.result}</Badge>
                      </td>

                      {/* Kolom 6: Skor Kepercayaan */}
                      <td className="py-4 px-5 text-center select-none">
                        <span className="text-xs font-semibold text-slate-700">
                          {item.confidenceScore}%
                        </span>
                      </td>

                      {/* Kolom 7: Tanggal Pemeriksaan */}
                      <td className="py-4 px-5 text-xs text-slate-450 select-text">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.date}</span>
                        </div>
                      </td>

                      {/* Kolom 8: Aksi (Detail & Hapus) */}
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedRecord(item)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 transition-all cursor-pointer bg-white shadow-xs"
                            title="Lihat Rincian Rekam Medis"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(item.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 border border-slate-200 transition-all cursor-pointer bg-white shadow-xs"
                            title="Hapus Data Prediksi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr className="select-none">
                    <td colSpan={8} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center max-w-[280px] mx-auto py-4">
                        <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 border-b-2 shadow-xs mb-4">
                          <Activity className="w-8 h-8 text-slate-600" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">Tidak Ada Data Ditemukan</h4>
                        <p className="text-xs text-slate-400 text-center mt-1 leading-relaxed font-semibold">
                          Kami tidak menemukan data untuk kata kunci pencarian "{filterText}". Coba lagi.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination toolbar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-150 bg-[#f8fafc]/50 flex items-center justify-between select-none">
            <p className="text-xs font-semibold text-slate-450">
              Menampilkan <span className="font-bold text-slate-800">{startIndex + 1}</span> hingga{' '}
              <span className="font-bold text-slate-800">
                {Math.min(startIndex + itemsPerPage, filtered.length)}
              </span>{' '}
              dari <span className="font-bold text-slate-800">{filtered.length}</span> hasil prediksi
            </p>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Pagination indexes */}
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageIndex = i + 1;
                const isSelected = currentPage === pageIndex;
                return (
                  <button
                    key={`pg-idx-${pageIndex}`}
                    onClick={() => setCurrentPage(pageIndex)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors cursor-pointer
                      ${isSelected 
                        ? 'bg-blue-600 text-white shadow-sm border-blue-600' 
                        : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                  >
                    {pageIndex}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail Rekam Medis Klasifikasi */}
      <Modal
        isOpen={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
        title="Rincian Rekam Medis Klasifikasi"
        subtitle={`ID Rekam: ${selectedRecord?.id || ''} · ${selectedRecord?.date || ''}`}
        size="lg"
      >
        {selectedRecord && (
          <div className="space-y-4 text-left">
            {/* Header Ringkasan Diagnosis */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hasil Klasifikasi JNC 7</span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{selectedRecord.result}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedDetails?.range}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skor Keyakinan</span>
                <span className="text-lg font-extrabold text-slate-900 block">{selectedRecord.confidenceScore}%</span>
                <span className="text-[10px] font-semibold text-slate-500">{selectedRecord.modelUsed}</span>
              </div>
            </div>

            {/* Grid Detail 3 Kolom / Seksi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Seksi 1: Pasien */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Data Pasien</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Nama Lengkap</span>
                    <strong className="text-slate-800 font-bold">{selectedRecord.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ID Pasien</span>
                    <span className="font-mono text-blue-700 font-semibold">{selectedRecord.patientId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Usia & Gender</span>
                    <span className="text-slate-700 font-semibold">
                      {selectedRecord.age} Th · {selectedRecord.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seksi 2: Antropometri */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                  <Scale className="w-3.5 h-3.5 text-slate-500" />
                  <span>Antropometri</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Berat & Tinggi Badan</span>
                    <strong className="text-slate-800 font-bold">{selectedRecord.weight} kg · {selectedRecord.height} cm</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Indeks Massa Tubuh (IMT)</span>
                    <span className="text-slate-900 font-extrabold">{selectedRecord.bmi} kg/m²</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Status Berat Badan</span>
                    <span className="text-slate-600 font-semibold">{getBmiCategory(selectedRecord.bmi)}</span>
                  </div>
                </div>
              </div>

              {/* Seksi 3: Hemodinamik */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tekanan Darah</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Sistolik / Diastolik</span>
                    <strong className="text-slate-900 font-extrabold text-sm">
                      {selectedRecord.systolic} / {selectedRecord.diastolic} <span className="text-[10px] font-normal text-slate-400">mmHg</span>
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tekanan Nadi (PP)</span>
                    <span className="text-slate-700 font-semibold">{selectedRecord.systolic - selectedRecord.diastolic} mmHg</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Status Klasifikasi</span>
                    <Badge variant={selectedRecord.result}>{selectedRecord.result}</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Peringatan Tekanan Nadi (Pulse Pressure) */}
            {selectedRecord.systolic - selectedRecord.diastolic >= 60 && (
              <div className="p-3.5 bg-amber-50/90 border border-amber-300 rounded-xl text-xs flex items-start gap-2.5 text-amber-950">
                <HeartPulse className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <strong className="font-bold text-amber-950">
                      Peringatan Tekanan Nadi Tinggi ({selectedRecord.systolic - selectedRecord.diastolic} mmHg)
                    </strong>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-200/80 text-amber-900 font-extrabold uppercase tracking-wider">
                      Arterial Stiffness
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                    Selisih tekanan sistolik dan diastolik &ge; 60 mmHg mengindikasikan kekakuan dinding arteri, penurunan elastisitas aorta, serta peningkatan beban akhir miokardium. Dianjurkan pemantauan vaskular dan kepatuhan terapi hipertensi secara intensif.
                  </p>
                </div>
              </div>
            )}

            {/* Panduan & Rekomendasi Klinis */}
            {selectedDetails && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>Rekomendasi & Tindakan Klinis</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {selectedDetails.description}
                </p>
                <div className="pt-2 border-t border-slate-200/80 flex items-start gap-2 text-slate-700">
                  <Info className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-[11px] font-medium leading-normal text-slate-500">
                    <strong className="text-slate-700 font-bold">Instruksi Medis: </strong>
                    {selectedDetails.recommendation}
                  </p>
                </div>
              </div>
            )}

            {/* Footer Modal */}
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRecord(null)}
              >
                Tutup Rincian
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
