import api from './api';
import { ActivityNotification } from '../types';

/**
 * Respons pengambilan notifikasi aktivitas dari server
 */
interface GetNotificationsResponse {
  notifications: ActivityNotification[];
  unreadCount: number;
}

/**
 * Service API Notifikasi Aktivitas Klinis
 * Mengelola riwayat pemberitahuan aktivitas sistem seperti pendaftaran pasien, hasil klasifikasi, dan peringatan klinis.
 */
export const notificationService = {
  /**
   * Mengambil daftar notifikasi terbaru milik pengguna yang sedang login
   *
   * @returns {Promise<GetNotificationsResponse>} Daftar objek notifikasi dan jumlah yang belum dibaca
   */
  getNotifications: async (): Promise<GetNotificationsResponse> => {
    const response = await api.get<GetNotificationsResponse>('/notifications');
    return response.data;
  },

  /**
   * Menandai seluruh pemberitahuan yang belum dibaca sebagai sudah dibaca
   *
   * @returns {Promise<{ message: string }>} Pesan status keberhasilan pembaruan
   */
  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/notifications/read-all');
    return response.data;
  },

  /**
   * Menghapus satu entri notifikasi berdasarkan ID uniknya
   *
   * @param {number} id - ID notifikasi yang ingin dihapus
   * @returns {Promise<{ message: string }>} Pesan konfirmasi keberhasilan penghapusan
   */
  deleteNotification: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/notifications/${id}`);
    return response.data;
  },
};

export default notificationService;
