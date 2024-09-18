import React, { useRef, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { deleteMedia, uploadMedia } from "@features/media-upload/api/mediaApi";
import { useToastStore } from "@shared/store";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import ImagePickerComponent, {MediaOptions} from "@shared/components/ImagePickerComponent";
import { Colors } from "@shared/styles";
import { Ionicons } from "@expo/vector-icons";
import * as VideoThumbnails from "expo-video-thumbnails";

interface MediaPickerProps {
  uploadedFiles: { actualUrl: string; thumbnailUrl: string }[];
  addMedia: (props: { actualUrl: string; thumbnailUrl: string }) => void;
  removeMedia: (url: string) => void;
  single?: boolean;
  actions?: MediaOptions[];
}

export const MediaPicker = ({
  uploadedFiles,
  addMedia,
  removeMedia, single, actions
}: MediaPickerProps) => {
  const [localLoadingFileUrl, setLocalLoadingFileUrl] = React.useState<
    string | null
  >(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const { showToast } = useToastStore();

  const { mutate: uploadFile, isPending } = useMutation({
    mutationFn: (localUrl: string) => uploadMedia([localUrl]),
    onMutate: (url) => {
      const isVideo = url.endsWith(".mp4") || url.endsWith(".mov");
      if (isVideo) {
        VideoThumbnails.getThumbnailAsync(url, {
          time: 0,
        }).then(({ uri }) => {
          setLocalLoadingFileUrl(uri);
        });
      } else {
        setLocalLoadingFileUrl(url);
      }
    },
    onSuccess: (data) => {
      if (!data) {
        return;
      }
      addMedia({ actualUrl: data, thumbnailUrl: localLoadingFileUrl || data });
      setLocalLoadingFileUrl(null);
    },
    onError: (error) => {
      showToast(
        "Error",
        error.message || "An error occurred while uploading media",
        "error",
        4000
      );
      setLocalLoadingFileUrl(null);
    },
  });

  const { mutate: removeFile, isPending: isDeleting } = useMutation({
    mutationFn: (url: string) => deleteMedia(url),
    onMutate: (url) => {
      setDeletingFile(url);
    },
    onSuccess: (data) => {
      removeMedia(data);
      setDeletingFile(null);
    },
    onError: (error) => {
      showToast(
        "Error",
        error.message || "An error occurred while deleting media",
        "error",
        4000
      );
      setDeletingFile(null);
    },
  });

  const closeModal = () => bottomSheetRef.current?.dismiss();
  const openImagePicker = () => bottomSheetRef.current?.present();

  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={{ gap: 14, paddingLeft: 16 }}
      showsHorizontalScrollIndicator={false}
      snapToAlignment={"start"}
      snapToInterval={100}
    >
      {(single && uploadedFiles.length > 0) ? (
          <TouchableOpacity onPress={openImagePicker} style={[styles.container]}>
            <Image
                source={{ uri: uploadedFiles[0].thumbnailUrl }}
                style={{ width: "100%", height: "100%", borderRadius: 16 }}
            />
          </TouchableOpacity>
      ):(
          !isPending ? (
        <TouchableOpacity onPress={openImagePicker} style={[styles.container]}>
          <Ionicons name={"camera"} size={32} color={Colors.white} />
        </TouchableOpacity>
      ) : (
        <View style={[styles.container]}>
          {localLoadingFileUrl && (
            <Image
              source={{ uri: localLoadingFileUrl }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 16,
                opacity: 0.5,
              }}
            />
          )}
          <ActivityIndicator
            color={Colors.dark700}
            style={{ position: "absolute" }}
          />
        </View>
      ))}
      {!single && uploadedFiles.map((media, index) => (
        <View
          key={media.actualUrl + "_" + index}
          style={{
            width: 100,
            height: 100,
            borderRadius: 16,
            backgroundColor: Colors.dark500,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={{ uri: media.thumbnailUrl }}
            style={{ width: "100%", height: "100%", borderRadius: 16 }}
          />
          {media.actualUrl.endsWith(".mp4") ||
          media.actualUrl.endsWith(".mov") ? (
            <Ionicons
              name={"videocam"}
              size={24}
              color={Colors.white}
              style={{ position: "absolute", left: 6, bottom: 6, opacity: 0.7 }}
            />
          ) : (
            <Ionicons
              name={"image"}
              size={24}
              color={Colors.white}
              style={{ position: "absolute", left: 6, bottom: 6, opacity: 0.7 }}
            />
          )}
          <TouchableOpacity
            disabled={isDeleting}
            onPress={() => removeFile(media.actualUrl)}
            style={{ position: "absolute", right: 6, top: 6 }}
          >
            <Ionicons name={"close"} size={24} color={Colors.white} />
          </TouchableOpacity>
          {deletingFile === media.actualUrl && (
            <ActivityIndicator
              color={Colors.dark700}
              style={{ position: "absolute" }}
            />
          )}
        </View>
      ))}
      <ImagePickerComponent
        closeModal={closeModal}
        ref={bottomSheetRef}
        onPick={uploadFile}
        actions={actions || [MediaOptions.IMAGE_AND_VIDEO, MediaOptions.TAKE_PHOTO, MediaOptions.FILM]}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: Colors.dark500,
    alignItems: "center",
    justifyContent: "center",
  },
});
