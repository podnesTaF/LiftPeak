import React, { useMemo } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { BottomSheetHandleProps } from "@gorhom/bottom-sheet";
import Animated, {
    Extrapolate, Extrapolation,
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
} from "react-native-reanimated";
import { toRad } from "react-native-redash";

// @ts-ignore
export const transformOrigin = ({ x, y }, ...transformations) => {
    "worklet";
    return [
        { translateX: x },
        { translateY: y },
        ...transformations,
        { translateX: x * -1 },
        { translateY: y * -1 },
    ];
};

interface HandleProps extends BottomSheetHandleProps {
    style?: StyleProp<ViewStyle>;
    isIndex1: boolean;
}

const Handle: React.FC<HandleProps> = ({ style, animatedIndex,isIndex1 }) => {
    const indicatorTransformOriginY = useDerivedValue(() =>
        interpolate(animatedIndex.value, [0, 1], [0, 1], Extrapolation.CLAMP)
    );

    //#region styles
    const containerStyle = useMemo(() => [styles.header, style], [style]);
    const containerAnimatedStyle = useAnimatedStyle(() => {
        const borderTopRadius = interpolate(
            animatedIndex.value,
            [1, 2],
            [20, 0],
            Extrapolation.CLAMP
        );
        return {
            borderTopLeftRadius: borderTopRadius,
            borderTopRightRadius: borderTopRadius,
        };
    });
    const leftIndicatorStyle = useMemo(
        () => ({
            ...styles.indicator,
            ...styles.leftIndicator,
        }),
        []
    );
    const leftIndicatorAnimatedStyle = useAnimatedStyle(() => {
        const leftIndicatorRotate = interpolate(
            animatedIndex.value,
            [0, 1],
            [toRad(-30), 0, toRad(30)],
            Extrapolation.CLAMP
        );
        const opacity = interpolate(
            animatedIndex.value,
            [0.8, 1],
            [1, 0],
            Extrapolation.CLAMP
        );

        return {
            transform: transformOrigin(
                { x: 0, y: indicatorTransformOriginY.value },
                {
                    rotate: `${leftIndicatorRotate}rad`,
                },
                {
                    translateX: -11,
                }
            ),
            opacity,
        };
    });
    const rightIndicatorStyle = useMemo(
        () => ({
            ...styles.indicator,
            ...styles.rightIndicator,
        }),
        []
    );

    // If isIndex1 is true, hide the right indicator
    const rightIndicatorAnimatedStyle = useAnimatedStyle(() => {
        const rightIndicatorRotate = interpolate(
            animatedIndex.value,
            [0, 1],
            [toRad(30), 0, toRad(-30)],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            animatedIndex.value,
            [0.8, 1],
            [1, 0],
            Extrapolation.CLAMP
        );

        return {
            transform: transformOrigin(
                { x: 0, y: indicatorTransformOriginY.value },
                {
                    rotate: `${rightIndicatorRotate}rad`,
                },
                {
                    translateX: 11,
                }
            ),
            opacity,
        };
    });

    //#endregion

    const swipeTextAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            animatedIndex.value,
            [0.9, 1],  // Text fades in when almost reaching index 1
            [0, 1],    // Fade in at index 1
            Extrapolation.CLAMP
        );

        return {
            opacity,
        };
    });

    // render
    return (
        <Animated.View
            style={[containerStyle, containerAnimatedStyle]}
            renderToHardwareTextureAndroid={true}
        >
            <Animated.View
                style={[leftIndicatorStyle, leftIndicatorAnimatedStyle]}
            />
            <Animated.View
                style={[rightIndicatorStyle, rightIndicatorAnimatedStyle]}
            />
            {/* "Swipe to open" text */}
            {isIndex1 && (
                <Animated.Text style={[styles.swipeText, swipeTextAnimatedStyle]}>
                    Swipe to open
                </Animated.Text>
            )}
        </Animated.View>
    );
};

export default Handle;

const styles = StyleSheet.create({
    header: {
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        paddingVertical: 16,
    },
    indicator: {
        position: "absolute",
        width: 24,
        height: 6,
        backgroundColor: "white",
    },
    leftIndicator: {
        borderTopStartRadius: 3,
        borderBottomStartRadius: 3,
    },
    rightIndicator: {
        borderTopEndRadius: 3,
        borderBottomEndRadius: 3,
    },
    swipeText: {
        position: "absolute",
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 14,
        textAlign: 'center',
    },
});