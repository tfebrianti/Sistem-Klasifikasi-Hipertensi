import { create } from 'zustand';
import { ActivityNotification } from '../types';
import { notificationService } from '../services/notificationService';

interface NotificationState {
  notifications: ActivityNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await notificationService.getNotifications();
      set({
        notifications: data.notifications,
        unreadCount: data.unreadCount,
        isLoading: false,
      });
    } catch (e: any) {
      set({ isLoading: false, error: 'Gagal mengambil data pemberitahuan.' });
    }
  },

  markAllAsRead: async () => {
    try {
      // Optimistic state update for instant UI response
      set((state) => ({
        unreadCount: 0,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      }));
      await notificationService.markAllAsRead();
    } catch (e: any) {
      get().fetchNotifications();
    }
  },

  deleteNotification: async (id: number) => {
    try {
      // Optimistic state update
      const targetNotif = get().notifications.find((n) => n.id === id);
      const isUnread = targetNotif ? !targetNotif.isRead : false;

      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: isUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      }));
      
      await notificationService.deleteNotification(id);
    } catch (e: any) {
      get().fetchNotifications();
    }
  },
}));
