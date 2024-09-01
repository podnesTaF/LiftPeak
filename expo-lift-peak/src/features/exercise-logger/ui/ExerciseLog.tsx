import {useExerciseStore} from "@features/workout-logger";
import {Colors, defaultStyles} from "@shared/styles";
import {Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {ExpandableSetType} from "@features/exercise-logger/ui";
import {SetType} from "@entities/workout-log";
import TableHead from "./ExerciseTableHead";
import ExerciseSetRow from "./ExerciseSetRow";
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
