import { create } from 'zustand';
import { DoctorProfile } from '../types';
import { defaultDoctor } from '../constants/mockData';
import { authService } from '../services/authService';
import { settingsService } from '../services/settingsService';
import { useNotificationStore } from './notificationStore';
import api from '../services/api';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  doctor: DoctorProfile;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateDoctor: (updatedDoctor: Omit<DoctorProfile, 'avatarUrl'> & { avatarUrl?: string }) => Promise<void>;
  clearError: () => void;
}

// Retrieve initial token if available in localStorage
const initialToken = localStorage.getItem('token');
const savedDoctorJson = localStorage.getItem('doctor');
const initialDoctor = savedDoctorJson ? JSON.parse(savedDoctorJson) : defaultDoctor;

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!initialToken,
  token: initialToken,
  doctor: initialDoctor,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('token', data.token);
      localStorage.setItem('doctor', JSON.stringify(data.doctor));
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      set({
        isLoggedIn: true,
        token: data.token,
        doctor: data.doctor,
        isLoading: false,
      });
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || 'Gagal login. Periksa koneksi server.';
      set({ isLoading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (e) {
      // Proceed with local logout even if server request fails (token expired/invalid)
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('doctor');
      delete api.defaults.headers.common['Authorization'];
      set({
        isLoggedIn: false,
        token: null,
        doctor: defaultDoctor,
        isLoading: false,
        error: null,
      });
    }
  },

  updateDoctor: async (profile) => {
    set({ isLoading: true, error: null });
    try {
      const updatedDoctor = await settingsService.updateProfile(profile);
      localStorage.setItem('doctor', JSON.stringify(updatedDoctor));
      set({
        doctor: updatedDoctor,
        isLoading: false,
      });
      useNotificationStore.getState().fetchNotifications();
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || 'Gagal mengupdate profil dokter.';
      set({ isLoading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  clearError: () => set({ error: null }),
}));
