import React from 'react';
import {Stack, Tabs, useLocalSearchParams, useRouter} from "expo-router";
import {Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {BlurView} from "expo-blur";
import {AnimatedScrollProvider} from "@shared/components/AnimatedScrollContext";
import Animated, {
    useSharedValue
} from "react-native-reanimated";
import {useQuery} from "@tanstack/react-query";
import {getUserInfo} from "@features/profile";
import ProfileTopHeader from "@features/profile/ui/ProfileTopHeader";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const Layout = () => {
    const {id} = useLocalSearchParams<{id?: string}>()
    const scrollY = useSharedValue(0);

    const {data} = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUserInfo(id),
        enabled: !!id
    })




    return (
        <AnimatedScrollProvider scrollY={scrollY}>
            <Tabs.Screen options={{
                headerTransparent: false,
                header: () => (
                   <ProfileTopHeader user={data} />
                ),
            }} />
            <Stack>
                <Stack.Screen name={"index"} options={{
                    headerShown: false
                }} />
            </Stack>
        </AnimatedScrollProvider>
    );
};

export default Layout;