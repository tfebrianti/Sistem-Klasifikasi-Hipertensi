import { create } from 'zustand';
import { Patient } from '../types';
import { initialPatients } from '../constants/mockData';
import { patientService } from '../services/patientService';
import { useNotificationStore } from './notificationStore';

interface PatientState {
  patients: Patient[];
  isLoading: boolean;
  error: string | null;
  fetchPatients: () => Promise<void>;
  addPatient: (newPat: Omit<Patient, 'id' | 'lastChecked' | 'bpHistory'>) => Promise<Patient>;
  deletePatient: (id: string) => Promise<void>;
  editPatient: (updatedPat: Patient) => Promise<void>;
  updatePatientStatus: (patientId: string, patientName: string, status: Patient['status'], systolic: number, diastolic: number) => void;
  resetPatients: () => void;
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  isLoading: false,
  error: null,

  fetchPatients: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await patientService.getAll();
      set({ patients: data, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: 'Gagal mengambil data pasien.' });
    }
  },

  addPatient: async (newPat) => {
    set({ isLoading: true, error: null });
    try {
      const savedPatient = await patientService.create(newPat);
      set((state) => ({
        patients: [savedPatient, ...state.patients],
        isLoading: false,
      }));
      useNotificationStore.getState().fetchNotifications();
      return savedPatient;
    } catch (e: any) {
      console.warn('Backend server offline. Menjalankan penyimpanan pasien lokal...');
      const simulatedId = 'PT-2023-' + String(Math.floor(Math.random() * 900 + 100));
      const currentMonth = new Date().toLocaleString('id-ID', { month: 'short' });
      const savedPatient: Patient = {
        ...newPat,
        id: simulatedId,
        lastChecked: new Date().toISOString().split('T')[0],
        bpHistory: [
          { date: currentMonth, systolic: 120, diastolic: 80 }
        ],
        phone: newPat.phone || '',
        email: newPat.email || '',
        address: newPat.address || '',
      };
      set((state) => ({
        patients: [savedPatient, ...state.patients],
        isLoading: false,
      }));
      return savedPatient;
    }
  },

  deletePatient: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await patientService.delete(id);
      set((state) => ({
        patients: state.patients.filter((p) => p.id !== id),
        isLoading: false,
      }));
      useNotificationStore.getState().fetchNotifications();
    } catch (e: any) {
      set({ isLoading: false, error: 'Gagal menghapus data pasien.' });
      throw e;
    }
  },

  editPatient: async (updatedPat) => {
    set({ isLoading: true, error: null });
    try {
      const savedPatient = await patientService.update(updatedPat.id, updatedPat);
      set((state) => ({
        patients: state.patients.map((p) => (p.id === savedPatient.id ? savedPatient : p)),
        isLoading: false,
      }));
      useNotificationStore.getState().fetchNotifications();
    } catch (e: any) {
      set({ isLoading: false, error: 'Gagal memperbarui data pasien.' });
      throw e;
    }
  },

  updatePatientStatus: (patientId, patientName, status, systolic, diastolic) =>
    set((state) => ({
      patients: state.patients.map((p) => {
        if (p.id === patientId || p.name.toLowerCase() === patientName.toLowerCase()) {
          const currentMonth = new Date().toLocaleString('id-ID', { month: 'short' });
          return {
            ...p,
            status: status,
            lastChecked: new Date().toISOString().split('T')[0],
            bpHistory: [
              ...p.bpHistory.slice(1),
              { date: currentMonth, systolic, diastolic }
            ]
          };
        }
        return p;
      })
    })),

  resetPatients: () =>
    set(() => ({
      patients: initialPatients,
      error: null,
    })),
}));
