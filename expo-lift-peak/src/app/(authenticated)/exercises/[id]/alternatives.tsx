import React from 'react';
import {useQuery} from "@tanstack/react-query";
import {Link, useGlobalSearchParams, useLocalSearchParams, useRouter} from "expo-router";
import {ExerciseCard, getAlternativeExercisesShort} from "@entities/exercise";
import Animated, {useAnimatedScrollHandler} from "react-native-reanimated";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import {defaultStyles} from "@shared/styles";
import {ScrollView, TouchableOpacity} from "react-native";

const Alternatives = () => {
    const {exerciseId} = useLocalSearchParams<{ exerciseId: string }>();
    const {scrollY} = useAnimatedScroll();
    const router = useRouter();

    const {data} = useQuery({
        queryKey: ['exerciseAlternatives', exerciseId],
        queryFn: async () => await getAlternativeExercisesShort(exerciseId ? +exerciseId : 0),
        enabled: !!exerciseId
    })

    const onRedirect = (newExerciseId: number) => {
        router.setParams({id: newExerciseId+""})
        router.push(`/(authenticated)/exercises/${newExerciseId}`)
    }

    return (
        <ScrollView style={defaultStyles.container}>
            {data?.map((exercise, index) => (
                    <ExerciseCard onPress={(id) => onRedirect(+id)} exercise={exercise} key={exercise.id} />
                // <Link href={`/(authenticated)/exercises/${exercise.id}`} asChild={true} key={exercise.id} style={{width: "100%"}}>

                // </Link>
            ))}
        </ScrollView>
    );
};

export default Alternatives;