import React, {useEffect, useRef} from 'react';
import {Link, router, Stack, Tabs, usePathname} from 'expo-router';
import {Colors, defaultStyles} from "@shared/styles";
import {Ionicons} from "@expo/vector-icons";
import {Platform, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import Avatar from "@shared/components/Avatar";
import {useAuthStore} from "@features/auth";
import {useAssets} from "expo-asset";
import Animated, {
    interpolate,
    useAnimatedStyle, useSharedValue,
} from "react-native-reanimated";
import {
    AnimatedScrollProvider,
    useAnimatedScroll
} from "@shared/components/AnimatedScrollContext";
import Constants from "expo-constants/src/Constants";
import {ActiveWorkoutPopup} from "@features/workout-logger";
import CustomTabBar from "@shared/components/navigation/CustomTabBar";
import CommentSheet from "@features/feed/ui/CommentSheet";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {useCommentStore} from "@features/feed";

function TabBarIcon(props: {
    name: React.ComponentProps<typeof Ionicons>['name'];
    color: string;
}) {
    return <Ionicons name={props.name} size={24} color={props.color} />;
}

export default function TabLayout() {



    return (
            <Tabs
                tabBar={props => <CustomTabBar {...props} />}>
                <Tabs.Screen name={"home"} options={{
                    headerShown: false,
                    tabBarIcon: (props) => <TabBarIcon name="newspaper" color={props.color} />,
                }}/>
                <Tabs.Screen name={"start"} options={{
                    title: "Start",
                    headerShown: false,
                    tabBarIcon: (props) => <Ionicons size={36} name="add" color={props.color} />
                }} />
                <Tabs.Screen name={"personal-profile"} options={{
                    title: "Profile",
                    tabBarIcon: (props) => <Ionicons size={36} name="person-outline" color={props.color} />,
                }} />
            </Tabs>
    );
}
