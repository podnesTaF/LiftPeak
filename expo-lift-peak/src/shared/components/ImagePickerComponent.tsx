import React, { forwardRef, useCallback } from 'react';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Colors } from "@shared/styles"; 
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useToastStore } from "@shared/store";
import { Ionicons } from '@expo/vector-icons'; 

interface ButtonConfig {
  title: string;
  actionType: 'pickMediaFromGallery' | 'takePhoto' | 'recordVideo';
  icon: React.ComponentProps<typeof Ionicons>['name']; 
}

interface ImagePickerComponentProps {
  buttons: ButtonConfig[];
  closeModal: () => void;
  onPick: (media: string) => void;
}

const ImagePickerComponent = forwardRef(
  ({ buttons, closeModal, onPick }: ImagePickerComponentProps, ref: React.ForwardedRef<BottomSheetModal>) => {
    const { showToast } = useToastStore();

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          opacity={0.7}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          enableTouchThrough={false}
          {...props}
        />
      ),
      []
    );

    const requestPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showToast(
          'Permission required',
          'We need your permission to access your photos and videos.',
          'error'
        );
      }
      return status === 'granted';
    };

    const requestCameraPermission = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    };

    const openImageEditor = async (uri: string) => {
      try {
        const editedImage = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 1080 } }, { crop: { originX: 0, originY: 0, width: 1080, height: 1440 } }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );
        onPick(editedImage.uri);  
      } catch (error) {
        console.error('Error editing image:', error);
        showToast('Error', 'Something went wrong while editing the image.', 'error');
      } finally {
        closeModal();
      }
    };

    const pickMediaFromGallery = async () => {
      const granted = await requestPermission();
      if (!granted) return;

      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: false,
          quality: 1,
        });

        if (!result.canceled && result.assets) {
          const asset = result.assets[0];
          if (asset.type === 'image') {
            await openImageEditor(asset.uri);
          } else if (asset.type === 'video') {
            onPick(asset.uri); 
          }
        }
      } catch (error) {
        console.error('Error picking media:', error);
        showToast('Error', 'Something went wrong while picking the media.', 'error');
      } finally {
        closeModal();
      }
    };

    const takePhoto = async () => {
      const granted = await requestCameraPermission();
      if (!granted) return;

      try {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
        });

        if (!result.canceled && result.assets) {
          await openImageEditor(result.assets[0].uri);
        }
      } catch (error) {
        console.error('Error taking photo:', error);
        showToast('Error', 'Something went wrong while taking the photo.', 'error');
      } finally {
        closeModal();
      }
    };

    const recordVideo = async () => {
      const granted = await requestCameraPermission();
      if (!granted) return;

      try {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: false,
          quality: 1,
          videoMaxDuration: 60,
        });

        if (!result.canceled && result.assets) {
          onPick(result.assets[0].uri); 
        }
      } catch (error) {
        console.error('Error recording video:', error);
        showToast('Error', 'Something went wrong while recording the video.', 'error');
      } finally {
        closeModal();
      }
    };

    const handleAction = (actionType: ButtonConfig['actionType']) => {
      switch (actionType) {
        case 'pickMediaFromGallery':
          pickMediaFromGallery();
          break;
        case 'takePhoto':
          takePhoto();
          break;
        case 'recordVideo':
          recordVideo();
          break;
        default:
          break;
      }
    };

    return (
      <BottomSheetModal
        ref={ref}
        backgroundStyle={styles.backgroundStyle}
        backdropComponent={renderBackdrop}
        snapPoints={['25%', '50%']} 
      >
        <BottomSheetView style={styles.contentContainer}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.buttonContainer}
              onPress={() => handleAction(button.actionType)}
            >
              <Ionicons name={button.icon} size={24} color={Colors.white} />
              <Text style={styles.buttonText}>{button.title}</Text>
            </TouchableOpacity>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default ImagePickerComponent;

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: Colors.dark700,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  contentContainer: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 14,
    gap: 6
  },
  buttonText: {
    color: Colors.white,
    marginLeft: 10,
    fontSize: 16,
  },
});
