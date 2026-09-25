import { useState, useMemo } from 'react';
import { usePredictionStore } from '../../../stores/predictionStore';
import { useAuthStore } from '../../../stores/authStore';
import { useFacilityStore } from '../../../stores/facilityStore';
import { showConfirm } from '../../../stores/dialogStore';
import { exportHistoryToPdf } from '../../../utils/exportPdf';

export function useHistory() {
  const { records, deleteRecord } = usePredictionStore();
  const doctor = useAuthStore((state) => state.doctor);
  const facility = useFacilityStore((state) => state.facility);
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const itemsPerPage = 5;

  // Filter records based on query matching ID, name or Patient ID
  const filtered = useMemo(() => {
    return records.filter(
      (r) =>
        r.patientName.toLowerCase().includes(filterText.toLowerCase()) ||
        r.id.toLowerCase().includes(filterText.toLowerCase()) ||
        r.patientId.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [records, filterText]);

  const totalPages = useMemo(() => {
    return Math.ceil(filtered.length / itemsPerPage);
  }, [filtered.length, itemsPerPage]);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  const paginated = useMemo(() => {
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [filtered, startIndex, itemsPerPage]);

  const handleExport = (format: 'PDF' | 'CSV') => {
    setExporting(true);
    if (format === 'CSV') {
      const metaHeader = [
        `# LAPORAN REKAPITULASI HASIL SKRINING KLINIS HIPERTENSI`,
        `# Instansi: ${facility.pemerintahDaerah} - ${facility.dinasKesehatan}`,
        `# Fasilitas Kesehatan: ${facility.namaPuskesmas} (Kode: ${facility.kodePuskesmas})`,
        `# Alamat: ${facility.alamat}`,
        `# Kontak: Telp ${facility.telepon} | Email ${facility.email}`,
        `# Penanggung Jawab: ${facility.namaDokter} (${facility.spesialisasiDokter} - SIP: ${facility.sipDokter})`,
        `# Tanggal Cetak: ${new Date().toLocaleString('id-ID')} WIB`,
        `#`,
      ].join('\n');

      const headers = [
        'ID Rekam',
        'ID Pasien',
        'Nama Pasien',
        'Usia',
        'Jenis Kelamin',
        'Berat Badan (kg)',
        'Tinggi Badan (cm)',
        'IMT (kg/m2)',
        'Sistolik (mmHg)',
        'Diastolik (mmHg)',
        'Tekanan Nadi PP (mmHg)',
        'Hasil Klasifikasi',
        'Skor Kepercayaan (%)',
        'Tanggal Pemeriksaan'
      ];
      const rows = filtered.map((r) => [
        r.id,
        r.patientId,
        `"${r.patientName.replace(/"/g, '""')}"`,
        r.age,
        r.gender === 'L' ? 'Laki-laki' : 'Perempuan',
        r.weight,
        r.height,
        r.bmi,
        r.systolic,
        r.diastolic,
        r.systolic - r.diastolic,
        `"${r.result}"`,
        r.confidenceScore,
        `"${r.date}"`
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,\uFEFF' +
        metaHeader +
        '\n' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const cleanFaskes = facility.namaPuskesmas.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const dateStr = new Date().toISOString().slice(0, 10);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `riwayat_skrining_hipertensi_${cleanFaskes}_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'PDF') {
      exportHistoryToPdf({
        records: filtered,
        facility,
        doctor,
        filterKeyword: filterText,
      });
    }

    setTimeout(() => {
      setExporting(false);
      setToastMessage(`Laporan riwayat klinis berhasil diexport (${format})!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 600);
  };

  const handleDeleteRecord = async (id: string) => {
    const confirmed = await showConfirm({
      title: 'Hapus Riwayat Pemeriksaan',
      message: 'Apakah Anda yakin ingin menghapus catatan riwayat prediksi ini dari sistem?',
      confirmText: 'Hapus Catatan',
      cancelText: 'Batal',
      variant: 'danger',
    });

    if (confirmed) {
      deleteRecord(id);
      // Adjust current page if we delete the last item on the page
      if (paginated.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return {
    records,
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
  };
}
