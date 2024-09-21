import React, { useCallback, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useAuthStore } from "@features/auth";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@features/profile";
import { Colors } from "@shared/styles";
import AvatarPicker from "@features/profile/ui/AvatarPicker";
import WallpaperPicker from "@features/profile/ui/WallpaperPicker";
import ProfileForm from "@features/profile/ui/ProfileForm";
import { useProfileStore } from "@features/profile/store";
import { useNavigation } from "expo-router";

const Profile = () => {
  const { user } = useAuthStore();
  const {setProfileField, setGyms,profile, gyms} = useProfileStore();
  const navigation = useNavigation();

  const { data } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUserInfo(user?.id),
    enabled: !!user?.id,
  });

  const handleSetProfile = useCallback(() => {
    if (data?.profile) {
      const { avatarUrl, wallpaperUrl, socialMediaLinks, goal } = data?.profile;
  
      if (avatarUrl) setProfileField("avatarUrl", avatarUrl);
      if (wallpaperUrl) setProfileField("wallpaperUrl", wallpaperUrl);
      if (socialMediaLinks) setProfileField("socialMediaLinks", socialMediaLinks);
      if (goal) setProfileField("goal", goal);
    }
  
    if (data?.gyms) setGyms(data.gyms);
  }, [data, setProfileField, setGyms]);

  useEffect(() => {
    handleSetProfile();
  }, [data, handleSetProfile]);


  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity>
          <Text style={{fontSize: 17, color: Colors.successLight, paddingEnd: 5}}>Save</Text>
        </TouchableOpacity>
      )
    })
  }, [navigation, profile?.avatarUrl, profile?.wallpaperUrl, profile?.socialMediaLinks, gyms, profile?.goal])

  

  if (!data) {
    return null;
  } 

  const handleAvatarPick = (mediaUri: string) => {
    console.log("Avatar picked:", mediaUri);
  };

  const handleWallpaperPick = (mediaUri: string) => {
    console.log("Wallpaper picked:", mediaUri);
  };



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
        <ScrollView
          style={{ backgroundColor: Colors.dark700, flex: 1 }}
          contentContainerStyle={styles.contentContainer}
        >
          <WallpaperPicker
            onWallpaperPick={handleWallpaperPick}
          />
          <AvatarPicker
            usernameInitial={data.username[0]}
            onAvatarPick={handleAvatarPick}
          />
          <ProfileForm />
        </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 100,
  },
});
