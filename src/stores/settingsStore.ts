import { create } from 'zustand';
import { AIModelConfig } from '../types';
import { defaultModelConfig } from '../constants/mockData';
import { settingsService } from '../services/settingsService';
import { usePatientStore } from './patientStore';
import { usePredictionStore } from './predictionStore';
import { useNotificationStore } from './notificationStore';

interface SettingsState {
  modelConfig: AIModelConfig;
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateModelConfig: (config: Partial<AIModelConfig>) => Promise<void>;
  resetDatabase: () => Promise<void>;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  modelConfig: defaultModelConfig,
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await settingsService.getConfig();
      set({ modelConfig: data, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: 'Gagal mengambil konfigurasi AI.' });
    }
  },

  updateModelConfig: async (config) => {
    set({ isLoading: true, error: null });
    try {
      const updatedConfig = await settingsService.updateConfig(config);
      set({ modelConfig: updatedConfig, isLoading: false });
      useNotificationStore.getState().fetchNotifications();
    } catch (e: any) {
      set({ isLoading: false, error: 'Gagal menyimpan konfigurasi AI.' });
      throw e;
    }
  },

  resetDatabase: async () => {
    set({ isLoading: true, error: null });
    try {
      await settingsService.resetDatabase();
      
      // Re-fetch fresh data from the newly seeded database
      await usePatientStore.getState().fetchPatients();
      await usePredictionStore.getState().fetchRecords();
      await useNotificationStore.getState().fetchNotifications();
      const freshConfig = await settingsService.getConfig();
      set({ modelConfig: freshConfig, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: 'Gagal mereset database klinis.' });
      throw e;
    }
  },

  resetSettings: () =>
    set(() => ({
      modelConfig: defaultModelConfig,
      error: null,
    })),
}));
