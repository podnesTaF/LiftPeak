import React, {useEffect} from "react";
import {Dimensions, StyleSheet, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@shared/styles";
import {MediaOptions} from "@shared/model/IMediaOption";
import {MediaPicker} from "@features/media-upload";
import {useAuthStore} from "@features/auth";

interface WallpaperPickerProps {
  onWallpaperPick: (mediaUri: string | null) => void;
}

const WallpaperPicker: React.FC<WallpaperPickerProps> = ({
  onWallpaperPick,
}) => {
  const { user } = useAuthStore();
  const [wallpaper, setWallpaper] = React.useState<{ actualUrl: string, thumbnailUrl: string }[]>(user?.profile?.wallpaperUrl ? [{actualUrl: user.profile.wallpaperUrl, thumbnailUrl: user.profile.wallpaperUrl}] : []);

  useEffect(() => {
    onWallpaperPick(wallpaper[0]?.actualUrl || null)
  }, [wallpaper]);

  return (
    <View style={styles.wallpaperContainer}>
      <MediaPicker
          style={{
            paddingLeft:0
          }}
          containerStyles={[{height: 180, width: Dimensions.get("screen").width, borderRadius: 0}]}
          single={true} uploadedFiles={wallpaper}  addMedia={(props) => setWallpaper([props])}   removeMedia={() => setWallpaper([])} actions={[MediaOptions.TAKE_PHOTO, MediaOptions.IMAGE, MediaOptions.REMOVE_ALL]}
      />
      <View style={{position: 'absolute', top: 20, left: 20}}>
        <Ionicons name="camera-outline" size={24} color={Colors.white} />
      </View>
    </View>
  );
};

export default WallpaperPicker;

const styles = StyleSheet.create({
  wallpaperContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  wallpaper: {
    height: 180,
    resizeMode: "cover",
  },
  wallpaperPlaceholder: {
    height: 180,
    backgroundColor: Colors.dark300,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  cameraIconWallpaper: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 7,
    borderRadius: 80,
    backgroundColor: Colors.dark300,
  },
});
