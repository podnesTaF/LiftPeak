import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IProfile, ISocialMediaLink } from "@entities/user";
import { IGym } from "@entities/gym";

export interface profileState {
  gyms: IGym[] | null;
  profile: Partial<IProfile>;
  id: number | null;
  username: string | null;
  isFollowing: boolean | null;
  followersCount: number | null;
  followingsCount: number | null;
  setId: (id: number) => void;
  setGyms: (gyms: IGym[]) => void;
  setProfileField: <K extends keyof IProfile>(
    field: K,
    value: IProfile[K]
  ) => void;
  setUsername: (username: string) => void;
  setIsFollowing: (isFollowing: boolean) => void;
  setFollowersCount: (followersCount: number) => void;
  setFollowingsCount: (followingsCount: number) => void;
  addGym: (gym: IGym) => void;
  removeGym: (gym: IGym) => void;
  addLink: (socialMediaLink: ISocialMediaLink) => void;
  removeLink: (link: ISocialMediaLink) => void;
  isDuplicateGym: (gym: IGym) => boolean;
  resetProfile: () => void;
}

export const useProfileStore = create<profileState>()(
  persist(
    (set, get) => ({
      id: null,
      gyms: [],
      profile: {}, 
      username: null,
      isFollowing: null,
      followersCount: null,
      followingsCount: null,

      setId: (id: number) => set({ id }),
      setGyms: (gyms: IGym[]) => set({ gyms }),
      setUsername: (username: string) => set({ username }),
      setIsFollowing: (isFollowing: boolean) => set({ isFollowing }),
      setFollowersCount: (followersCount: number) => set({ followersCount }),
      setFollowingsCount: (followingsCount: number) =>
        set({ followingsCount }),

      setProfileField: (field, value) => {
        const currentProfile = get().profile || {};
        set({
          profile: {
            ...currentProfile,
            [field]: value,
          },
        });
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
        set({ gyms: filteredGyms });
      },

      isDuplicateGym: (gym: IGym) => {
        const currentGyms = get().gyms || [];
        return currentGyms.some((g) => g.address === gym.address);
      },

      addLink: (socialMediaLink: ISocialMediaLink) => {
        const currentProfile = get().profile || {};
        const currentLinks = currentProfile.socialMediaLinks || [];
        set({
          profile: {
            ...currentProfile,
            socialMediaLinks: [...currentLinks, socialMediaLink],
          },
        });
      },

      removeLink: (link: ISocialMediaLink) => {
        const currentProfile = get().profile || {};
        const currentLinks = currentProfile.socialMediaLinks || [];
        const filteredLinks = currentLinks.filter((l) => l.id !== link.id);
        set({
          profile: {
            ...currentProfile,
            socialMediaLinks: filteredLinks,
          },
        });
      },
      resetProfile: () => {
        set({
          id: null,
          gyms: [],
          profile: {},
          username: null,
          isFollowing: null,
          followersCount: null,
          followingsCount: null,
        })
      }
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
