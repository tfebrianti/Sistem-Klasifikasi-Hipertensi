import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FacilityConfig {
  // 1. Instansi & Daerah
  pemerintahDaerah: string;
  dinasKesehatan: string;
  kotaPengesahan: string;

  // 2. Identitas Fasilitas Kesehatan (Puskesmas)
  namaPuskesmas: string;
  kodePuskesmas: string;
  wilayahKerja: string;
  alamat: string;
  telepon: string;
  email: string;
  akreditasi: string;

  // 3. Tenaga Medis Penanggung Jawab
  namaDokter: string;
  spesialisasiDokter: string;
  sipDokter: string;
}

export const defaultFacilityConfig: FacilityConfig = {
  pemerintahDaerah: 'PEMERINTAH KABUPATEN BANYUMAS',
  dinasKesehatan: 'DINAS KESEHATAN KABUPATEN BANYUMAS',
  kotaPengesahan: 'Banyumas',

  namaPuskesmas: 'Puskesmas 1 Kembaran',
  kodePuskesmas: 'P3302110101',
  wilayahKerja: 'Kec. Kembaran (16 Desa)',
  alamat: 'Jl. Raya Kembaran No. 1, Kec. Kembaran, Kab. Banyumas, Jawa Tengah 53182',
  telepon: '(0281) 6844123',
  email: 'pusk.kembaran1@banyumaskab.go.id',
  akreditasi: 'Paripurna',

  namaDokter: 'dr. Triana Wulandari, S.Ked',
  spesialisasiDokter: 'Dokter Penanggung Jawab Klinis',
  sipDokter: '503/446/SIP.D/2024',
};

interface FacilityState {
  facility: FacilityConfig;
  updateFacility: (config: Partial<FacilityConfig>) => void;
  resetFacility: () => void;
}

export const useFacilityStore = create<FacilityState>()(
  persist(
    (set) => ({
      facility: defaultFacilityConfig,
      updateFacility: (newConfig) =>
        set((state) => ({
          facility: { ...state.facility, ...newConfig },
        })),
      resetFacility: () => set({ facility: defaultFacilityConfig }),
    }),
    {
      name: 'klinikal_facility_config',
    }
  )
);
