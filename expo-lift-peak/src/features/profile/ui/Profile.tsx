import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, Text, View } from "react-native";
import { useUserData } from "../hooks/useUserData";
import { useUserWorkouts } from "../hooks/useUserWorkouts";
import { useAuthStore } from "@features/auth/store";
import { useAnimatedScroll } from "@shared/components/AnimatedScrollContext";
import { defaultStyles } from "@shared/styles";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import CustomTabBar from "@shared/components/tabs/CustomTabBar";
import { WorkoutPost } from "@features/feed";
import { ProfileHeader } from "./ProfileHeader";

interface ProfileProps {
  userId: string | number;
}

const Profile: React.FC<ProfileProps> = ({ userId }) => {
  // **All hooks are called unconditionally at the top**

  const [activeTab, setActiveTab] = useState("posts");
  const { scrollY } = useAnimatedScroll();
  const { user: currentUser, updateUser } = useAuthStore();

  const isCurrentUser = userId === currentUser?.id.toString();

  const {
    data: userData,
    refetch: refetchUserData,
    isFetching: isFetchingUserData,
    isLoading: isUserDataLoading,
    isError: isUserDataError,
  } = useUserData(userId);

  const {
    data: workoutsData,
    refetch: refetchWorkouts,
    isFetching: isFetchingWorkouts,
  } = useUserWorkouts(userId);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const onRefresh = useCallback(() => {
    if (activeTab === "posts") {
      refetchUserData();
      refetchWorkouts();
    } else {
      refetchUserData();
    }
  }, [activeTab, refetchUserData, refetchWorkouts]);

  useEffect(() => {
    if (isCurrentUser && userData) {
      updateUser(userData);
    }
  }, [isCurrentUser, userData, updateUser]);

  const isRefreshing =
    isFetchingUserData || (activeTab === "posts" && isFetchingWorkouts);


  if (isUserDataLoading) {
    return (
      <View style={defaultStyles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (isUserDataError) {
    return (
      <View style={defaultStyles.container}>
        <Text style={{ color: 'red' }}>Failed to load user data.</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={defaultStyles.container}>
        <Text style={{ color: 'white' }}>User data not available.</Text>
      </View>
    );
  }


  return (
    <Animated.FlatList
      onScroll={onScroll}
      data={activeTab === "posts" ? workoutsData || [] : []}
      keyExtractor={(item) => item.id!.toString()}
      renderItem={({ item }) => (
        <WorkoutPost workout={item} isViewable={true} />
      )}
      ListHeaderComponent={
        <>
          <ProfileHeader user={isCurrentUser ? currentUser : userData} />
          <CustomTabBar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={[{ name: "posts" }, { name: "stats" }]}
            style={{ justifyContent: "center" }}
            variant="profile"
          />
          {activeTab === "stats" && (
            <View>
              <Text style={{ color: "white" }}>Stats</Text>
            </View>
          )}
        </>
      }
      contentContainerStyle={{ paddingBottom: 120 }}
      style={defaultStyles.container}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export default Profile;
