import React from 'react';
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import Animated, {
    useAnimatedScrollHandler,
} from "react-native-reanimated";
import {Colors, defaultStyles} from "@shared/styles";
import { getFullExercise} from "@entities/exercise";
import {useQuery} from "@tanstack/react-query";
import {useLocalSearchParams} from "expo-router";
import {ExerciseMedia} from "@entities/media";
import {View} from "react-native";

const Overview = () => {

    const {id} = useLocalSearchParams<{id: string}>()
    const {scrollY} = useAnimatedScroll();

    const {data: exercise, isLoading} = useQuery({
        queryKey: ['exercise', id],
        queryFn: async () => await getFullExercise(id ? +id : 0),
        retry: 2,
        retryDelay: 5000
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