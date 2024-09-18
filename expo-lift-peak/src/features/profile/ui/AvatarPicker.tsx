import React, { useRef } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ImagePickerComponent from '@shared/components/ImagePickerComponent';
import Avatar from '@shared/components/Avatar';
import { Colors } from '@shared/styles';
import {MediaOptions} from "@shared/model/IMediaOption";

interface AvatarPickerProps {
    avatarUrl?: string; 
    usernameInitial: string;
    onAvatarPick: (mediaUri: string) => void;
  }
  

const AvatarPicker: React.FC<AvatarPickerProps> = ({ avatarUrl, usernameInitial, onAvatarPick }) => {
  const avatarSheetRef = useRef<BottomSheetModal>(null);

  const closeAvatarModal = () => avatarSheetRef.current?.dismiss();
  const openAvatarPicker = () => avatarSheetRef.current?.present();

  return (
    <View style={styles.avatarWrapper}>
      <Pressable style={styles.avatarContainer} onPress={openAvatarPicker}>
        <Avatar size={160} name={usernameInitial} url={avatarUrl} />
        <View style={styles.cameraIconAvatar}>
          <Ionicons name="camera-outline" size={24} color={Colors.white} />
        </View>
      </Pressable>

      <ImagePickerComponent
        closeModal={closeAvatarModal}
        ref={avatarSheetRef}
        actions={[MediaOptions.IMAGE, MediaOptions.TAKE_PHOTO]}
        onPick={onAvatarPick}
      />
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
