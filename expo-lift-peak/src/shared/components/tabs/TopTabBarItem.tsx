import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps, LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors } from "@shared/styles";

interface TopTabBarItemProps extends TouchableOpacityProps {
    label: string;
    isFocused: boolean;
    routeName: string;
    onPress: () => void;
    onLongPress: () => void;
    onLayout: (event: LayoutChangeEvent) => void;
}

const TopTabBarItem: React.FC<TopTabBarItemProps> = ({
                                                         onLayout,
                                                         isFocused,
                                                         label,
                                                         onPress,
                                                         onLongPress,
                                                         ...props
                                                     }) => {
    const opacity = useSharedValue(isFocused ? 1 : 0.5);

    // Animate opacity change when focus changes
    React.useEffect(() => {
        opacity.value = withTiming(isFocused ? 1 : 0.5, { duration: 150 });
    }, [isFocused]);

    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            color: isFocused ? Colors.white : Colors.dark300,
        };
    });

    return (
        <TouchableOpacity
            {...props}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.item}
            onLayout={onLayout}
        >
            <Animated.Text style={[animatedTextStyle, styles.text]}>
                {label.toString()}
            </Animated.Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        paddingHorizontal: 20,
    },
    text: {
        fontWeight: "500",
        fontSize: 16,
        textTransform: "capitalize",
    },
});

export default TopTabBarItem;
