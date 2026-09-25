import api from './api';
import { Patient } from '../types';

/**
 * Service API Pasien (Patient Service)
 * Mengelola operasi CRUD (Create, Read, Update, Delete) data rekam medis pasien di database backend Laravel.
 */
export const patientService = {
  /**
   * Mengambil daftar seluruh pasien yang terdaftar di registri klinik.
   * Data diurutkan dari yang paling baru didaftarkan.
   *
   * @returns {Promise<Patient[]>} Daftar objek pasien lengkap beserta riwayat tekanan darah
   */
  getAll: async (): Promise<Patient[]> => {
    const response = await api.get<Patient[]>('/patients');
    return response.data;
  },

  /**
   * Mengambil detail profil satu pasien berdasarkan ID uniknya (contoh: 'PT-2023-001').
   *
   * @param {string} id - Identifier unik pasien
   * @returns {Promise<Patient>} Detail data demografi dan riwayat klinis pasien
   */
  getById: async (id: string): Promise<Patient> => {
    const response = await api.get<Patient>(`/patients/${id}`);
    return response.data;
  },

  /**
   * Mendaftarkan data pasien baru ke dalam database klinik.
   *
   * @param {Omit<Patient, 'id' | 'lastChecked' | 'bpHistory'>} data - Data demografi pasien baru
   * @returns {Promise<Patient>} Objek pasien yang baru dibuat lengkap dengan nomor rekam medis (ID)
   */
  create: async (data: Omit<Patient, 'id' | 'lastChecked' | 'bpHistory'>): Promise<Patient> => {
    const response = await api.post<Patient>('/patients', data);
    return response.data;
  },

  /**
   * Memperbarui informasi demografi atau status klinis pasien yang sudah ada.
   *
   * @param {string} id - ID unik pasien yang akan diperbarui
   * @param {Partial<Patient>} data - Data atribut yang ingin diubah (nama, umur, kontak, alamat, dll.)
   * @returns {Promise<Patient>} Data pasien yang telah diperbarui
   */
  update: async (id: string, data: Partial<Patient>): Promise<Patient> => {
    // Map camelCase status update fields to API if necessary, but API resources handle format
    const response = await api.put<Patient>(`/patients/${id}`, data);
    return response.data;
  },

  /**
   * Menghapus catatan pasien dari registri database.
   *
   * @param {string} id - ID unik pasien yang akan dihapus
   * @returns {Promise<{ message: string }>} Pesan konfirmasi keberhasilan penghapusan
   */
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/patients/${id}`);
    return response.data;
  },
};

export default patientService;
