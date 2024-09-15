import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useAuthStore } from "@features/auth";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@features/profile";
import { Colors } from "@shared/styles";
import AvatarPicker from "@features/profile/ui/AvatarPicker";
import WallpaperPicker from "@features/profile/ui/WallpaperPicker";
import { FormProvider, useForm } from "react-hook-form";
import ProfileForm from "@features/profile/ui/ProfileForm";
import { ProfileRequest } from "@features/profile/utils/profile.schema";

const Profile = () => {
  const { user } = useAuthStore();

  const { data } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUserInfo(user?.id),
    enabled: !!user?.id,
  });

  if (!data) {
    return null;
  }

  const handleAvatarPick = (mediaUri: string) => {
    console.log("Avatar picked:", mediaUri);
  };

  const handleWallpaperPick = (mediaUri: string) => {
    console.log("Wallpaper picked:", mediaUri);
  };

  const form = useForm<ProfileRequest>({
    mode: "onChange",
    defaultValues: {
      goal: data.profile?.goal || "",
      gym: data.gyms || [],
      socialMediaLinks:
        data.profile?.socialMediaLinks?.map((link) => link.url) || [], // Extract only the URLs
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <FormProvider {...form}>
        <ScrollView
          style={{ backgroundColor: Colors.dark700, flex: 1 }}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <WallpaperPicker
            wallpaperUrl={data.profile?.wallpaperUrl}
            onWallpaperPick={handleWallpaperPick}
          />
          <AvatarPicker
            avatarUrl={data.profile?.avatarUrl}
            usernameInitial={data.username[0]}
            onAvatarPick={handleAvatarPick}
          />
          <ProfileForm />
        </ScrollView>
      </FormProvider>
    </KeyboardAvoidingView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 100,
  },
});
