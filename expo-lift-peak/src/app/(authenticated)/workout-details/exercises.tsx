import React from 'react';
import {ScrollView, Text} from "react-native";
import {defaultStyles} from "@shared/styles";
import {useQuery} from "@tanstack/react-query";
import {getWorkoutDetails} from "@features/workout";
import {useLocalSearchParams} from "expo-router";
import ExerciseHistoryCardUi from "@features/exercise/history/ExerciseHistoryCard.ui";

const Exercises = () => {
    const {workoutId: id} = useLocalSearchParams<{ workoutId: string }>()

    const {data: workout} = useQuery({
        queryKey: ["workout", id],
        queryFn: async () => getWorkoutDetails(id!),
        enabled: !!id,
    })

    return (
        <ScrollView style={defaultStyles.container} contentContainerStyle={{padding: 12, gap: 16}}>
            {workout?.workoutLog?.exerciseLogs?.map(log => (
                <ExerciseHistoryCardUi key={log.id} exercise={log.exercise} exerciseLog={log} history={false} />
            ))}
        </ScrollView>
    );
};

export default Exercises;