import React, { useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { usePatientStore } from '../../../stores/patientStore';
import { usePredictionStore } from '../../../stores/predictionStore';
import { useFacilityStore } from '../../../stores/facilityStore';
import { settingsService } from '../../../services/settingsService';
import { showConfirm, showAlert } from '../../../stores/dialogStore';

export function useSettings() {
  const { doctor, updateDoctor } = useAuthStore();
  const { facility, updateFacility } = useFacilityStore();
  const patients = usePatientStore((state) => state.patients);
  const records = usePredictionStore((state) => state.records);

  // 1. Profil Instansi, Faskes & Tenaga Medis
  const [pemerintahDaerah, setPemerintahDaerah] = useState(facility.pemerintahDaerah);
  const [dinasKesehatan, setDinasKesehatan] = useState(facility.dinasKesehatan);
  const [kotaPengesahan, setKotaPengesahan] = useState(facility.kotaPengesahan);

  const [docHospital, setDocHospital] = useState(facility.namaPuskesmas || doctor.hospital);
  const [kodePuskesmas, setKodePuskesmas] = useState(facility.kodePuskesmas);
  const [wilayahKerja, setWilayahKerja] = useState(facility.wilayahKerja);
  const [faskesAddress, setFaskesAddress] = useState(facility.alamat);
  const [faskesPhone, setFaskesPhone] = useState(facility.telepon);
  const [faskesEmail, setFaskesEmail] = useState(facility.email);
  const [akreditasi, setAkreditasi] = useState(facility.akreditasi);

  const [docName, setDocName] = useState(doctor.name || facility.namaDokter);
  const [docSpecialty, setDocSpecialty] = useState(doctor.specialty || facility.spesialisasiDokter);
  const [docSip, setDocSip] = useState(facility.sipDokter);

  // 2. Ubah Kata Sandi Akun
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // 3. Notifikasi Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'danger'>('success');

  const triggerToast = (msg: string, type: 'success' | 'danger' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Simpan Profil Faskes & Nakes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docSpecialty.trim() || !docHospital.trim()) {
      await showAlert({
        title: 'Data Belum Lengkap',
        message: 'Nama Tenaga Medis, Spesialisasi, dan Nama Puskesmas wajib diisi.',
        variant: 'warning',
      });
      return;
    }

    try {
      // 1. Simpan ke facilityStore (persisted in localStorage for reports, PDFs, sidebars, dashboard)
      updateFacility({
        pemerintahDaerah,
        dinasKesehatan,
        kotaPengesahan,
        namaPuskesmas: docHospital,
        kodePuskesmas,
        wilayahKerja,
        alamat: faskesAddress,
        telepon: faskesPhone,
        email: faskesEmail,
        akreditasi,
        namaDokter: docName,
        spesialisasiDokter: docSpecialty,
        sipDokter: docSip,
      });

      // 2. Sinkronkan ke authStore / profil backend
      await updateDoctor({
        name: docName,
        specialty: docSpecialty,
        hospital: docHospital,
      });

      localStorage.setItem('klinikal_doc_sip', docSip);
      localStorage.setItem('klinikal_faskes_address', faskesAddress);
      localStorage.setItem('klinikal_faskes_phone', faskesPhone);
      localStorage.setItem('klinikal_faskes_email', faskesEmail);

      triggerToast('Profil fasilitas kesehatan & nakes berhasil disimpan!', 'success');
    } catch (err: any) {
      triggerToast(err.message || 'Gagal memperbarui profil.', 'danger');
    }
  };

  // Ganti Kata Sandi
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Semua kolom kata sandi wajib diisi.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await settingsService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      triggerToast('Kata sandi akun Anda berhasil diperbarui!', 'success');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal mengubah kata sandi. Pastikan kata sandi lama benar.';
      setPasswordError(msg);
      triggerToast(msg, 'danger');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Unduh Backup Data Registri & Rekam Medis (JSON)
  const handleDownloadBackupJSON = () => {
    const backupData = {
      system: 'Klinikal Hipertensi CDSS',
      exportedAt: new Date().toISOString(),
      facility: {
        pemerintahDaerah,
        dinasKesehatan,
        kotaPengesahan,
        namaPuskesmas: docHospital,
        kodePuskesmas,
        wilayahKerja,
        alamat: faskesAddress,
        telepon: faskesPhone,
        email: faskesEmail,
        akreditasi,
        namaDokter: docName,
        spesialisasiDokter: docSpecialty,
        sipDokter: docSip,
      },
      clinician: docName,
      totalPatients: patients.length,
      totalRecords: records.length,
      patients: patients,
      records: records,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    const cleanFaskes = docHospital.toLowerCase().replace(/[^a-z0-9]/g, '_');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup_klinikal_hipertensi_${cleanFaskes}_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    triggerToast('File cadangan basis data (JSON) berhasil diunduh!', 'success');
  };

  // Unduh Laporan Rekapitulasi Medis (CSV)
  const handleDownloadRecapCSV = () => {
    const metaHeader = [
      `# REKAPITULASI DATA PASIEN & RIWAYAT PEMERIKSAAN HIPERTENSI`,
      `# Instansi: ${pemerintahDaerah} - ${dinasKesehatan}`,
      `# Fasilitas: ${docHospital} (Kode: ${kodePuskesmas})`,
      `# Alamat: ${faskesAddress} | Telp: ${faskesPhone} | Email: ${faskesEmail}`,
      `# Penanggung Jawab: ${docName} (${docSpecialty} - SIP: ${docSip})`,
      `# Tanggal Cetak: ${new Date().toLocaleString('id-ID')} WIB`,
      `#`,
    ].join('\r\n');

    const headers = [
      'No',
      'ID Pasien',
      'Nama Pasien',
      'Usia',
      'Gender',
      'Telepon',
      'Alamat',
      'Status Terakhir',
      'Terakhir Periksa',
      'Jumlah Riwayat Tensi',
    ];

    const rows = patients.map((p, idx) => [
      idx + 1,
      `"${p.id}"`,
      `"${p.name}"`,
      p.age,
      p.gender === 'L' ? 'Laki-laki' : 'Perempuan',
      `"${p.phone || '-'}"`,
      `"${p.address || '-'}"`,
      `"${p.status}"`,
      `"${p.lastChecked || '-'}"`,
      p.bpHistory ? p.bpHistory.length : 0,
    ]);

    const csvContent = '\uFEFF' + metaHeader + '\r\n' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const cleanFaskes = docHospital.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rekapitulasi_pasien_hipertensi_${cleanFaskes}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('Laporan rekapitulasi data pasien (CSV) berhasil diunduh!', 'success');
  };

  // Reset Database
  const handleResetDatabase = async () => {
    const confirmed = await showConfirm({
      title: 'Reset Database Sistem',
      message: 'PERINGATAN: Apakah Anda yakin ingin mereset seluruh database riwayat prediksi dan pasien ke setelan awal pabrik? Tindakan ini tidak dapat dibatalkan.',
      confirmText: 'Reset Database',
      cancelText: 'Batal',
      variant: 'danger',
    });

    if (confirmed) {
      try {
        await useSettingsStore.getState().resetDatabase();
        triggerToast('Database berhasil di-reset ke nilai default klinis.', 'success');
      } catch (e) {
        console.error('Failed to reset database:', e);
        await showAlert({
          title: 'Gagal Mereset Database',
          message: 'Gagal mereset database. Pastikan backend server Anda berjalan.',
          variant: 'danger',
        });
      }
    }
  };

  return {
    // Profil Instansi & Faskes
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

    // Tenaga Medis
    docName,
    setDocName,
    docSpecialty,
    setDocSpecialty,
    docSip,
    setDocSip,
    handleSaveProfile,

    // Ubah Password
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isChangingPassword,
    passwordError,
    handleChangePassword,

    // Cadangan Data & Reset
    totalPatients: patients.length,
    totalRecords: records.length,
    handleDownloadBackupJSON,
    handleDownloadRecapCSV,
    handleResetDatabase,

    // Toast
    showToast,
    toastMessage,
    toastType,
  };
}
