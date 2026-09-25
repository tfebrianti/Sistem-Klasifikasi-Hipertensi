import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, UserPlus, SlidersHorizontal, SortAsc, Trash2, Eye, Pencil, 
  X, Phone, Mail, MapPin, Calendar, HeartPulse, ChevronLeft, ChevronRight,
  Activity, CheckCircle2
} from 'lucide-react';
import { usePatients } from '../features/patients/hooks/usePatients';
import { Patient } from '../types';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { formatDate } from '../utils/format';
import PatientBPTrendChart from '../features/patients/components/PatientBPTrendChart';

export default function PatientsPage() {
  const navigate = useNavigate();
  const {
    filterText,
    setFilterText,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    itemsPerPage,
    paginated,
    filtered,
    patients,

    // Add Patient
    isAddOpen,
    setIsAddOpen,
    newName,
    setNewName,
    newAge,
    setNewAge,
    newGender,
    setNewGender,
    newPhone,
    setNewPhone,
    newEmail,
    setNewEmail,
    newAddress,
    setNewAddress,
    newStatus,
    setNewStatus,
    handleCreatePatient,

    // Edit Patient
    isEditOpen,
    setIsEditOpen,
    editingPatient,
    editName,
    setEditName,
    editAge,
    setEditAge,
    editGender,
    setEditGender,
    editPhone,
    setEditPhone,
    editEmail,
    setEditEmail,
    editAddress,
    setEditAddress,
    editStatus,
    setEditStatus,
    handleOpenEdit,
    handleUpdatePatient,

    // Detail & Delete
    selectedPatient,
    setSelectedPatient,
    handleDeletePatient,
  } = usePatients();

  const handleShortcutPredict = (patient: Patient) => {
    navigate('/sistem-klasifikasi', { state: { patient } });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 select-none">
      {/* Toolbar searchable and filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex-1 relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            type="text"
            placeholder="Cari Nama, ID, Telepon, atau Alamat..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all font-sans"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-300 px-3 py-2 tracking-wider rounded-lg shadow-xs uppercase whitespace-nowrap self-center">
            {filtered.length} Pasien Terdaftar
          </span>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4.5 h-4.5" />
            <span>Tambah Pasien Baru</span>
          </Button>
        </div>
      </div>

      {/* Main Patient Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[#f8fafc]/80 border-b border-slate-200 font-bold text-[10px] text-slate-400 uppercase tracking-widest select-none">
              <tr>
                <th className="py-3.5 px-6">ID Pasien</th>
                <th className="py-3.5 px-6">Nama Lengkap</th>
                <th className="py-3.5 px-6">Usia</th>
                <th className="py-3.5 px-6">Jenis Kelamin</th>
                <th className="py-3.5 px-6">Kontak / Alamat</th>
                <th className="py-3.5 px-6">Cek Terakhir</th>
                <th className="py-3.5 px-6">Status Terakhir</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700 bg-white">
              {paginated.length > 0 ? (
                paginated.map((pat) => {
                  const initial = pat.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={pat.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="py-4.5 px-6 font-bold text-slate-800 select-text">{pat.id}</td>
                      <td className="py-4.5 px-6 select-text">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-bold text-xs select-none shrink-0">
                            {initial}
                          </div>
                          <span className="font-bold text-slate-900">{pat.name}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-slate-600">{pat.age} Tahun</td>
                      <td className="py-4.5 px-6 text-slate-500">{pat.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                      <td className="py-4.5 px-6 text-slate-500 max-w-[180px] truncate select-text">
                        {pat.phone || pat.address ? (
                          <div className="space-y-0.5">
                            {pat.phone && <span className="block text-[11px] font-bold text-slate-700">{pat.phone}</span>}
                            {pat.address && <span className="block text-[10px] text-slate-400 truncate">{pat.address}</span>}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-350 italic">Belum dilengkapi</span>
                        )}
                      </td>
                      <td className="py-4.5 px-6 text-slate-450 select-text">
                        {formatDate(pat.lastChecked)}
                      </td>
                      <td className="py-4.5 px-6">
                        <Badge variant={pat.status}>{pat.status}</Badge>
                      </td>
                      
                      {/* Action buttons */}
                      <td className="py-4.5 px-6 text-right select-none">
                        <div className="flex justify-end gap-1.5 px-1">
                          <button
                            onClick={() => handleShortcutPredict(pat)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 transition-all cursor-pointer bg-white"
                            title="Mulai Klasifikasi Hipertensi"
                          >
                            <HeartPulse className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(pat)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer bg-white"
                            title="Edit Data & Kontak Pasien"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedPatient(pat)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer bg-white"
                            title="Detail Rekam Medis & Grafik Tensi"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePatient(pat.id)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-all cursor-pointer bg-white"
                            title="Hapus Pasien"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-400">
                    <div className="flex flex-col items-center justify-center max-w-[280px] mx-auto py-4">
                      <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 border-b-2 shadow-xs mb-3">
                        <Activity className="w-8 h-8 text-slate-600" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">Tidak Ada Data Ditemukan</h4>
                      <p className="text-xs text-slate-400 text-center mt-1 leading-relaxed font-semibold">
                        Tidak ada pasien yang cocok dengan kata kunci pencarian "{filterText}".
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination toolbar (Identik dengan HistoryPage) */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-150 bg-[#f8fafc]/50 flex items-center justify-between select-none">
            <p className="text-xs font-semibold text-slate-450">
              Menampilkan <span className="font-bold text-slate-800">{startIndex + 1}</span> hingga{' '}
              <span className="font-bold text-slate-800">
                {Math.min(startIndex + itemsPerPage, filtered.length)}
              </span>{' '}
              dari <span className="font-bold text-slate-800">{filtered.length}</span> pasien terdaftar
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
                    key={`pat-pg-idx-${pageIndex}`}
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

      {/* OVERLAY MODULE: PATIENT DETAILS DETAIL POPUP DENGAN GRAFIK TENSI */}
      <Modal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        title="Rincian Pasien & Rekam Medis"
        size="lg"
      >
        {selectedPatient && (
          <div className="flex flex-col text-left space-y-6">
            {/* Header Details */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 border border-slate-200 flex items-center justify-center font-bold text-base">
                  {selectedPatient.name.split(' ').map((n)=>n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug">{selectedPatient.name}</h3>
                  <p className="text-xs text-slate-450 font-bold uppercase tracking-wider mt-0.5">{selectedPatient.id}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const pat = selectedPatient;
                  setSelectedPatient(null);
                  handleOpenEdit(pat);
                }}
                className="flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Informasi</span>
              </Button>
            </div>

            {/* Informative Demographics & Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Information */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kontak & Demografis</h4>
                <ul className="space-y-2.5 pl-0 list-none text-xs">
                  <li className="flex items-center gap-2.5 font-semibold text-slate-700">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{selectedPatient.phone || <em className="text-slate-400 font-normal">Nomor belum diisi</em>}</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-semibold text-slate-700">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{selectedPatient.email || <em className="text-slate-400 font-normal">Email belum diisi</em>}</span>
                  </li>
                  <li className="flex items-start gap-2.5 font-semibold text-slate-700">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{selectedPatient.address || <em className="text-slate-400 font-normal">Alamat belum diisi</em>}</span>
                  </li>
                </ul>
              </div>

              {/* Diagnosis Status */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Diagnosis Terakhir</h4>
                  <Badge variant={selectedPatient.status}>{selectedPatient.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Usia</span>
                    <p className="font-extrabold text-base text-slate-800 mt-0.5">{selectedPatient.age} Tahun</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Jenis Kelamin</span>
                    <p className="font-extrabold text-base text-slate-800 mt-0.5">
                      {selectedPatient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Interactive BP Trend Chart */}
            <div className="pt-2">
              <PatientBPTrendChart 
                bpHistory={selectedPatient.bpHistory} 
                patientName={selectedPatient.name} 
              />
            </div>

            {/* Footer buttons */}
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => {
                  const pat = selectedPatient;
                  setSelectedPatient(null);
                  handleShortcutPredict(pat);
                }}
                className="flex items-center gap-1.5 text-xs"
              >
                <HeartPulse className="w-4 h-4 text-blue-600" />
                <span>Mulai Klasifikasi Pasien Ini</span>
              </Button>
              <Button
                onClick={() => setSelectedPatient(null)}
                variant="secondary"
              >
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* OVERLAY MODULE: EDIT INFORMASI PASIEN MODAL */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Informasi Pasien"
      >
        <form onSubmit={handleUpdatePatient} className="space-y-4 text-left max-h-[65vh] overflow-y-auto pr-1">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500">ID Pasien:</span>
            <span className="text-xs font-extrabold text-slate-800">{editingPatient?.id}</span>
          </div>

          {/* Nama Lengkap */}
          <Input
            label="Nama Lengkap Pasien"
            required
            placeholder="Contoh: Budi Santoso"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          {/* Usia & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Usia (Tahun)"
              type="number"
              required
              min={1}
              max={120}
              placeholder="Contoh: 45"
              value={editAge}
              onChange={(e) => setEditAge(e.target.value === '' ? '' : Number(e.target.value))}
            />
            <Select
              label="Jenis Kelamin"
              value={editGender}
              onChange={(e) => setEditGender(e.target.value as 'L' | 'P')}
              options={[
                { value: 'L', label: 'Laki-laki' },
                { value: 'P', label: 'Perempuan' }
              ]}
            />
          </div>

          {/* Kontak: Telepon & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nomor Telepon / WhatsApp"
              placeholder="Contoh: 081234567890"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
            <Input
              label="Alamat E-mail"
              type="email"
              placeholder="Contoh: pasien@gmail.com"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
          </div>

          {/* Alamat Lengkap */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 tracking-wide block">Alamat Domisili</label>
            <textarea
              rows={3}
              placeholder="Contoh: RT 02/RW 03 Desa Linggasari, Kec. Kembaran"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all resize-none"
            />
          </div>

          {/* Status Diagnosis */}
          <Select
            label="Kategori / Status Klinis"
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value as Patient['status'])}
            options={[
              { value: 'Normal', label: 'Normal' },
              { value: 'Pra Hipertensi', label: 'Pra Hipertensi' },
              { value: 'Tingkat 1', label: 'Tingkat 1' },
              { value: 'Tingkat 2', label: 'Tingkat 2' }
            ]}
          />

          {/* Action buttons */}
          <div className="border-t border-slate-100 pt-4 flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>

      {/* OVERLAY MODULE: TAMBAH PASIEN BARU FORM MODAL */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Tambah Pasien Baru"
      >
        <form onSubmit={handleCreatePatient} className="space-y-4 text-left max-h-[60vh] overflow-y-auto pr-1">
          <Input
            label="Nama Lengkap"
            required
            placeholder="Contoh: Budi Santoso"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Usia (Tahun)"
              type="number"
              required
              min={1}
              max={120}
              placeholder="Contoh: 45"
              value={newAge}
              onChange={(e) => setNewAge(e.target.value === '' ? '' : Number(e.target.value))}
            />
            <Select
              label="Jenis Kelamin"
              value={newGender}
              onChange={(e) => setNewGender(e.target.value as 'L' | 'P')}
              options={[
                { value: 'L', label: 'Laki-laki' },
                { value: 'P', label: 'Perempuan' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nomor Telepon"
              placeholder="Contoh: 081234567890"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="Contoh: pasien@gmail.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 tracking-wide block">Alamat</label>
            <textarea
              rows={2}
              placeholder="Contoh: RT 01/RW 02 Desa Linggasari, Kec. Kembaran"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all resize-none"
            />
          </div>

          <Select
            label="Status Diagnosa Awal"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as Patient['status'])}
            options={[
              { value: 'Normal', label: 'Normal' },
              { value: 'Pra Hipertensi', label: 'Pra Hipertensi' },
              { value: 'Tingkat 1', label: 'Tingkat 1' },
              { value: 'Tingkat 2', label: 'Tingkat 2' }
            ]}
          />

          <div className="border-t border-slate-100 pt-4 flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Simpan Pasien
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
