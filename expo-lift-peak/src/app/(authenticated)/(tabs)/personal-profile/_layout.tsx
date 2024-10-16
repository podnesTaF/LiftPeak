import React, { useEffect } from "react";
import CustomTopTabBar from "@shared/components/navigation/CustomTopTabBar";
import MaterialTopTabs from "@shared/components/navigation/MaterialTopTabs";
import { Stack, Tabs, useRouter } from "expo-router";
import { getUserInfo } from "@features/profile";
import { useAuthStore } from "@features/auth";
import { useQuery } from "@tanstack/react-query";
import { AnimatedScrollProvider } from "@shared/components/AnimatedScrollContext";
import {
  useSharedValue,
} from "react-native-reanimated";

import ProfileTopHeader from "@features/profile/ui/ProfileTopHeader";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";

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
            headerTransparent: true,
            header: () => <ProfileTopHeader type={"personal-profile"} name={data?.profile?.firstName + " " + data?.profile?.lastName} right={
              <TouchableOpacity>
                <Ionicons name={"ellipsis-horizontal"} size={30} color={"white"} />
              </TouchableOpacity>
            } />,
          }}
        />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </AnimatedScrollProvider>
  );
};

export default Layout;
