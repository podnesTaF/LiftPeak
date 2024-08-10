import { create } from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {IUser} from "@entities/user";

export interface AuthState {
    user: IUser | null;
    token: string | null;
    expiresAt: number | null;
    setUser: (user: IUser & {expiresAt: number} | null) => void;
    setToken: (token: string | null, expiresAt: number | null) => void;
    clearAuth: () => void;
    isTokenValid: () => boolean | null
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) =>({
            user: null,
            token: null,
            expiresAt: null,
            setUser: (user: IUser & {token?: string, expiresAt: number} | null) => {
                set({user, token: user ? user.token : null, expiresAt: user?.expiresAt});
            },
            setToken: (token: string | null) => {
                set({token});
            },
            clearAuth: async () => {
                await AsyncStorage.removeItem('token');
                set({user: null, token: null});
            },
            isTokenValid: () => {
                const {expiresAt} = get();
                if(!expiresAt) return null;
                return expiresAt > Date.now();
            }
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    ),
);