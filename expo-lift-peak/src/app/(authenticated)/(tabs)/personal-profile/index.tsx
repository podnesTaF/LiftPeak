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
import {useLocalSearchParams} from "expo-router";
import ProfileTabBar from "@shared/components/tabs/ProfileTabBar";

const ProfileOverview = () => {
  const { user, updateProfile, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState("about");
  const { scrollY } = useAnimatedScroll();

  const { data } = useQuery({
    queryKey: ["user", user!.id],
    queryFn: () => getUserInfo(user!.id),
    enabled: !!user?.id,
  });
  useEffect(() => {
    if(data) {
      updateUser(data)
    }
  }, [data]);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  if(!user?.profile) return null

  return (
    <Animated.ScrollView
      onScroll={onScroll}
      stickyHeaderIndices={[1]}
      contentContainerStyle={{ paddingBottom: 120 }}
      style={defaultStyles.container}
      scrollEventThrottle={16}
    >
      <ProfileHeader user={user} />
      <CustomTabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={[{ name: "about" }, { name: "statistics" }]}
        style={{justifyContent: 'center'}}
        variant="profile"
      />
      {activeTab === "about" &&
        (user?.profile  ? (
          <UserInfo user={user}/>
        ) : (
          <Text style={{ color: "white" }}>Loading...</Text>
        ))}
    </Animated.ScrollView>
  );
};

export default ProfileOverview;
