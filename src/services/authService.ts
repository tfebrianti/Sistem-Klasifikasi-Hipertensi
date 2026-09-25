import api from './api';
import { DoctorProfile } from '../types';

/**
 * Service API Otentikasi & Profil Dokter
 * Mengelola siklus sesi login, otentikasi berbasis Sanctum API Token, dan profil tenaga medis.
 */
export const authService = {
  /**
   * Melakukan otentikasi login pengguna (dokter / petugas klinik)
   *
   * @param {Object} credentials - Kredensial akun pengguna
   * @param {string} credentials.username - Nama pengguna akun
   * @param {string} credentials.password - Kata sandi akun
   * @returns {Promise<{ token: string; doctor: DoctorProfile }>} Token bearer autentikasi dan data profil dokter
   */
  login: async (credentials: { username: string; password: string }): Promise<{ token: string; doctor: DoctorProfile }> => {
    const response = await api.post<{ token: string; doctor: DoctorProfile }>('/login', credentials);
    return response.data;
  },

  /**
   * Mengambil data profil tenaga medis yang sedang aktif masuk ke dalam sistem
   *
   * @returns {Promise<DoctorProfile>} Objek profil dokter (nama, spesialisasi, NIP/SIP, klinik)
   */
  getProfile: async (): Promise<DoctorProfile> => {
    const response = await api.get<DoctorProfile>('/profile');
    return response.data;
  },

  /**
   * Mengakhiri sesi pengguna dan mencabut token otentikasi aktif di server
   *
   * @returns {Promise<{ message: string }>} Pesan konfirmasi keberhasilan logout
   */
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/logout');
    return response.data;
  },
};

export default authService;
