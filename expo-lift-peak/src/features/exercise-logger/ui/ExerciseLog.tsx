import {defaultStyles} from "@shared/styles";
import {KeyboardAvoidingView, Platform} from "react-native";
import React from "react";
import SetsTable from "@features/exercise-logger/ui/SetsTable";
import {IExerciseLog, ISet} from "@entities/workout-log";
import {useWorkout} from "@features/workout-logger/hooks";
import {useWorkoutContext} from "@features/workout/store/workoutContext";

interface ExerciseLogProps {
    exerciseLog: IExerciseLog;
}

const ExerciseLog = ({exerciseLog}: ExerciseLogProps) => {
    const {mode} = useWorkoutContext();
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
            style={[defaultStyles.container, {paddingBottom: 0, width: "100%"}]}
        >
            <SetsTable exerciseLog={exerciseLog} isRoutine={mode === 'routine'} />
        </KeyboardAvoidingView>
    );
};



export default ExerciseLog;
