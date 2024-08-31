import {useExerciseStore} from "@features/workout-logger/store";
import {defaultStyles} from "@shared/styles";
import {KeyboardAvoidingView, Platform} from "react-native";
import React from "react";
import SetsTable from "@features/exercise-logger/ui/SetsTable";

const ExerciseLog = ({exerciseId}:{exerciseId: number | string}) => {
    const { getExerciseById, addSet } = useExerciseStore();
    const exerciseLog = getExerciseById(exerciseId);

    if (!exerciseLog) {
        return null;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
            style={[defaultStyles.container, {paddingBottom: 0, width: "100%"}]}
        >
            <SetsTable exerciseLog={exerciseLog} />
        </KeyboardAvoidingView>
    );
};



export default ExerciseLog;
