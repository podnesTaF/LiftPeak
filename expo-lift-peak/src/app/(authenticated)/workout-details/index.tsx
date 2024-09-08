import React from 'react';
import {ScrollView, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {useLocalSearchParams} from "expo-router";
import {useQuery} from "@tanstack/react-query";
import {getWorkoutDetails} from "@features/workout";
import {WorkoutPostBody} from "@features/feed";

const WorkoutStats = () => {
    const {workoutId: id} = useLocalSearchParams<{ workoutId: string }>()

    const {data: workout} = useQuery({
        queryKey: ["workout", id],
        queryFn: async () => getWorkoutDetails(id!),
        enabled: !!id,
    })

    return (
        <ScrollView style={defaultStyles.container}>
            <View style={{marginVertical: 20, gap:12, paddingVertical: 12, backgroundColor: Colors.dark700}}>
                {workout && (
                    <WorkoutPostBody workout={workout} photosShown={true} />
                )}
            </View>
        </ScrollView>
    );
};

export default WorkoutStats;