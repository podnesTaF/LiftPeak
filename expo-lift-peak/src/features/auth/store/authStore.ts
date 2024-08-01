import { create } from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {IUser} from "@entities/user";

export interface AuthState {
    user: IUser | null;
    token: string | null;
    setUser: (user: IUser | null) => void;
    setToken: (token: string | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) =>({
            user: null,
            token: null,
            setUser: (user: IUser & {token?: string} | null) => {
                set({user, token: user ? user.token : null});
            },
            setToken: (token: string | null) => {
                set({token});
            },
            clearAuth: async () => {
                await AsyncStorage.removeItem('token');
                set({user: null, token: null});
            }
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    ),
);