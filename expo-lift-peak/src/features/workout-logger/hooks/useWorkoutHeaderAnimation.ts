import {
    interpolate,
    useAnimatedStyle,
} from 'react-native-reanimated';

export const useWorkoutHeaderAnimation = (scrollHandler: any) => {
    const headerTitleStyle = useAnimatedStyle(() => {
        const top = interpolate(scrollHandler.value, [0, 40], [0, -40])
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
        const top = interpolate(scrollHandler.value, [0, 55], [0, -55]);
        return {
            opacity: interpolate(scrollHandler.value, [0, 100], [1, 0]),
            top: scrollHandler.value > 0 ? top : 0
        };
    });


    return { snackbarOpacity, clockTitleStyle, headerTitleStyle};
};