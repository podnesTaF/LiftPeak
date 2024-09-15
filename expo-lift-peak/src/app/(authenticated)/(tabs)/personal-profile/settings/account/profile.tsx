import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { useAuthStore } from '@features/auth';
import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@features/profile';
import { Colors } from '@shared/styles';
import AvatarPicker from '@features/profile/ui/AvatarPicker';
import WallpaperPicker from '@features/profile/ui/WallpaperPicker';

const Profile = () => {
  const { user } = useAuthStore();

  const { data } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: () => getUserInfo(user?.id),
    enabled: !!user?.id,
  });

  if (!data) {
    return null;
  }

  const handleAvatarPick = (mediaUri: string) => {
    console.log('Avatar picked:', mediaUri);
  };

  const handleWallpaperPick = (mediaUri: string) => {
    console.log('Wallpaper picked:', mediaUri);
  };

  return (
    <ScrollView style={{ backgroundColor: Colors.dark700 }}>
      <WallpaperPicker
        wallpaperUrl={data.profile?.wallpaperUrl}
        onWallpaperPick={handleWallpaperPick}
      />
      <AvatarPicker
        avatarUrl={data.profile?.avatarUrl}
        usernameInitial={data.username[0]}
        onAvatarPick={handleAvatarPick}
      />
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
});
