import api from './api';
import { AIModelConfig, DoctorProfile } from '../types';

/**
 * Service API Pengaturan & Preferensi Sistem (Settings Service)
 * Mengelola konfigurasi model klinis, data akun profil dokter, kata sandi, dan pemeliharaan database.
 */
export const settingsService = {
  /**
   * Mengambil konfigurasi parameter model AI yang sedang aktif
   *
   * @returns {Promise<AIModelConfig>} Konfigurasi model (nama algoritma aktif, parameter pohon, dll.)
   */
  getConfig: async (): Promise<AIModelConfig> => {
    const response = await api.get<AIModelConfig>('/settings');
    return response.data;
  },

  /**
   * Memperbarui parameter model AI di backend
   *
   * @param {Partial<AIModelConfig>} config - Parameter konfigurasi baru yang ingin diperbarui
   * @returns {Promise<AIModelConfig>} Konfigurasi yang telah diperbarui
   */
  updateConfig: async (config: Partial<AIModelConfig>): Promise<AIModelConfig> => {
    const response = await api.put<AIModelConfig>('/settings', config);
    return response.data;
  },

  /**
   * Memperbarui informasi profil pengguna yang sedang masuk (nama, klinik, spesialisasi, kontak)
   *
   * @param {Omit<DoctorProfile, 'avatarUrl'> & { avatarUrl?: string }} profile - Data profil baru
   * @returns {Promise<DoctorProfile>} Data profil yang telah tersimpan
   */
  updateProfile: async (profile: Omit<DoctorProfile, 'avatarUrl'> & { avatarUrl?: string }): Promise<DoctorProfile> => {
    const response = await api.put<DoctorProfile>('/profile/update', profile);
    return response.data;
  },

  /**
   * Mengubah kata sandi akun pengguna dengan validasi kata sandi saat ini
   *
   * @param {Object} passwords - Kumpulan kata sandi
   * @param {string} passwords.current_password - Kata sandi lama pengguna
   * @param {string} passwords.new_password - Kata sandi baru minimal 6 karakter
   * @param {string} passwords.new_password_confirmation - Konfirmasi kecocokan kata sandi baru
   * @returns {Promise<{ message: string }>} Pesan status keberhasilan pembaruan kata sandi
   */
  changePassword: async (passwords: { current_password: string; new_password: string; new_password_confirmation: string }): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>('/profile/change-password', passwords);
    return response.data;
  },

  /**
   * Melakukan reset ulang database ke data sampel awal (Factory Reset)
   *
   * @returns {Promise<{ message: string }>} Pesan status keberhasilan reset database
   */
  resetDatabase: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/database/reset');
    return response.data;
  },
};

export default settingsService;
