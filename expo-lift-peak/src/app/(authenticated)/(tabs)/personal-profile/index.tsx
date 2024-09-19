import { useAuthStore } from "@features/auth";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo, ProfileHeader, UserInfo } from "@features/profile";
import { ScrollView, Text, View } from "react-native";
import { defaultStyles } from "@shared/styles";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useAnimatedScroll } from "@shared/components/AnimatedScrollContext";
import React, { useCallback, useEffect } from "react";
import CustomTabBar from "@shared/components/tabs/CustomTabBar";
import { useProfileStore } from "@features/profile/store";

const ProfileOverview = () => {
  const { user } = useAuthStore();
  const {
    setProfileField,
    setGyms,
    setId,
    setUsername,
    setIsFollowing,
    setFollowersCount,
    setFollowingsCount,
  } = useProfileStore();
  const [activeTab, setActiveTab] = React.useState("about");
  const { scrollY } = useAnimatedScroll();

  const { data } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUserInfo(user?.id),
    enabled: !!user?.id,
  });

  const handleSetProfile = useCallback(() => {
    if (data) {
      const {
        id,
        username,
        gyms,
        isFollowing,
        followersCount,
        followingsCount,
        profile: profileData,
      } = data;
      

      if (id !== undefined) setId(id);
      if (gyms) setGyms(gyms);
      if (username) setUsername(username);
      if (typeof isFollowing === "boolean") setIsFollowing(isFollowing);
      if (typeof followersCount === "number") setFollowersCount(followersCount);
      if (typeof followingsCount === "number")
        setFollowingsCount(followingsCount);

      if (profileData) {
        const {
          avatarUrl,
          wallpaperUrl,
          socialMediaLinks,
          goal,
          firstName,
          lastName,
          dateOfBirth,
        } = profileData;

        if (firstName) setProfileField("firstName", firstName);
        if (lastName) setProfileField("lastName", lastName);
        if (avatarUrl) setProfileField("avatarUrl", avatarUrl);
        if (wallpaperUrl) setProfileField("wallpaperUrl", wallpaperUrl);
        if (socialMediaLinks)
          setProfileField("socialMediaLinks", socialMediaLinks);
        if (goal) setProfileField("goal", goal);
        if (dateOfBirth) setProfileField("dateOfBirth", dateOfBirth);
      }
    }
  }, [
    data,
    setId,
    setGyms,
    setUsername,
    setIsFollowing,
    setFollowersCount,
    setFollowingsCount,
    setProfileField,
  ]);

  useEffect(() => {
    handleSetProfile();
  }, [handleSetProfile]);

  // hook used to handle scroll events in an animated way
  // it listens for the onScroll event
  //the function we pass inside of this hook will be executed every time the user scrolls
  const onScroll = useAnimatedScrollHandler((event) => {
    //event.contentOffset.y gives the current scroll position in pixels.
    scrollY.value = event.contentOffset.y;
  });

  return (
    //on scroll, our defined on scroll function will be executed
    <Animated.ScrollView
      onScroll={onScroll}
      stickyHeaderIndices={[1]}
      contentContainerStyle={{ paddingBottom: 120 }}
      style={defaultStyles.container}
      scrollEventThrottle={16}
    >
      {/* scrollEventThrottle={16} means that the onScroll event will fire every 16 milliseconds, 
    which corresponds to about 60 frames per second (fps). 
    This is a common frame rate for smooth animations and user interactions. */}
      <ProfileHeader />
      <CustomTabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={[{ name: "about" }, { name: "statistics" }]}
      />
      {activeTab === "about" &&
        (data ? (
          <UserInfo user={data} />
        ) : (
          <Text style={{ color: "white" }}>Loading...</Text>
        ))}
    </Animated.ScrollView>
  );
};

export default ProfileOverview;
