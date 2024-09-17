import React, { useEffect } from "react";
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
  const {setLinks, setGyms, setAvatarUrl, setWallpaperUrl, setGoal, avatarUrl, wallpaperUrl, links, gyms, goal} = useProfileStore();
  const navigation = useNavigation();

  const { data } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUserInfo(user?.id),
    enabled: !!user?.id,
  });

  useEffect(() => {

    if(data?.profile?.avatarUrl){
      setAvatarUrl(data.profile.avatarUrl)
    }

    if(data?.profile?.wallpaperUrl){
      setWallpaperUrl(data.profile.wallpaperUrl)
    }

    if(data?.profile?.socialMediaLinks){
      setLinks(data.profile.socialMediaLinks)
    }

    if(data?.gyms){
      setGyms(data.gyms)
    }

    if(data?.profile?.goal){
      setGoal(data.profile.goal)
    }
  }, [data, setLinks, setGyms])


  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity>
          <Text style={{fontSize: 17, color: Colors.successLight}}>Save</Text>
        </TouchableOpacity>
      )
    })
  }, [navigation, avatarUrl, wallpaperUrl, links, gyms, goal])

  

  if (!data) {
    return null;
  } else{
    console.log(data)
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
          keyboardShouldPersistTaps="handled"
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
