import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useToastStore } from '@shared/store';
import {MediaOptions} from "../components/ImagePickerComponent";


interface UseImagePickerParams {
    onPick: (media: string) => void;
    closeModal: () => void;
}

const useImagePicker = ({ onPick, closeModal }: UseImagePickerParams) => {
    const { showToast } = useToastStore();

    const requestPermission = useCallback(async (type: 'media' | 'camera') => {
        const { status } = type === 'media'
            ? await ImagePicker.requestMediaLibraryPermissionsAsync()
            : await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            showToast(
                'Permission required',
                `We need your permission to access your ${type === 'media' ? 'photos' : 'camera'}.`,
                'error'
            );
            return false;
        }

        return true;
    }, [showToast]);

    const openImageEditor = useCallback(async (uri: string) => {
        try {
            const editedImage = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 1080 } }, { crop: { originX: 0, originY: 0, width: 1080, height: 1440 } }],
                { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
            );
            onPick(editedImage.uri);
        } catch (error) {
            showToast('Error', 'Something went wrong while editing the image.', 'error');
        } finally {
            closeModal();
        }
    }, [onPick, closeModal, showToast]);

    const pickMediaFromGallery = useCallback(async (mediaTypes?: ImagePicker.MediaTypeOptions) => {
        const granted = await requestPermission('media');
        if (!granted) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: mediaTypes || ImagePicker.MediaTypeOptions.All,
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
            showToast('Error', 'Something went wrong while picking the media.', 'error');
        } finally {
            closeModal();
        }
    }, [requestPermission, openImageEditor, onPick, closeModal, showToast]);

    const takePhoto = useCallback(async () => {
        const granted = await requestPermission('camera');
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
            showToast('Error', 'Something went wrong while taking the photo.', 'error');
        } finally {
            closeModal();
        }
    }, [requestPermission, openImageEditor, closeModal, showToast]);

    const recordVideo = useCallback(async () => {
        const granted = await requestPermission('camera');
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
            showToast('Error', 'Something went wrong while recording the video.', 'error');
        } finally {
            closeModal();
        }
    }, [requestPermission, onPick, closeModal, showToast]);


    const actionButtons: {
        [key: string]: {
            title: string;
            actionFn: () => void;
            icon: any;
        }
    } = {
        [MediaOptions.IMAGE_AND_VIDEO]: {
            title: "Choose Photo or Video from Gallery",
            actionFn: () => pickMediaFromGallery(ImagePicker.MediaTypeOptions.All),
            icon: "images-outline",
        },
        [MediaOptions.IMAGE]: {
            title: "Choose Photo from Gallery",
            actionFn: () => pickMediaFromGallery(ImagePicker.MediaTypeOptions.Images),
            icon: "image-outline",
        },
        [MediaOptions.TAKE_PHOTO]: {
            title: "Take a Photo",
            actionFn: takePhoto,
            icon: "camera-outline",
        },
        [MediaOptions.FILM]: {
            title: "Record a Video",
            actionFn: recordVideo,
            icon: "videocam-outline",
        },
    }

    return {
        actionButtons,
        pickMediaFromGallery,
        takePhoto,
        recordVideo,
    };
};

export default useImagePicker;
