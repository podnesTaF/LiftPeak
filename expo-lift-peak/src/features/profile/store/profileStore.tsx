import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IProfile, ISocialMediaLink } from "@entities/user";
import { IGym } from "@entities/gym";

export interface profileState {
  gyms: IGym[] | null;
  links: ISocialMediaLink[] | null;
  wallpaperUrl: string | undefined;
  avatarUrl: string | undefined;
  goal: string | undefined;
  setGyms: (gyms: IGym[]) => void;
  setLinks: (links: ISocialMediaLink[]) => void;
  setWallpaperUrl: (wallpaperUrl: string) => void;
  setAvatarUrl: (avatarUrl: string) => void;
  setGoal: (goal: string) => void;
  addGym: (gym: IGym) => void;
  addLink: (link: ISocialMediaLink) => void;
  removeGym: (gym: IGym) => void;
  removeLink: (link: ISocialMediaLink) => void;
}

export const useProfileStore = create<profileState>()(
  persist(
    (set, get) => ({
      gyms: null,
      links: null,
      wallpaperUrl: undefined,
      avatarUrl: undefined,
      goal: undefined,
      setGyms: (gyms: IGym[]) => {
        set({ gyms });
      },
      setLinks: (links: ISocialMediaLink[]) => {
        set({ links });
      },
      setWallpaperUrl: (wallpaperUrl: string) => {
        set({ wallpaperUrl });
      },
      setAvatarUrl: (avatarUrl: string) => {
        set({ avatarUrl });
      },
      setGoal: (goal: string) => {
        set({goal});
      }, 
      addGym: (gym: IGym) => {
        const currentGyms = get().gyms || [];
        set({ gyms: [...currentGyms, gym] });
      },
      removeGym: (gym: IGym) => {
        const currentGyms = get().gyms || [];
        const filteredGyms = currentGyms.filter(
          (g) => g.address !== gym.address
        );
        set({ gyms: [...filteredGyms] });
      },

      addLink: (link: ISocialMediaLink) => {
        const currentLinks = get().links || [];
        set({ links: [...currentLinks, link] });
      },
      removeLink: (link: ISocialMediaLink) => {
        const currentLinks = get().links || [];
        const filteredLinks = currentLinks.filter(
          (l) => l.platform !== link.platform
        );
        set({ links: [...filteredLinks] });
      },
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
