
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { Colors } from '@shared/styles';
import {BlurView} from "expo-blur";

interface CustomTopTabBarProps extends MaterialTopTabBarProps {
    paddingTop?: number;
}

const TopTabBar: React.FC<CustomTopTabBarProps> = ({ state, descriptors, navigation, paddingTop }) => {
    return (
        <View style={[styles.container, {position: "absolute",marginTop: paddingTop, width: "100%", left: 0}]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.title !== undefined ? options.title : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={[styles.tabItem, isFocused ? styles.tabItemFocused : {}]}
                    >
                        <Text style={[styles.tabText, isFocused ? styles.tabTextFocused : {}]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(43,44,52,0.9)',
        justifyContent: 'flex-start',
    },
    tabItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabItemFocused: {
        borderBottomColor: Colors.white,
        borderBottomWidth: 3,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.dark300,
    },
    tabTextFocused: {
        color: Colors.white,
    },
});

export default TopTabBar;