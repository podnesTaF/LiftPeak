import React from 'react';
import {ScrollView} from "react-native";
import {defaultStyles} from "@shared/styles";
import InputField from "@shared/components/form/InputField";
import WorkoutLogger from "@features/workout-logger/ui/WorkoutLogger";
import {useWorkout} from "@features/workout-logger";

const Index = () => {
    const {workout, updateWorkoutField} = useWorkout(true)

    return (
        <ScrollView style={defaultStyles.container}>
            <InputField color={'transparent'} placeholder="Workout Title" value={workout?.title || ''} onChange={(text) => updateWorkoutField({title: text})} />
            <WorkoutLogger isRoutine />
        </ScrollView>
    );
};

export default Index;