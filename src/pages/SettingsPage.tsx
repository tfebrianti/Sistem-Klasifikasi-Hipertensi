import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  User,
  Building2,
  ShieldCheck,
  Database,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Save,
  Lock,
  FileSpreadsheet,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  FileBadge,
  Landmark,
  BadgeCheck,
  FileText,
  Sparkles,
  Award,
} from 'lucide-react';
import { useSettings } from '../features/settings/hooks/useSettings';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  const {
    // 1. Profil Instansi, Faskes & Nakes
    pemerintahDaerah,
    setPemerintahDaerah,
    dinasKesehatan,
    setDinasKesehatan,
    kotaPengesahan,
    setKotaPengesahan,

    docHospital,
    setDocHospital,
    kodePuskesmas,
    setKodePuskesmas,
    wilayahKerja,
    setWilayahKerja,
    faskesAddress,
    setFaskesAddress,
    faskesPhone,
    setFaskesPhone,
    faskesEmail,
    setFaskesEmail,
    akreditasi,
    setAkreditasi,

    docName,
    setDocName,
    docSpecialty,
    setDocSpecialty,
    docSip,
    setDocSip,
    handleSaveProfile,

    // 2. Ubah Password
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isChangingPassword,
    passwordError,
    handleChangePassword,

    // 3. Cadangan Data & Reset
    totalPatients,
    totalRecords,
    handleDownloadBackupJSON,
    handleDownloadRecapCSV,
    handleResetDatabase,

    // 4. Toast
    showToast,
    toastMessage,
    toastType,
  } = useSettings();

  // Helper date for signature preview
  const formattedToday = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 select-none relative text-left">
      {/* Toast Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-20 right-8 z-50 px-5 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2.5 border ${
              toastType === 'danger'
                ? 'bg-red-900 border-red-700 text-white'
                : 'bg-slate-900 border-slate-700 text-white'
            }`}
          >
            {toastType === 'danger' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Halaman Pengaturan */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Settings className="w-5 h-5 text-slate-100" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pengaturan Sistem</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Konfigurasi identitas faskes, hierarki kop laporan, nakes penanggung jawab, serta pemeliharaan sistem.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2.5 mt-6">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Building2 className={`w-4 h-4 ${activeTab === 'profile' ? 'text-white' : 'text-slate-500'}`} />
            <span>Profil Fasilitas Kesehatan & Nakes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
              activeTab === 'security'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${activeTab === 'security' ? 'text-white' : 'text-slate-500'}`} />
            <span>Keamanan Akun & Manajemen Data</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PROFIL FASILITAS KESEHATAN & TENAGA MEDIS */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Form Profil Faskes & Nakes (Left Column) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Bagian 1: Instansi Pemerintah & Daerah */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Landmark className="w-4.5 h-4.5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                      1. Instansi Pemerintahan & Pengesahan
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Hierarki instansi pembina yang tercantum pada baris atas kop surat dinas serta titimangsa pengesahan.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Pemerintah Daerah (Kabupaten / Kota)"
                    required
                    value={pemerintahDaerah}
                    onChange={(e) => setPemerintahDaerah(e.target.value)}
                    placeholder="Contoh: PEMERINTAH KABUPATEN BANYUMAS"
                    helperText="Tingkat pemerintah daerah pengampu faskes"
                  />
                  <Input
                    label="Dinas Kesehatan"
                    required
                    value={dinasKesehatan}
                    onChange={(e) => setDinasKesehatan(e.target.value)}
                    placeholder="Contoh: DINAS KESEHATAN KABUPATEN BANYUMAS"
                    helperText="Satuan kerja perangkat daerah bidang kesehatan"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  <Input
                    label="Kota / Wilayah Titimangsa Pengesahan"
                    required
                    value={kotaPengesahan}
                    onChange={(e) => setKotaPengesahan(e.target.value)}
                    placeholder="Contoh: Banyumas"
                    helperText="Kota penandatanganan laporan (misal: Banyumas, 23 September 2026)"
                  />
                  <Input
                    label="Status Akreditasi Fasilitas"
                    value={akreditasi}
                    onChange={(e) => setAkreditasi(e.target.value)}
                    placeholder="Contoh: Paripurna"
                    helperText="Tingkat mutu faskes (misal: Paripurna, Utama, Madya)"
                    icon={<Award className="w-4 h-4 text-slate-400" />}
                  />
                </div>
              </div>

              {/* Bagian 2: Identitas Puskesmas / Faskes */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-4.5 h-4.5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                      2. Identitas Fasilitas Kesehatan (Puskesmas)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Identitas operasional faskes primer yang otomatis sinkron ke kop surat laporan, file Excel/CSV, dan sidebar.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-8">
                    <Input
                      label="Nama Fasilitas Kesehatan (Puskesmas)"
                      required
                      value={docHospital}
                      onChange={(e) => setDocHospital(e.target.value)}
                      placeholder="Contoh: Puskesmas 1 Kembaran"
                      helperText="Nama resmi satuan fasilitas pelayanan kesehatan"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <Input
                      label="Kode Registrasi Puskesmas"
                      value={kodePuskesmas}
                      onChange={(e) => setKodePuskesmas(e.target.value)}
                      placeholder="Contoh: P3302110101"
                      helperText="Kode registrasi faskes resmi Kemenkes"
                    />
                  </div>
                </div>

                {/* Alamat Lengkap Faskes - Full Width */}
                <div>
                  <Input
                    label="Alamat Lengkap Wilayah Kerja"
                    value={faskesAddress}
                    onChange={(e) => setFaskesAddress(e.target.value)}
                    placeholder="Contoh: Jl. Raya Kembaran No. 1, Kec. Kembaran, Kab. Banyumas, Jawa Tengah 53182"
                    helperText="Alamat jalan, nomor, kecamatan, kabupaten, dan kode pos faskes"
                    icon={<MapPin className="w-4 h-4 text-slate-400" />}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Nomor Telepon / Kontak Layanan"
                    value={faskesPhone}
                    onChange={(e) => setFaskesPhone(e.target.value)}
                    placeholder="Contoh: (0281) 6844123"
                    helperText="Nomor telepon operasional yang dapat dihubungi"
                    icon={<Phone className="w-4 h-4 text-slate-400" />}
                  />
                  <Input
                    label="Alamat Email Resmi Puskesmas"
                    type="email"
                    value={faskesEmail}
                    onChange={(e) => setFaskesEmail(e.target.value)}
                    placeholder="Contoh: pusk.kembaran1@banyumaskab.go.id"
                    helperText="Email kedinasan faskes untuk korespondensi resmi"
                    icon={<Mail className="w-4 h-4 text-slate-400" />}
                  />
                </div>

                <div>
                  <Input
                    label="Cakupan Wilayah Binaan Kerja"
                    value={wilayahKerja}
                    onChange={(e) => setWilayahKerja(e.target.value)}
                    placeholder="Contoh: Kec. Kembaran (16 Desa)"
                    helperText="Cakupan administratif wilayah binaan puskesmas"
                  />
                </div>
              </div>

              {/* Bagian 3: Tenaga Medis Penanggung Jawab */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4.5 h-4.5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                      3. Tenaga Medis Penanggung Jawab Klinis
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pejabat medis yang bertanggung jawab dan namanya tertera pada lembar tanda tangan dokumen pengesahan.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Nama Lengkap Tenaga Medis"
                    required
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="Contoh: dr. Triana Wulandari, S.Ked"
                    helperText="Sertakan gelar akademik atau gelar profesi dokter"
                  />
                  <Input
                    label="Spesialisasi / Jabatan Klinis"
                    required
                    value={docSpecialty}
                    onChange={(e) => setDocSpecialty(e.target.value)}
                    placeholder="Contoh: Dokter Penanggung Jawab Klinis"
                    helperText="Jabatan penanggung jawab medis di faskes"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Nomor Surat Izin Praktik (SIP / STR)"
                    value={docSip}
                    onChange={(e) => setDocSip(e.target.value)}
                    placeholder="Contoh: 503/446/SIP.D/2024"
                    helperText="Nomor legalitas izin praktik resmi yang masih aktif"
                    icon={<BadgeCheck className="w-4 h-4 text-slate-400" />}
                  />
                </div>
              </div>

              {/* Tombol Simpan Profil */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Perubahan langsung tersinkronisasi ke seluruh dokumen PDF, CSV, dan tampilan sistem.</span>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2 text-xs font-semibold shadow-xs shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan Sistem</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Kolom Pratinjau Kredensial & Kop Resmi (Right Column) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-6 space-y-5 self-start">
            {/* Header Simulator Lembar Kerja */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileBadge className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Pratinjau Kop Laporan (PDF)
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Preview
                </span>
              </div>

              {/* Lembar Simulasi Kop Dokumen A4 */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
                {/* Header Instansi */}
                <div className="text-center space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-700 leading-tight uppercase tracking-wider">
                    {pemerintahDaerah || 'PEMERINTAH KABUPATEN BANYUMAS'}
                  </p>
                  <p className="text-[10px] font-bold text-slate-800 leading-tight uppercase tracking-wider">
                    {dinasKesehatan || 'DINAS KESEHATAN KABUPATEN BANYUMAS'}
                  </p>
                  <p className="text-xs font-extrabold text-blue-950 leading-tight uppercase tracking-wide mt-1">
                    {docHospital || 'PUSKESMAS 1 KEMBARAN'}
                  </p>
                  <p className="text-[9px] text-slate-600 leading-relaxed mt-1">
                    {faskesAddress || 'Jl. Raya Kembaran No. 1, Kec. Kembaran, Kab. Banyumas, Jawa Tengah 53182'}
                  </p>
                  <p className="text-[9px] text-slate-600 leading-relaxed">
                    Telp: {faskesPhone || '(0281) 6844123'} &bull; Email: {faskesEmail || 'pusk.kembaran1@banyumaskab.go.id'}
                  </p>
                </div>

                {/* Garis Ganda Kop Surat Resmi */}
                <div className="pt-1">
                  <div className="border-b-2 border-slate-900"></div>
                  <div className="border-b border-slate-500 mt-[1.5px]"></div>
                </div>

                {/* Judul Dokumen Contoh */}
                <div className="text-center pt-1 pb-1">
                  <p className="text-[9px] font-bold text-slate-800 uppercase tracking-wide">
                    LEMBAR HASIL ANALISIS TINGKAT RISIKO HIPERTENSI
                  </p>
                  <p className="text-[8px] text-slate-400 font-mono">
                    NO. REG: MED-{new Date().getFullYear()}/REC-001
                  </p>
                </div>

                {/* Pratinjau Tanda Tangan Dokter */}
                <div className="pt-2 border-t border-dashed border-slate-200 flex justify-end">
                  <div className="text-right space-y-1 text-[9px] min-w-[170px]">
                    <p className="text-slate-600">
                      {kotaPengesahan || 'Banyumas'}, {formattedToday}
                    </p>
                    <p className="font-medium text-slate-700">
                      {docSpecialty || 'Dokter Penanggung Jawab Klinis'}
                    </p>
                    <div className="py-2.5 flex justify-end">
                      <div className="px-2.5 py-1 rounded border border-emerald-200 bg-emerald-50/80 text-[8px] font-semibold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        <span>Validasi Digital Terverifikasi</span>
                      </div>
                    </div>
                    <p className="font-bold text-slate-900 underline text-[10px]">
                      {docName || 'dr. Triana Wulandari, S.Ked'}
                    </p>
                    <p className="text-slate-500">
                      SIP: {docSip || '503/446/SIP.D/2024'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rangkuman Detail Metadata */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Kode Registrasi:</span>
                  <span className="font-semibold text-slate-800">{kodePuskesmas || '-'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Status Akreditasi:</span>
                  <span className="font-semibold text-slate-800">{akreditasi || '-'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Cakupan Wilayah:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[180px]">{wilayahKerja || '-'}</span>
                </div>
              </div>

              {/* Banner Sinkronisasi */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-blue-800">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Sinkronisasi Otomatis Antar Modul</span>
                </div>
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Semua data yang disimpan pada halaman ini langsung memperbarui:
                </p>
                <ul className="text-[11px] text-blue-800/90 list-disc list-inside space-y-0.5 pl-0.5">
                  <li>Tajuk Kop & Tanda Tangan Berkas Ekspor PDF</li>
                  <li>Metadata Header Lembar Rekapitulasi CSV / Excel</li>
                  <li>Identitas Puskesmas pada Bilah Navigasi Samping</li>
                  <li>Profil & Nama Dokter pada Bilah Atas Aplikasi</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KEAMANAN AKUN & CADANGAN DATA */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ubah Kata Sandi Akun */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4.5 h-4.5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Keamanan Akun (Ganti Kata Sandi)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Perbarui kata sandi masuk akun tenaga medis untuk menjaga integritas rekam medis pasien.
                  </p>
                </div>
              </div>

              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <Input
                  label="Kata Sandi Saat Ini"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan kata sandi lama Anda"
                  helperText="Dibutuhkan untuk verifikasi kepemilikan akun"
                />

                <Input
                  label="Kata Sandi Baru"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter kombinasi"
                  helperText="Gunakan kombinasi huruf, angka, dan simbol untuk keamanan maksimal"
                />

                <Input
                  label="Konfirmasi Kata Sandi Baru"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  helperText="Pastikan sama persis dengan kata sandi baru di atas"
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isChangingPassword}
                    className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-semibold shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isChangingPassword ? 'Menyimpan...' : 'Perbarui Kata Sandi Akun'}</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* Cadangan Basis Data & Ekspor */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Database className="w-4.5 h-4.5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      Cadangan & Rekapitulasi Basis Data
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Unduh salinan data rekam medis untuk keperluan arsip faskes atau pelaporan dinas kesehatan.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 py-1">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-[11px] font-semibold text-slate-400 block">Total Pasien Terdaftar</span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">{totalPatients}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-[11px] font-semibold text-slate-400 block">Riwayat Pemeriksaan</span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">{totalRecords}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadBackupJSON}
                    className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                  >
                    <span className="flex items-center gap-2.5">
                      <Download className="w-4 h-4 text-slate-600" />
                      <span>Unduh Cadangan Basis Data (JSON)</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200/80 text-slate-600">Full Backup</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadRecapCSV}
                    className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                  >
                    <span className="flex items-center gap-2.5">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>Unduh Rekapitulasi Pasien (CSV / Excel)</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Format Laporan</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Berkas cadangan mencakup konfigurasi faskes, identitas pasien terdaftar, serta parameter klinikal lengkap berstandar UTF-8.
                </p>
              </div>
            </div>
          </div>

          {/* Zona Pemeliharaan Sistem (Danger Zone) */}
          <div className="bg-red-50/40 border border-red-200 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Zona Pemeliharaan Sistem (Danger Zone)</span>
                </h4>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  Mereset seluruh basis data ke kondisi awal faskes (demo bawaan). Seluruh data pasien baru dan histori klasifikasi manual akan dibersihkan secara permanen.
                </p>
              </div>

              <Button
                onClick={handleResetDatabase}
                type="button"
                variant="danger"
                className="px-5 py-2.5 text-xs flex items-center gap-2 shrink-0 shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Database Bawaan</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
