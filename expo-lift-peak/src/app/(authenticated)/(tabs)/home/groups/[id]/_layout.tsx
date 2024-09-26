import React from 'react';
import {Stack, Tabs, useLocalSearchParams, useRouter} from "expo-router";
import Animated, {Extrapolation, interpolate, useAnimatedStyle, useSharedValue} from "react-native-reanimated";
import {useQuery} from "@tanstack/react-query";
import {getGroup} from "@entities/group";
import {AnimatedScrollProvider} from "@shared/components/AnimatedScrollContext";
import {Text, TouchableOpacity, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import Constants from "expo-constants";
import {Ionicons} from "@expo/vector-icons";
import {BlurView} from "expo-blur";
import ProfileTopHeader from "@features/profile/ui/ProfileTopHeader";

const Layout = () => {
    const {id} = useLocalSearchParams<{ id?: string }>()
    const scrollY = useSharedValue(0);
    const router = useRouter();
    const {data} = useQuery({
        queryKey: ['group', id],
        queryFn: () => getGroup(id),
        enabled: !!id
    })

    return (
        <AnimatedScrollProvider scrollY={scrollY}>
            <Stack.Screen options={{
               headerShown:false
            }}/>
            <Stack>
                <Stack.Screen name={"index"} options={{
                    headerShown: true,
                    headerTransparent: true,
                    header: () => (
                        <ProfileTopHeader name={data?.name || ''} type={"group"} right={
                            <TouchableOpacity>
                                <Ionicons name={"ellipsis-vertical"} size={30} color={"white"} />
                            </TouchableOpacity>
                        } />
                    ),
                }}/>
                <Stack.Screen name={"members"} options={{
                    headerShown: false
                }}/>
            </Stack>
        </AnimatedScrollProvider>
    );
};

export default Layout;