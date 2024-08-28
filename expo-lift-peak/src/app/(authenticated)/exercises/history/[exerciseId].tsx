import React from 'react';
import {Stack, useLocalSearchParams} from "expo-router";
import {useQuery} from "@tanstack/react-query";
import {findExerciseList} from "@entities/exercise";
import {getExerciseHistoryLogs} from "@features/exercise/history";
import {ScrollView, Text} from "react-native";
import ExerciseHistoryCardUi from "@features/exercise/history/ExerciseHistoryCard.ui";
import {defaultStyles} from "@shared/styles";

const ExerciseHistory = () => {
    const {exerciseId} = useLocalSearchParams<{exerciseId: string}>();

    const {data: exercisePreviews} = useQuery({
        queryKey: ['exercisePreview', exerciseId],
        queryFn: async () => findExerciseList({id: +exerciseId!, search: ''}),
        enabled: !!exerciseId
    })

    const {data} = useQuery({
        queryKey: ["exerciseHistory", exerciseId],
        queryFn: () => getExerciseHistoryLogs(+exerciseId!),
        enabled: !!exerciseId
    })

    return (
       <ScrollView style={defaultStyles.container} contentContainerStyle={{padding: 12, gap: 16}}>
           {exercisePreviews && data?.length ? data?.map(log => (
               <ExerciseHistoryCardUi key={log.id} exercise={exercisePreviews[0]} exerciseLog={log} />
           )) : (
               <Text style={defaultStyles.smallTitle}>No log found</Text>
           )}
       </ScrollView>
    );
};

    export default ExerciseHistory;