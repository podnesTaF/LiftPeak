import React, { useRef } from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ImagePickerComponent from '@shared/components/ImagePickerComponent';
import { Colors } from '@shared/styles';

interface WallpaperPickerProps {
    wallpaperUrl?: string; 
    onWallpaperPick: (mediaUri: string) => void;
  }
  

const WallpaperPicker: React.FC<WallpaperPickerProps> = ({ wallpaperUrl, onWallpaperPick }) => {
  const wallpaperSheetRef = useRef<BottomSheetModal>(null);

  const closeWallpaperModal = () => wallpaperSheetRef.current?.dismiss();
  const openWallpaperPicker = () => wallpaperSheetRef.current?.present();

  return (
    <View>
      <Pressable style={styles.wallpaperContainer} onPress={openWallpaperPicker}>
        {wallpaperUrl ? (
          <Image style={styles.wallpaper} source={{ uri: wallpaperUrl }} />
        ) : (
          <View style={styles.wallpaperPlaceholder} />
        )}


      <View style={styles.cameraIconWallpaper}>
        <Ionicons name="camera-outline" size={24} color={Colors.white} />
      </View>
      </Pressable>

      <ImagePickerComponent
        closeModal={closeWallpaperModal}
        ref={wallpaperSheetRef}
        buttons={[
          { title: 'Choose cover photo', actionType: 'pickMediaFromGallery', icon: 'images-outline' },
          { title: 'Take a Photo', actionType: 'takePhoto', icon: 'camera-outline' },
        ]}
        onPick={onWallpaperPick}
      />
    </View>
  );
};

export default WallpaperPicker;

const styles = StyleSheet.create({
  wallpaperContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  wallpaper: {
    height: 180,
    resizeMode: 'cover',
  },
  wallpaperPlaceholder: {
    height: 180,
    backgroundColor: Colors.dark300,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  cameraIconWallpaper: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 7,
    borderRadius: 80,
    backgroundColor: Colors.dark300,
  },
});
