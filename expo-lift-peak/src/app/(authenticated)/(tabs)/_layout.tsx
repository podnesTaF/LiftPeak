import React from 'react';
import {Link, Tabs} from 'expo-router';
import {Colors, defaultStyles} from "@shared/styles";
import {Ionicons} from "@expo/vector-icons";
import {Platform, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import Avatar from "@shared/components/Avatar";
import {useAuthStore} from "@features/auth";
import {useAssets} from "expo-asset";
import Animated, {
    interpolate,
    useAnimatedStyle,
} from "react-native-reanimated";
import {
    useAnimatedScroll
} from "@shared/components/AnimatedScrollContext";
import Constants from "expo-constants/src/Constants";
import {ActiveWorkoutPopup} from "@features/workout-logger";

function TabBarIcon(props: {
    name: React.ComponentProps<typeof Ionicons>['name'];
    color: string;
}) {
    return <Ionicons name={props.name} size={24} color={props.color} />;
}

export default function TabLayout() {

    const [assets] = useAssets([require("@assets/images/logo/logo-long.png")])
    const {user} = useAuthStore();


    const {scrollY} = useAnimatedScroll();

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
            <>
                <Tabs
                    screenOptions={{
                        headerShown: false,
                        tabBarActiveTintColor: "#fff",
                        tabBarInactiveTintColor: Colors.dark300,
                        tabBarStyle: {
                            backgroundColor: Colors.dark700,
                            borderTopWidth: 0,
                        }
                    }}>
                    <Tabs.Screen name={"home"} options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        title: "Feed",
                        tabBarIcon: (props) => <TabBarIcon name="newspaper" color={props.color} />,
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
                                            <TouchableOpacity>
                                                <Ionicons name="notifications" size={32} color={Colors.dark300} />
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
                    }}/>
                    <Tabs.Screen name={"start"} options={{
                        title: "Start",
                        headerShown: false,
                        tabBarIcon: (props) => <Ionicons size={36} name="add" color={props.color} />
                    }} />
                    <Tabs.Screen name={"logout"} options={{
                        title: "logout",
                        tabBarIcon: (props) => <TabBarIcon name="log-out-outline" color={props.color} />,
                    }} />
                </Tabs>
                <ActiveWorkoutPopup />
            </>
    );
}
