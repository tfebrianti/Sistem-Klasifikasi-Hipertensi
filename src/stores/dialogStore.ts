import { create } from 'zustand';

export type DialogVariant = 'danger' | 'warning' | 'info' | 'success';

export interface DialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
  isAlert?: boolean;
}

interface DialogState {
  isOpen: boolean;
  options: DialogOptions;
  resolvePromise: ((value: boolean) => void) | null;
  openDialog: (options: DialogOptions) => Promise<boolean>;
  confirm: () => void;
  cancel: () => void;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  isOpen: false,
  options: {
    title: '',
    message: '',
    confirmText: 'Konfirmasi',
    cancelText: 'Batal',
    variant: 'info',
    isAlert: false,
  },
  resolvePromise: null,

  openDialog: (options: DialogOptions) => {
    return new Promise<boolean>((resolve) => {
      set({
        isOpen: true,
        options: {
          confirmText: options.isAlert ? 'Mengerti' : 'Konfirmasi',
          cancelText: 'Batal',
          variant: 'info',
          ...options,
        },
        resolvePromise: resolve,
      });
    });
  },

  confirm: () => {
    const { resolvePromise } = get();
    if (resolvePromise) resolvePromise(true);
    set({ isOpen: false, resolvePromise: null });
  },

  cancel: () => {
    const { resolvePromise } = get();
    if (resolvePromise) resolvePromise(false);
    set({ isOpen: false, resolvePromise: null });
  },
}));

/**
 * Show a modern confirmation dialog returning a Promise<boolean>.
 * Resolves to `true` if confirmed, `false` if cancelled.
 */
export const showConfirm = (
  options: Omit<DialogOptions, 'isAlert'>
): Promise<boolean> => {
  return useDialogStore.getState().openDialog({ ...options, isAlert: false });
};

/**
 * Show a modern alert dialog returning a Promise<boolean> when dismissed.
 */
export const showAlert = (
  options: Omit<DialogOptions, 'isAlert' | 'cancelText'>
): Promise<boolean> => {
  return useDialogStore.getState().openDialog({ ...options, isAlert: true });
};
