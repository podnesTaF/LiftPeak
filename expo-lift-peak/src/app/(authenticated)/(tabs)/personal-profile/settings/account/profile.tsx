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
import {useMutation, useQuery} from "@tanstack/react-query";
import {getUserInfo, updateUserProfile} from "@features/profile";
import { Colors } from "@shared/styles";
import AvatarPicker from "@features/profile/ui/AvatarPicker";
import WallpaperPicker from "@features/profile/ui/WallpaperPicker";
import ProfileForm from "@features/profile/ui/ProfileForm";
import { useNavigation } from "expo-router";
import {IProfile} from "@entities/user";
import {useToastStore} from "@shared/store";
import {IGym} from "@entities/gym";
import {queryClient} from "@shared/api";

const Profile = () => {
  const { user, updateUser , updateProfile} = useAuthStore();
  const navigation = useNavigation();
  const {showToast} = useToastStore()

  const { data } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUserInfo(user?.id),
    enabled: !!user?.id,
  });

  const {mutate} = useMutation({
    mutationFn: () => updateUserProfile(user!.profile!, user!.gyms),
    onError: (error) => (
        showToast("Error while updating profile", error.message, "error")
    ),
    onSuccess: () => (
        navigation.goBack()
    )
  })

  useEffect(() => {
    if (data) {
      updateUser(data)
    }
  }, [data]);


  useEffect(() => {
    if(user?.profile) {
      navigation.setOptions({
        headerRight: () => (
            <TouchableOpacity onPress={() => mutate()}>
              <Text style={{fontSize: 17, color: Colors.successLight, paddingEnd: 5}}>Save</Text>
            </TouchableOpacity>
        )
      })
    }
  }, [navigation, user?.profile])


  if (!data) {
    return null;
  }

  const handleAvatarPick = (mediaUri: string | null) => {

    updateProfile({avatarUrl:mediaUri})
  };

  const handleWallpaperPick = (mediaUri: string | null) => {
    updateProfile({wallpaperUrl: mediaUri})
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
