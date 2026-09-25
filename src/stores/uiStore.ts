import { create } from 'zustand';

interface UIState {
  isOpenMobile: boolean;
  setIsOpenMobile: (isOpen: boolean) => void;
  toggleOpenMobile: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isOpenMobile: false,
  setIsOpenMobile: (isOpen) => set({ isOpenMobile: isOpen }),
  toggleOpenMobile: () => set((state) => ({ isOpenMobile: !state.isOpenMobile })),
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
