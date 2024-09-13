import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {BottomTabBarProps} from "@react-navigation/bottom-tabs";
import {Colors} from "@shared/styles";
import TabBarIcon from "@react-navigation/bottom-tabs/src/views/TabBarIcon";
import {Ionicons} from "@expo/vector-icons";
import TabBarItem from "@shared/components/navigation/TabBarItem";
import {ActiveWorkoutPopup, useWorkoutStore} from "@features/workout-logger";
import {useAuthStore} from "@features/auth";
import {useLocalSearchParams} from "expo-router";
import {BlurView} from "expo-blur";

const CustomTabBar = ({state, descriptors,navigation}: BottomTabBarProps) => {
    const {workout} = useWorkoutStore();
    const {user} = useAuthStore();
    const {id} = useLocalSearchParams<{id?: string}>();

    return (
        <>
            <ActiveWorkoutPopup />
            <BlurView intensity={100} tint={"dark"} style={[styles.container]}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];

                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TabBarItem
                            key={route.name}
                            routeName={route.name}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            label={label.toString()}
                            user={user}
                            userId={id ? +id : undefined}
                            isFocused={isFocused}
                        />
                    );
                })}
            </BlurView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 40,
        paddingVertical: 12,
        shadowColor: Colors.dark900,
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowRadius: 10,
        shadowOpacity: 0.1,
    },
    activeWorkout: {
        borderTopStartRadius: 0,
        borderTopEndRadius: 0,
    }
})

export default CustomTabBar;