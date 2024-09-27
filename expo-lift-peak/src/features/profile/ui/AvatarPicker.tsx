import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@shared/styles';
import {MediaOptions} from "@shared/model/IMediaOption";
import {MediaPicker} from "@features/media-upload";
import {useAuthStore} from "@features/auth";

interface AvatarPickerProps {
    usernameInitial: string;
    onAvatarPick: (mediaUri: string | null) => void;
  }
  

const AvatarPicker: React.FC<AvatarPickerProps> = ({usernameInitial, onAvatarPick }) => {
  const {user} = useAuthStore()
  const [avatar, setAvatar] = React.useState<{ actualUrl: string, thumbnailUrl: string }[]>(user?.profile?.avatarUrl ? [{actualUrl: user.profile.avatarUrl, thumbnailUrl: user.profile.avatarUrl}] : []);

  useEffect(() => {
    onAvatarPick(avatar?.[0]?.actualUrl || null)
  }, [avatar]);

  return (
    <View style={styles.avatarWrapper}>
      <View style={{width: 170,
        height: 170}}>
        <MediaPicker
            style={{
              paddingLeft:0
            }}
            containerStyles={styles.avatarContainer}
            single={true} uploadedFiles={avatar}  addMedia={(props) => setAvatar([props])}   removeMedia={() => setAvatar([])} actions={[MediaOptions.TAKE_PHOTO, MediaOptions.IMAGE,  MediaOptions.REMOVE_ALL]}
        />
        <View style={styles.cameraIconAvatar}>
          <Ionicons name="camera-outline" size={24} color={Colors.white} />
        </View>
      </View>
    </View>
  );
};

export default AvatarPicker;

const styles = StyleSheet.create({
  avatarWrapper: {
    marginTop: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: Colors.dark500,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark700,
  },
  cameraIconAvatar: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: Colors.dark300,
    padding: 7,
    borderRadius: 80,
  },
});
