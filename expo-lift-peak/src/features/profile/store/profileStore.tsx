import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IProfile, ISocialMediaLink } from "@entities/user";
import { IGym } from "@entities/gym";

export interface profileState {
  gyms: IGym[] | null;
  links: ISocialMediaLink[] | null;
  addGym: (gym: IGym) => void;
  removeGym: (gym: IGym) => void;
  addLink: (link: ISocialMediaLink) => void;
  removeLink: (link: ISocialMediaLink) => void;
}

export const useProfileStore = create<profileState>()(
  persist(
    (set, get) => ({
      gyms: null,
      links: null,
      addGym: (gym: IGym) => {
        const currentGyms = get().gyms || [];
        set({ gyms: [...currentGyms, gym] });
      },
      removeGym: (gym: IGym) => {
        const currentGyms = get().gyms || [];
        const filteredGyms = currentGyms.filter(g => g.address !== gym.address)
        set({gyms: [...filteredGyms]});
      },
      addLink: (link: ISocialMediaLink) => {
        const currentLinks = get().links || [];
        set({links: [...currentLinks, link]});
      },
      removeLink: (link: ISocialMediaLink) => {
        const currentLinks = get().links || [];
        const filteredLinks = currentLinks.filter(l => l.platform !== link.platform)
        set({links: [...filteredLinks]});
      }
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
