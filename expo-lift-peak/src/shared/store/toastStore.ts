import {create} from 'zustand';

interface ToastState {
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    show: boolean;
    time?: number,
    showToast: (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning', time?: number) => void;
    hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
    title: '',
    message: '',
    type: 'info',
    show: false,
    time: 2000,
    showToast: (title, message, type, time) => {
        set({ title, message, type, show: true, time: time || 2000 });
    },
    hideToast: () => {
        set({ show: false });
    },
}));