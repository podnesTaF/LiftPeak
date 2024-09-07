import React from 'react';
import {Colors, defaultStyles} from "@shared/styles";
import CustomTopTabBar from "@shared/components/navigation/CustomTopTabBar";
import MaterialTopTabs from "@shared/components/navigation/MaterialTopTabs";
import {Link, router, Stack} from "expo-router";
import {Platform, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import Constants from "expo-constants/src/Constants";
import Animated, {interpolate, useAnimatedStyle, useSharedValue} from "react-native-reanimated";
import Avatar from "@shared/components/Avatar";
import {Ionicons} from "@expo/vector-icons";
import {AnimatedScrollProvider} from "@shared/components/AnimatedScrollContext";
import {useAuthStore} from "@features/auth";
import {useQuery} from "@tanstack/react-query";
import {getUnseenCount, useNotificationStore} from "@entities/notifications";

const Layout = () => {
    const {user} = useAuthStore();
    const {unreadCount, updateUnreadCount} = useNotificationStore()

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

    const animatedMainStyle = useAnimatedStyle(() => {
        const paddingBottom = interpolate(scrollY.value, [0, 100], [60, 0]);
        return {
            paddingBottom: scrollY.value > 0 ? paddingBottom : 60,
        };
    });

    const animatedTitleStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scrollY.value, [0, 50], [1, 0]);
        const top = interpolate(scrollY.value, [0, 100], [75, 30]);

        return {
            opacity: scrollY.value > 0 ? opacity : 1,
            top: scrollY.value > 0 ? top : 75,
        };
    })


    return (
        <AnimatedScrollProvider scrollY={scrollY}>
        <Stack.Screen options={{
            headerShown: true,
            headerShadowVisible: false,
            title: "Feed",
            headerStyle: {
                backgroundColor: Colors.dark700
            },
            headerTintColor: "#fff",
            header: ({navigation, options}) => (
                <SafeAreaView style={{
                    backgroundColor: Colors.dark700,
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
                        <Animated.View style={[{flexDirection: "row", paddingVertical: 8, paddingHorizontal: 8, justifyContent: "space-between", position: "relative"}, animatedMainStyle]}>
                            <Avatar name={user?.username.slice(0,2)} size={50} />
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
                            <Animated.View style={[{
                                paddingHorizontal: 12,
                                position: "absolute",
                                top: 50,
                            }, animatedTitleStyle]}>
                                <Text style={defaultStyles.header}>Feed</Text>
                            </Animated.View>
                        </Animated.View>
                    </View>
                </SafeAreaView>
            )
        }} />
            <CustomTopTabBar>
                <MaterialTopTabs.Screen name={'followings'} options={{
                    title: "Followings"
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