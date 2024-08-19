import React from 'react';
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import Animated, {
    useAnimatedScrollHandler,
} from "react-native-reanimated";
import {Colors, defaultStyles} from "@shared/styles";
import { getFullExercise} from "@entities/exercise";
import {useQuery} from "@tanstack/react-query";
import {useGlobalSearchParams, useLocalSearchParams} from "expo-router";
import {ExerciseMedia} from "@entities/media";

const Overview = () => {
    const {exerciseId} = useLocalSearchParams<{exerciseId: string}>();
    const {scrollY} = useAnimatedScroll();

    const {data: exercise, isLoading} = useQuery({
        queryKey: ['exercise', exerciseId],
        queryFn: async () => await getFullExercise(exerciseId ? +exerciseId : 0),
        retry: 2,
        retryDelay: 5000,
        enabled: !!exerciseId
    })

    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    })


    return (
        <Animated.ScrollView scrollEventThrottle={16} onScroll={scrollHandler} style={[defaultStyles.container]}>
                <ExerciseMedia mediaFiles={exercise?.mediaFiles} isLoading={isLoading} />
        </Animated.ScrollView>
    );
};

export default Overview;