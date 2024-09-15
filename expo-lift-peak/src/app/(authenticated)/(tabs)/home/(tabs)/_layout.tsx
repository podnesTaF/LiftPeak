import React from 'react';
import {Colors, defaultStyles} from "@shared/styles";
import MaterialTopTabs from "@shared/components/navigation/MaterialTopTabs";
import {Link, router, Stack} from "expo-router";
import {Platform, SafeAreaView, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import Constants from "expo-constants/src/Constants";
import Animated, {
    Extrapolation,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue
} from "react-native-reanimated";
import {Ionicons} from "@expo/vector-icons";
import {AnimatedScrollProvider} from "@shared/components/AnimatedScrollContext";
import {useAuthStore} from "@features/auth";
import {useQuery} from "@tanstack/react-query";
import {getUnseenCount, useNotificationStore} from "@entities/notifications";
import {useHeaderHeight} from "@react-navigation/elements";
import {BlurView} from "expo-blur";
import TopTabBar from "@shared/components/navigation/TopTabBar";

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

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

    const animatedBackgroundStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            scrollY.value,
            [0, 50],
            ['rgba(26,27,33,1)', 'rgba(26,27,33,0.3)']  // From white to black
        );
        return { backgroundColor };
    });

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
            header: () => (
                <AnimatedSafeAreaView style={[styles.safeArea,animatedBackgroundStyle]}>
                            <View style={{paddingHorizontal: 12 }}>
                                <Animated.View style={[styles.headerTitleContainer, animatedHeaderStyle]}>
                                    <Text style={styles.headerTitleText}>Feed</Text>
                                </Animated.View>
                                <Animated.View style={[styles.headerContent]}>
                                    <Animated.View style={[{
                                        paddingHorizontal: 12,
                                    }, animatedTitleStyle]}>
                                        <Text style={defaultStyles.header}>Feed</Text>
                                    </Animated.View>
                                    <View style={styles.iconsContainer}>
                                        <Link href={"/(authenticated)/search"} asChild>
                                            <TouchableOpacity>
                                                <Ionicons name="search" size={32} color={Colors.dark300} />
                                            </TouchableOpacity>
                                        </Link>
                                        <TouchableOpacity onPress={() => router.push("/(authenticated)/(tabs)/home/notifications")}>
                                            <Ionicons name="notifications" size={32} color={Colors.dark300} />
                                            {unreadCount !== undefined && unreadCount > 0 && (
                                                <View style={styles.notificationBadge}>
                                                    <Text style={styles.notificationText}>
                                                        {unreadCount}
                                                    </Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>
                            </View>
                        </AnimatedSafeAreaView>
            )
        }} />
        <MaterialTopTabs tabBar={(props) => <TopTabBar {...props} containerStyle={{
            marginTop: headerHeight
        }} />} screenOptions={{
            animationEnabled: false,
            swipeEnabled: false,
        }}>
            <MaterialTopTabs.Screen name={'followings'} options={{
                title: "Followings",
            }} />
            <MaterialTopTabs.Screen name={'groups'} options={{
                title: "Groups"
            }} />
            <MaterialTopTabs.Screen name={'discover'} options={{
                title: "discover"
            }} />
        </MaterialTopTabs>
        </AnimatedScrollProvider>
    );
};

const styles =  StyleSheet.create({
    safeArea: {
        paddingTop: Platform.OS === "android" ? Constants.statusBarHeight + 20 : 0,
    },
    headerTitleContainer: {
        position: 'absolute',
        alignItems: 'center',
        left: '50%',
        transform: [{ translateX: -10 }],
        justifyContent: 'center',
    },
    headerTitleText: {
        color: 'white',
        fontWeight: '700',
    },
    headerContent: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 8,
        justifyContent: 'space-between',
        position: 'relative',
    },
    iconsContainer: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    notificationBadge: {
        position: 'absolute',
        top: -4,
        right: 0,
        backgroundColor: Colors.success,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 20,
    },
    notificationText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 10,
    },
});

export default Layout;