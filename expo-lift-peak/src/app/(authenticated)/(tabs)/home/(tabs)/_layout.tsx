import React from 'react';
import {Colors, defaultStyles} from "@shared/styles";
import CustomTopTabBar from "@shared/components/navigation/CustomTopTabBar";
import MaterialTopTabs from "@shared/components/navigation/MaterialTopTabs";
import {Link, router, Stack} from "expo-router";
import {Platform, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import Constants from "expo-constants/src/Constants";
import Animated, {Extrapolation, interpolate, useAnimatedStyle, useSharedValue} from "react-native-reanimated";
import {Ionicons} from "@expo/vector-icons";
import {AnimatedScrollProvider} from "@shared/components/AnimatedScrollContext";
import {useAuthStore} from "@features/auth";
import {useQuery} from "@tanstack/react-query";
import {getUnseenCount, useNotificationStore} from "@entities/notifications";
import {useHeaderHeight} from "@react-navigation/elements";
import {BlurView} from "expo-blur";

const Layout = () => {
    const {user} = useAuthStore();
    const {unreadCount, updateUnreadCount} = useNotificationStore()
    const headerHeight = useHeaderHeight();

    const scrollY = useSharedValue(0);

    const {data} = useQuery({
        queryKey: ['newNotifications'],
        queryFn: async () => {
            const count = await getUnseenCount();
            updateUnreadCount(count);
            return count;
        },
        enabled: !!user?.id
    })

    const animatedHeaderStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scrollY.value, [0, 100], [0, 1]);
        return {
            opacity: opacity,
        };
    });

    const animatedTitleStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scrollY.value, [0, 30], [1, 0], Extrapolation.CLAMP);
        const top = interpolate(scrollY.value, [0, 30], [0, 30], Extrapolation.CLAMP);

        return {
            opacity:opacity,
            top:  -top ,
        };
    })


    return (
        <AnimatedScrollProvider scrollY={scrollY}>
        <Stack.Screen options={{
            headerShown: true,
            headerTransparent: true,
            headerShadowVisible: false,
            title: "Feed",
            headerTintColor: "#fff",
            header: ({navigation, options}) => (
                <BlurView tint={"dark"} intensity={50}>
                    <SafeAreaView style={{
                        paddingTop: Platform.OS === "android" ? Constants.statusBarHeight + 20 : 0,
                    }}>
                        <View style={{paddingHorizontal: 12, }}>
                            <Animated.View style={[{
                                position: "absolute",
                                alignItems: "center",
                                left: "50%",
                                transform: [{translateX: -10}],
                                justifyContent: "center",
                            }, animatedHeaderStyle]}>
                                <Text style={{color: "white", fontWeight: "700"}}>Feed</Text>
                            </Animated.View>
                            <Animated.View style={[{flexDirection: "row", paddingVertical: 8, paddingHorizontal: 8, justifyContent: "space-between", position: "relative"}]}>
                                <Animated.View style={[{
                                    paddingHorizontal: 12,
                                }, animatedTitleStyle]}>
                                    <Text style={defaultStyles.header}>Feed</Text>
                                </Animated.View>
                                <View style={{flexDirection: "row", gap: 16, alignItems: "center"}}>
                                    <Link href={"/(authenticated)/search"} asChild>
                                        <TouchableOpacity>
                                            <Ionicons name="search" size={32} color={Colors.dark300} />
                                        </TouchableOpacity>
                                    </Link>
                                    <TouchableOpacity onPress={() => router.push("/(authenticated)/(tabs)/home/notifications")}>
                                        <Ionicons name="notifications" size={32} color={Colors.dark300} />
                                        {unreadCount !== undefined && unreadCount > 0 && (
                                            <View style={{position: 'absolute', top: -4, right: 0, backgroundColor: Colors.success, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 20}}>
                                                <Text style={{color: "white", fontWeight: "500", fontSize: 10}}>
                                                    {unreadCount}
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </View>
                    </SafeAreaView>
                </BlurView>
            )
        }} />
            <CustomTopTabBar absolute={true}  paddingTop={headerHeight}>
                <MaterialTopTabs.Screen name={'followings'} options={{
                    title: "Followings",
                }} />
                <MaterialTopTabs.Screen name={'groups'} options={{
                    title: "Groups"
                }} />
                <MaterialTopTabs.Screen name={'discover'} options={{
                    title: "discover"
                }} />
            </CustomTopTabBar>
        </AnimatedScrollProvider>
    );
};

export default Layout;