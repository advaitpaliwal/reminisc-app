// /stores/toastStore.ts
import { create } from 'zustand';

interface ToastNotification {
  message: string;
  description: string;
}

interface ToastStore {
  toastNotification: ToastNotification | null;
  setToastNotification: (notification: ToastNotification | null) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toastNotification: null,
  setToastNotification: (notification) => set({ toastNotification: notification }),
}));