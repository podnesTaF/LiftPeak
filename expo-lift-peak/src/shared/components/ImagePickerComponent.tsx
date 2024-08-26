import React, { forwardRef, useCallback } from 'react';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Colors } from "@shared/styles";
import Button from "@shared/components/Button";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useToastStore } from "@shared/store";

interface ImagePickerComponentProps {
    onPick: (media: string) => void;
    closeModal: () => void;
}

const ImagePickerComponent = forwardRef(({ onPick, closeModal }: ImagePickerComponentProps, ref: React.ForwardedRef<BottomSheetModal>) => {
    const { showToast } = useToastStore();

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop opacity={0.7} appearsOnIndex={0} disappearsOnIndex={-1} enableTouchThrough={false} {...props} />
        ),
        []
    );

    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showToast('Permission required', 'We need your permission to access your photos and videos.', 'error');
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
                mediaTypes: ImagePicker.MediaTypeOptions.All, // allows both images and videos
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
            showToast('Error', 'Something went wrong while picking the media.', "error");
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
                allowsEditing: false, // Disable built-in editor
                quality: 1,
            });

            if (!result.canceled && result.assets) {
                await openImageEditor(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            showToast('Error', 'Something went wrong while taking the photo.', "error");
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
                allowsEditing: false, // Video editing not supported directly here
                quality: 1,
                videoMaxDuration: 60, // limit to 60 seconds, adjust as needed
            });

            if (!result.canceled && result.assets) {
                onPick(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error recording video:', error);
            showToast('Error', 'Something went wrong while recording the video.', "error");
        } finally {
            closeModal();
        }
    };

    return (
        <BottomSheetModal
            ref={ref}
            backgroundStyle={{
                backgroundColor: Colors.dark700
            }}
            backdropComponent={renderBackdrop}
            snapPoints={['60%', "80%"]}
        >
            <BottomSheetView style={{ paddingVertical: 16, flex: 1 }}>
                <Button title="Choose Photo or Video from Gallery" onPress={pickMediaFromGallery} color={"transparent"} fullWidth />
                <Button title="Take a Photo" onPress={takePhoto} color={"transparent"} fullWidth />
                <Button title="Record a Video" onPress={recordVideo} color={"transparent"} fullWidth />
            </BottomSheetView>
        </BottomSheetModal>
    );
});

export default ImagePickerComponent;
