import React, { useEffect, useState } from 'react';
import {View, StyleSheet, LayoutChangeEvent, ScrollView} from 'react-native';
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
} from 'react-native-reanimated';
import { Colors } from "@shared/styles";
import TopTabBarItem from "@shared/components/tabs/TopTabBarItem";

export default function CustomTopTabBar({ state, descriptors, navigation }: MaterialTopTabBarProps) {
    const [tabWidths, setTabWidths] = useState<number[]>([]);
    const translateX = useSharedValue(0);
    const indicatorWidth = useSharedValue(0);

    useEffect(() => {
        if (tabWidths.length === state.routes.length) {
            const newTranslateX = tabWidths.slice(0, state.index).reduce((acc, width) => acc + width, 0);

            translateX.value = withTiming(newTranslateX, { duration: 150 });
            indicatorWidth.value = withTiming(tabWidths[state.index], { duration: 150 });
        }
    }, [state.index, tabWidths]);

    const handleLayout = (event: LayoutChangeEvent, index: number) => {
        const { width } = event.nativeEvent.layout;
        setTabWidths((prevWidths) => {
            const newWidths = [...prevWidths];
            newWidths[index] = width;
            return newWidths;
        });
    };

    const animatedIndicatorStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
            width: indicatorWidth.value,
        };
    });

    return (
        <View  style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled={true}
                snapToInterval={60}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
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
                    <TopTabBarItem
                        routeName={route.name}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        label={label.toString()}
                        isFocused={isFocused}
                        key={route.key}
                        onLayout={(e) => handleLayout(e, index)}
                    />
                );
            })}
            {tabWidths.length === state.routes.length && (
                <Animated.View style={[styles.indicator, animatedIndicatorStyle]} />
            )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: Colors.dark700,
        position: 'relative',
    },
    indicator: {
        position: 'absolute',
        bottom: 0,
        height: 3,
        backgroundColor: Colors.white,
        borderRadius: 3
    },
    scrollViewContent: {
        flexDirection: "row",
        alignItems: "center",
    },
});
