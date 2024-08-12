import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {BottomTabBarProps} from "@react-navigation/bottom-tabs";
import {Colors} from "@shared/styles";
import TabBarIcon from "@react-navigation/bottom-tabs/src/views/TabBarIcon";
import {Ionicons} from "@expo/vector-icons";
import TabBarItem from "@shared/components/navigation/TabBarItem";
import {ActiveWorkoutPopup, useWorkoutStore} from "@features/workout-logger";

const CustomTabBar = ({state, descriptors,navigation}: BottomTabBarProps) => {
    const {workout} = useWorkoutStore();
    return (
        <>
            <ActiveWorkoutPopup />
            <View style={[styles.container, workout && styles.activeWorkout]}>
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
                            isFocused={isFocused}
                        />
                    );
                })}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 40,
        marginHorizontal: 20,
        backgroundColor: Colors.dark900,
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