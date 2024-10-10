import React from "react";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Constants from "expo-constants";
import { Colors, defaultStyles } from "@shared/styles";
import { IUser } from "@entities/user";
import Avatar from "@shared/components/Avatar";
import Button from "@shared/components/Button";
import { useAuthStore } from "@features/auth";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useAnimatedScroll } from "@shared/components/AnimatedScrollContext";
import { router } from "expo-router";

export const ProfileHeader = ({ user }: { user: IUser }) => {
  const { user: authUser } = useAuthStore();
  const { scrollY } = useAnimatedScroll();

  const isOwnProfile = authUser && user.id === authUser.id;

  const containerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [350, 430],
      [0, -80],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity: interpolate(
        scrollY.value,
        [200, 630],
        [1, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  const openURL = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  const handleFollow = () => {
    // Implement follow functionality here
  };

  const handleUnfollow = () => {
    // Implement unfollow functionality here
  };

  const fullName = [user.profile?.firstName, user.profile?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <Animated.View style={[styles.container, containerStyle]}>
        <View style={styles.header}>
          {user.profile?.wallpaperUrl ? (
            <Image
              source={{ uri: user.profile.wallpaperUrl }}
              style={styles.wallpaperImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.wallpaperPlaceholder} />
          )}

          <View style={styles.avatarContainer}>
            <Avatar
              size={120}
              name={user.username[0] || ""}
              url={user?.profile?.avatarUrl}
            />
          </View>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.fullName}>{fullName}</Text>
            <Text style={styles.username}>@{user.username}</Text>
          </View>

          {user.profile?.goal && (
            <Text style={styles.goalText}>{user.profile.goal}</Text>
          )}

          <View style={styles.statsContainer}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(authenticated)/people",
                  params: { type: "followers", id: user.id },
                })
              }
              style={styles.statItem}
            >
              <Text style={styles.statNumber}>{user.followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(authenticated)/people",
                  params: { type: "following", id: user.id },
                })
              }
              style={styles.statItem}
            >
              <Text style={styles.statNumber}>{user.followingsCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>96</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.socialMediaLinks}>
            {user.profile?.socialMediaLinks?.map((sml) => (
              <TouchableOpacity
                key={sml.platform}
                onPress={() => openURL(sml.url)}
                style={styles.socialMediaIcon}
              >
                <Ionicons
                  color={Colors.white}
                  size={24}
                  name={
                    `logo-${sml.platform.toLowerCase()}` as keyof typeof Ionicons.glyphMap
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isOwnProfile ? (
            <View style={{ flexDirection: "row", gap: 14 }}>
              <View style={[defaultStyles.row, { gap: 12, flex: 1 }]}>
                <Button
                  onPress={() =>
                    router.push(
                      "/(authenticated)/(tabs)/personal-profile/settings"
                    )
                  }
                  style={{ flex: 1, paddingVertical: 10 }}
                  color={"white"}
                  title={"Settings"}
                >
                  <Ionicons
                    name={"settings-outline"}
                    size={24}
                    color={Colors.dark700}
                  />
                </Button>
              </View>
              <View style={[defaultStyles.row, { gap: 12, flex: 1 }]}>
                <Button
                  onPress={() =>
                    router.push(
                      "/(authenticated)/(tabs)/personal-profile/settings"
                    )
                  }
                  style={{ flex: 1, paddingVertical: 10, borderWidth: 1, borderColor: Colors.white }}
                  color='dark900'
                  title={"Edit Profile"}
                >
                  <Ionicons
                    name={"person-circle-outline"}
                    size={24}
                    color={Colors.white}
                  />
                </Button>
              </View>
            </View>
          ) : user.isFollowing ? (
            <Button
              onPress={handleUnfollow}
              fullWidth
              style={styles.actionButton}
              color={"dark500"}
              title={"Unfollow"}
            >
              <Ionicons
                name={"person-remove-outline"}
                size={24}
                color={Colors.white}
              />
            </Button>
          ) : (
            <Button
              onPress={handleFollow}
              fullWidth
              style={styles.actionButton}
              color={"white"}
              title={"Follow"}
            >
              <Ionicons
                name={"person-add-outline"}
                size={24}
                color={Colors.dark900}
              />
            </Button>
          )}
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark900,
  },
  header: {
    paddingTop: Constants.statusBarHeight,
    height: 220,
  },
  wallpaperImage: {
    height: 220,
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  wallpaperPlaceholder: {
    height: 220,
    backgroundColor: Colors.dark300,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  avatarContainer: {
    position: "absolute",
    top: 160,
    left: "50%",
    marginLeft: -60,
    borderRadius: 60,
    borderColor: Colors.dark500,
    borderWidth: 2,
    width: 120,
    height: 120,
    overflow: "hidden",
  },
  profileInfo: {
    marginTop: 70,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: Colors.dark900,
    borderRadius: 16,
    shadowColor: Colors.dark900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  nameContainer: {
    alignItems: "center",
  },
  fullName: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.white,
  },
  username: {
    fontSize: 16,
    color: Colors.dark300,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.dark500,
    paddingVertical: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: Colors.dark300,
    fontSize: 14,
  },
  goalText: {
    color: Colors.dark300,
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
  socialMediaLinks: {
    flexDirection: "row",
    marginTop: 6,
    justifyContent: "center",
  },
  socialMediaIcon: {
    marginHorizontal: 12,
    backgroundColor: Colors.dark700,
    padding: 10,
    borderRadius: 30,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  actionButton: {
    paddingHorizontal: 10,
  },
});
