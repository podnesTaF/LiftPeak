import React from 'react';
import {Stack, Tabs, useLocalSearchParams, useRouter} from "expo-router";

import {AnimatedScrollProvider} from "@shared/components/AnimatedScrollContext";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue
} from "react-native-reanimated";
import {useQuery} from "@tanstack/react-query";
import {getUserInfo} from "@features/profile";
import ProfileTopHeader from "@features/profile/ui/ProfileTopHeader";
import Constants from "expo-constants";
import {Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Colors, defaultStyles} from "@shared/styles";
import {BlurView} from "expo-blur";

const Layout = () => {
    const {id} = useLocalSearchParams<{id?: string}>()
    const scrollY = useSharedValue(0);
    const router = useRouter();

    const {data} = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUserInfo(id),
        enabled: !!id
    })



    return (
        <AnimatedScrollProvider scrollY={scrollY}>
            <Stack.Screen options={{
                headerShown: true,
                headerTransparent: true,
                header: () => <ProfileTopHeader type={"profile"} name={data?.profile?.firstName + " " + data?.profile?.lastName} right={
                    <TouchableOpacity>
                        <Ionicons name={"ellipsis-horizontal"} size={30} color={"white"} />
                    </TouchableOpacity>
                } />,
            }} />
            <Stack>
                <Stack.Screen name={"index"} options={{
                    headerShown: false,
                }} />
            </Stack>
        </AnimatedScrollProvider>
    );
};

export default Layout;