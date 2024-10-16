import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, Text, View, StyleSheet } from "react-native";
import { useUserData } from "../hooks/useUserData";
import { useUserWorkouts } from "../hooks/useUserWorkouts";
import { useAuthStore } from "@features/auth/store";
import { useAnimatedScroll } from "@shared/components/AnimatedScrollContext";
import { Colors, defaultStyles } from "@shared/styles";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import CustomTabBar from "@shared/components/tabs/CustomTabBar";
import { WorkoutPost } from "@features/feed";
import { ProfileHeader } from "./ProfileHeader";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ProfileProps {
  userId: string | number;
}

const Profile: React.FC<ProfileProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("posts");
  const { scrollY } = useAnimatedScroll();
  const [refreshing, setRefreshing] = useState(false);

  const { user: currentUser, updateUser } = useAuthStore();

  const isCurrentUser = userId === currentUser?.id.toString();

  const {
    data: userData,
    refetch: refetchUserData,
    isFetching: isFetchingUserData,
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await Promise.all([refetchUserData(), refetchWorkouts()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchUserData, refetchWorkouts]);

  useEffect(() => {
    if (isCurrentUser && userData) {
      updateUser(userData);
    }
  }, [isCurrentUser, userData, updateUser]);

  if (isUserDataError) {
    return (
      <View style={defaultStyles.container}>
        <Text style={{ color: "red" }}>Failed to load user data.</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={defaultStyles.container}>
        <Text style={{ color: "white" }}>User data not available.</Text>
      </View>
    );
  }

  const hasWorkouts = workoutsData && workoutsData.length > 0;

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
          <ProfileHeader
            user={isCurrentUser ? currentUser : userData}
            workoutsCount={workoutsData?.length}
          />
          {hasWorkouts ? (
            <>
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
          ) : (
            <View style={styles.noWorkoutsContainer}>
              <MaterialCommunityIcons
                name="weight-lifter"
                size={64}
                color={Colors.dark300}
                style={styles.noWorkoutsIcon}
              />
              <Text style={styles.noWorkoutsText}>No workouts logged yet</Text>
            </View>
          )}
        </>
      }
      contentContainerStyle={{ paddingBottom: 120 }}
      style={defaultStyles.container}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  noWorkoutsContainer: {
    alignItems: "center",
    marginTop: 70,
    paddingHorizontal: 20,
  },
  noWorkoutsIcon: {
    marginBottom: 10,
  },
  noWorkoutsText: {
    color: Colors.dark300,
    fontSize: 18,
    textAlign: "center",
  },
});

export default Profile;
