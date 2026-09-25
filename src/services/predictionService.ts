import api from './api';
import { PredictionRecord } from '../types';

/**
 * Payload data klinis yang dikirimkan ke endpoint klasifikasi
 */
export interface ClassifyPayload {
  usia: number;
  gender: 'L' | 'P';
  berat: number;
  tinggi: number;
  sistolik: number;
  diastolik: number;
  patientId?: string;
  patientName?: string;
  save?: boolean;
}

/**
 * Service API untuk mengelola klasifikasi prediksi Machine Learning dan riwayat diagnosis
 */
export const predictionService = {
  /**
   * Mengambil semua catatan riwayat klasifikasi dari database
   */
  getAll: async (): Promise<PredictionRecord[]> => {
    const response = await api.get<PredictionRecord[]>('/predictions');
    return response.data;
  },

  /**
   * Mengirimkan parameter klinis ke backend untuk diinferensi oleh model Machine Learning
   */
  classify: async (payload: ClassifyPayload): Promise<PredictionRecord> => {
    const response = await api.post<PredictionRecord>('/classify', payload);
    return response.data;
  },

  /**
   * Menghapus record riwayat prediksi berdasarkan ID
   */
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/predictions/${id}`);
    return response.data;
  },
};

export default predictionService;
