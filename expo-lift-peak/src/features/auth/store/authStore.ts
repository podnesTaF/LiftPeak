import { create } from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {IProfile, IUser} from "@entities/user";
import { useProfileStore } from "@features/profile/store";

export interface AuthState {
    user: IUser | null;
    token: string | null;
    expiresAt: number | null;
    isExtended: boolean;
    extendUser: (user: IUser) => void;
    setUser: (user: IUser & {expiresAt: number} | null) => void;
    setToken: (token: string | null, expiresAt: number | null) => void;
    updateUser: (updateFields: Partial<IUser>) => void;
    updateProfile: (updateFields: Partial<IProfile>) => void;
    clearAuth: () => void;
    isTokenValid: () => boolean | null
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) =>({
            user: null,
            profile: null,
            token: null,
            isExtended: false,
            expiresAt: null,
            setUser: (user: IUser & {token?: string, expiresAt: number} | null) => {
                set({user, token: user ? user.token : null, expiresAt: user?.expiresAt});
            },
            extendUser: (user: IUser) => {
                const {resetProfile} = useProfileStore.getState();
                resetProfile();
                set({user, isExtended: true});
            },
            updateUser: (updateFields) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({
                        user: {
                            ...currentUser,
                            ...updateFields,
                        },
                    });
                }
            },
            updateProfile: (updateFields) => {
                const user =  get().user
                const profile = user?.profile;
                if (profile) {
                    set({
                        user: {
                            ...user,
                            profile: {
                                ...profile,
                                ...updateFields
                            }
                        }
                    });
                }
            },
            setToken: (token: string | null) => {
                set({token});
            },
            clearAuth: async () => {
                const {resetProfile} = useProfileStore.getState();
                resetProfile();
                await AsyncStorage.removeItem('token');
                set({user: null, token: null, isExtended: false});
            },
            isTokenValid: () => {
                const {expiresAt} = get();
                if(!expiresAt) return null;
                return expiresAt > Date.now();
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    ),
);