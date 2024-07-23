import { create } from "zustand";
import {IUser} from "@/lib/user/model/IUser";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AuthState {
    user: IUser | null;
    token: string | null;
    setUser: (user: IUser) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) =>({
            user: null,
            token: null,
            setUser: (user: IUser) => {
                set({user, token: user ? user.token : null});
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    ),
);