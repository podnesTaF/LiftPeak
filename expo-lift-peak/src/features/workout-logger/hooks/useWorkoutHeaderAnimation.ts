import {
    Easing,
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import {useEffect} from "react";

export const useWorkoutHeaderAnimation = (scrollHandler: any) => {

    const previousScrollY = useSharedValue(0);
    const isScrollingUp = useSharedValue(false);

    useEffect(() => {
        if (scrollHandler.value < previousScrollY.value - 40) {
            isScrollingUp.value = true;
        } else if (scrollHandler.value > previousScrollY.value + 40) {
            isScrollingUp.value = false;
        }

        previousScrollY.value = scrollHandler.value;
    }, [scrollHandler.value]);

    const headerTitleStyle = useAnimatedStyle(() => {
        const top = interpolate(scrollHandler.value, [0, 40], [0, -40], Extrapolation.CLAMP)
        return {
            top: scrollHandler.value > 0 ? top : 0,
            opacity: interpolate(scrollHandler.value, [0, 15], [1, 0])
        };
    });

    const clockTitleStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(scrollHandler.value, [15, 100], [0, 1]),
        };
    });


    const snackbarOpacity = useAnimatedStyle(() => {
        let isStart =  scrollHandler.value <= 0

        return {
            opacity: withTiming((isScrollingUp.value || isStart) ? 1 : 0, { duration: 100, easing: Easing.out(Easing.ease) }),
            position: isStart ? "relative" : "absolute",
        };
    });

    return { snackbarOpacity, clockTitleStyle, headerTitleStyle};
};