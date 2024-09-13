import React from 'react';
import {ScrollView, Text, View} from "react-native";
import {useGeneratedStore} from "@features/constructor/store/generatedStore";
import {defaultStyles} from "@shared/styles";
import ExerciseLogPreview from "@features/workout/ui/ExerciseLogPreview";

const Exercises = () => {
    const {suggestedExercises} = useGeneratedStore()
    return (
        <ScrollView style={defaultStyles.container} contentContainerStyle={{padding: 12, gap: 12}}>
            {suggestedExercises.map((e, index) => (
                <ExerciseLogPreview key={index + "_" + e.exercise.id} exercise={e.exercise} sets={e.sets} restTime={e.restTime} />
            ))}
        </ScrollView>
    );
};

export default Exercises;