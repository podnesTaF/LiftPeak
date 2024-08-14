import React from 'react';
import {useQuery} from "@tanstack/react-query";
import {Link, useGlobalSearchParams, useRouter} from "expo-router";
import {ExerciseCard, getAlternativeExercisesShort} from "@entities/exercise";
import Animated, {useAnimatedScrollHandler} from "react-native-reanimated";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import {defaultStyles} from "@shared/styles";

const Alternatives = () => {
    const {id} = useGlobalSearchParams<{id: string}>()
    const {scrollY} = useAnimatedScroll();
    const router = useRouter();

    const {data} = useQuery({
        queryKey: ['exerciseAlternatives', id],
        queryFn: async () => await getAlternativeExercisesShort(id ? +id : 0),
        retry: 2,
        retryDelay: 5000
    })

    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    })

    return (
        <Animated.ScrollView scrollEventThrottle={16} onScroll={scrollHandler} style={[defaultStyles.container]}>
            {data?.map((exercise, index) => (
                <Link href={`/(authenticated)/exercise?id=${exercise.id}`} key={exercise.id} asChild style={{width: "100%"}}>
                    <ExerciseCard exercise={exercise} key={exercise.id} />
                </Link>
            ))}
        </Animated.ScrollView>
    );
};

export default Alternatives;