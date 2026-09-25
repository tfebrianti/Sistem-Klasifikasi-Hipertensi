import React, { useState } from 'react';
import { HeartPulse, Activity, RotateCcw, Search, X, User, Scale, UserCheck, UserPlus, Info } from 'lucide-react';
import { usePatientStore } from '../../../stores/patientStore';
import { Patient } from '../../../types';

interface ClinicalFormProps {
  usia: number | '';
  setUsia: (val: number | '') => void;
  gender: 'L' | 'P';
  setGender: (val: 'L' | 'P') => void;
  berat: number | '';
  setBerat: (val: number | '') => void;
  tinggi: number | '';
  setTinggi: (val: number | '') => void;
  sistolik: number | '';
  setSistolik: (val: number | '') => void;
  diastolik: number | '';
  setDiastolik: (val: number | '') => void;
  bmi: number;
  isClassifying: boolean;
  onClassify: () => void;
  onReset: () => void;

  patientType: 'registered' | 'new';
  selectedPatientId: string | '';
  patientName: string;
  setPatientType: (val: 'registered' | 'new') => void;
  setSelectedPatientId: (val: string | '') => void;
  setPatientName: (val: string) => void;
  onSelectPatient?: (patient: Patient) => void;
}

export default function ClinicalForm({
  usia,
  setUsia,
  gender,
  setGender,
  berat,
  setBerat,
  tinggi,
  setTinggi,
  sistolik,
  setSistolik,
  diastolik,
  setDiastolik,
  bmi,
  isClassifying,
  onClassify,
  onReset,

  patientType,
  selectedPatientId,
  patientName,
  setPatientType,
  setSelectedPatientId,
  setPatientName,
  onSelectPatient,
}: ClinicalFormProps) {
  const patients = usePatientStore((state) => state.patients);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClassify();
  };

  // Status kategori IMT menurut Kemenkes RI / WHO Asia-Pasifik
  const getBmiCategory = (val: number) => {
    if (val <= 0) return null;
    if (val < 18.5) return { label: 'Berat Kurang', color: 'text-amber-700' };
    if (val < 23.0) return { label: 'Normal / Ideal', color: 'text-emerald-700' };
    if (val < 25.0) return { label: 'Kelebihan BB', color: 'text-orange-700' };
    return { label: 'Obesitas', color: 'text-red-700' };
  };

  const bmiCat = getBmiCategory(bmi);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-7 shadow-xs hover:border-slate-300 transition-colors text-left h-full flex flex-col justify-between">
      {/* Header Form */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 flex-shrink-0">
        <HeartPulse className="w-5 h-5 text-slate-800 shrink-0" />
        <div>
          <h3 className="text-base font-bold text-slate-900 select-none">Input Data Klinis Pasien</h3>
          <p className="text-xs text-slate-400 mt-0.5">Formulir pemeriksaan antropometri & hemodinamik untuk klasifikasi hipertensi</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col justify-between pt-5">
        <div className="space-y-6">
          {/* SEKSI 1: IDENTITAS & DEMOGRAFI */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                1. Identitas & Demografi Pasien
              </span>
            </div>

            {/* Baris 1: Tipe Pasien & Input Pasien */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipe Pasien Segmented Control */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Tipe Pasien</label>
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/70 h-11 items-center">
                  <button
                    type="button"
                    onClick={() => setPatientType('registered')}
                    className={`flex-1 h-full rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                      patientType === 'registered'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Pasien Terdaftar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPatientType('new');
                      setSelectedPatientId('');
                      setPatientName('');
                      setUsia('');
                      setGender('L');
                      setBerat('');
                      setTinggi('');
                      setSistolik('');
                      setDiastolik('');
                      setSearchQuery('');
                    }}
                    className={`flex-1 h-full rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                      patientType === 'new'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Pasien Baru</span>
                  </button>
                </div>
              </div>

              {/* Input Identitas Pasien */}
              <div className="space-y-1.5 relative">
                {patientType === 'registered' ? (
                  <>
                    <label className="text-xs font-semibold text-slate-700 block">Cari Pasien Terdaftar</label>
                    {selectedPatientId ? (
                      <div className="h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-xs font-bold text-slate-800 truncate">{patientName}</span>
                          <span className="text-[11px] font-mono font-semibold text-slate-400">({selectedPatientId})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPatientId('');
                            setPatientName('');
                            setUsia('');
                            setGender('L');
                            setBerat('');
                            setTinggi('');
                            setSistolik('');
                            setDiastolik('');
                            setSearchQuery('');
                          }}
                          className="text-slate-400 hover:text-red-500 p-1 rounded cursor-pointer transition-colors"
                          title="Hapus pilihan pasien"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Search className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="Ketik nama atau ID pasien..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsFocused(true);
                          }}
                          onFocus={() => setIsFocused(true)}
                          className="w-full h-11 pl-10 pr-8 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all text-xs font-medium text-slate-800 focus:outline-none"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Dropdown Pencarian */}
                        {isFocused && searchQuery.trim().length > 0 && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsFocused(false)} />
                            <div className="absolute z-20 w-full bg-white border border-slate-200 rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto divide-y divide-slate-100">
                              {patients.filter(p => 
                                p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                p.id.toLowerCase().includes(searchQuery.toLowerCase())
                              ).length > 0 ? (
                                patients
                                  .filter(p => 
                                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    p.id.toLowerCase().includes(searchQuery.toLowerCase())
                                  )
                                  .map(p => (
                                    <div
                                      key={p.id}
                                      onClick={() => {
                                        if (onSelectPatient) {
                                          onSelectPatient(p);
                                        } else {
                                          setSelectedPatientId(p.id);
                                          setPatientName(p.name);
                                          setUsia(p.age);
                                          setGender(p.gender);
                                        }
                                        setIsFocused(false);
                                        setSearchQuery('');
                                      }}
                                      className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors text-left flex justify-between items-center"
                                    >
                                      <span>{p.name}</span>
                                      <span className="text-[11px] font-mono text-slate-400">{p.id}</span>
                                    </div>
                                  ))
                              ) : (
                                <div className="px-3.5 py-3 text-xs text-slate-400 text-left">
                                  Tidak ada pasien yang cocok
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <label className="text-xs font-semibold text-slate-700 block">Nama Lengkap Pasien Baru</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all text-xs font-medium text-slate-800 focus:outline-none"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Helper Alert: Auto-fill feedback */}
            {patientType === 'registered' && selectedPatientId && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-blue-50/70 border border-blue-200/70 rounded-xl text-xs text-blue-900">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Data riwayat terakhir (<strong>{patientName}</strong>) terisi otomatis. Anda dapat langsung memperbarui usia, BB/TB, atau tensi baru untuk pemeriksaan saat ini.
                </span>
              </div>
            )}

            {/* Baris 2: Usia & Jenis Kelamin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Usia */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Usia (Tahun)</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 45"
                  value={usia}
                  onChange={(e) => setUsia(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>

              {/* Jenis Kelamin Segmented Control */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Jenis Kelamin</label>
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/70 h-11 items-center">
                  <button
                    type="button"
                    onClick={() => setGender('L')}
                    className={`flex-1 h-full rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                      gender === 'L'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Laki-laki
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('P')}
                    className={`flex-1 h-full rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                      gender === 'P'
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Perempuan
                  </button>
                </div>
              </div>
            </div>
          </div>


          {/* SEKSI 2: PENGUKURAN FISIK (ANTROPOMETRI) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Scale className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                2. Pengukuran Fisik (Antropometri)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Berat Badan */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700 block">Berat Badan</label>
                  <span className="text-[11px] text-slate-400 font-medium">kg</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="Contoh: 65.5"
                  value={berat}
                  onChange={(e) => setBerat(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>

              {/* Tinggi Badan */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700 block">Tinggi Badan</label>
                  <span className="text-[11px] text-slate-400 font-medium">cm</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="Contoh: 165"
                  value={tinggi}
                  onChange={(e) => setTinggi(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Status Kalkulasi IMT Otomatis */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Indeks Massa Tubuh (IMT):</span>
                <span className="text-[11px] text-slate-400 font-normal">BB / TB²</span>
              </div>
              {bmi > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-xs">{bmi} kg/m²</span>
                  <span className="text-slate-300">·</span>
                  <span className={`font-semibold ${bmiCat?.color || 'text-slate-600'}`}>
                    {bmiCat?.label}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 italic font-normal text-[11px]">
                  Kalkulasi otomatis saat BB & TB diisi
                </span>
              )}
            </div>
          </div>

          {/* SEKSI 3: TEKANAN DARAH (HEMODINAMIK) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  3. Pemeriksaan Tekanan Darah
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">Satuan: mmHg</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sistolik */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700 block">Sistolik (SYS)</label>
                  <span className="text-[10px] text-slate-400 font-medium">Batas normal &lt; 120</span>
                </div>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 120"
                  value={sistolik}
                  onChange={(e) => setSistolik(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>

              {/* Diastolik */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700 block">Diastolik (DIA)</label>
                  <span className="text-[10px] text-slate-400 font-medium">Batas normal &lt; 80</span>
                </div>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 80"
                  value={diastolik}
                  onChange={(e) => setDiastolik(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isClassifying}
            className="flex-1 h-11 px-5 bg-slate-900 hover:bg-black active:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-900 border-b-2 shadow-xs active:border-b active:translate-y-[1px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Activity className="w-4 h-4 text-white" />
            <span>{isClassifying ? 'Sedang Memproses...' : 'Proses Klasifikasi Hipertensi'}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="h-11 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-300 border-b-2 shadow-xs active:border-b active:translate-y-[1px] transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>
      </form>
    </div>
  );
}

