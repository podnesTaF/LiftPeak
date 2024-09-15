import React, { useEffect } from "react";
import CustomTopTabBar from "@shared/components/navigation/CustomTopTabBar";
import MaterialTopTabs from "@shared/components/navigation/MaterialTopTabs";
import { Stack, Tabs, useRouter } from "expo-router";
import { getUserInfo, ProfileHeader } from "@features/profile";
import { useAuthStore } from "@features/auth";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { AnimatedScrollProvider } from "@shared/components/AnimatedScrollContext";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import Constants from "expo-constants";
import ProfileTopHeader from "@features/profile/ui/ProfileTopHeader";

const Layout = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const scrollY = useSharedValue(0);

  const { data } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUserInfo(user?.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (data && data.id !== user?.id) {
      router.replace({
        pathname: "profile",
        params: {
          id: data.id,
        },
      });
    }
  }, [data]);

  if (!user) return null;

  return (
    <AnimatedScrollProvider scrollY={scrollY}>
      <Tabs.Screen
        options={{
            headerShown: false
        }}
      />
      <Stack>
        <Stack.Screen
          name={"index"}
          options={{
            headerTransparent: false,
            header: () => <ProfileTopHeader user={data} />,
          }}
        />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </AnimatedScrollProvider>
  );
};

export default Layout;
