import {create} from "zustand";

interface NotificationState {
    unreadCount: number,
    updateUnreadCount: (count: number) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
    unreadCount: 0,
    updateUnreadCount: (count: number) => {
        set({unreadCount: count})
    }
}));