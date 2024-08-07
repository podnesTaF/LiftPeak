import React from 'react';
import {Image, KeyboardAvoidingView, StyleSheet, Text, View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {useExerciseStore} from "@features/workout-logger";
import {Ionicons} from "@expo/vector-icons";
import {Colors, defaultStyles} from "@shared/styles";
import Button from "@shared/components/Button";
import {white} from "colorette";
import InputField from "@shared/components/form/InputField";
import ExerciseSetRow from "@features/exercise-logger/ui/ExerciseSetRow";

const ExerciseLog = () => {
    const { id } = useLocalSearchParams() as {id: string};

    const {getExerciseById, addSet} = useExerciseStore();

    const exerciseLog = getExerciseById(id);

    if(!exerciseLog) {
        return null;
    }

    const handleAddSet = () => {
        addSet(exerciseLog.id,{
            exerciseLogId: exerciseLog.id,
            order: exerciseLog.sets?.length ? exerciseLog.sets.length + 1 : 1,
            reps: 0,
            weight: 0,
            type: "workout",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })
    }

    return (
        <KeyboardAvoidingView style={defaultStyles.container}>
            {exerciseLog.exercise?.previewUrl ? (
                <Image source={{uri: exerciseLog?.exercise.previewUrl}} style={{width: 150, height: 150}} />
            ) : (
                <Ionicons name={"barbell"} size={150} />
            )}
            <Text style={defaultStyles.header}>
                {exerciseLog.exercise?.name}
            </Text>
            {exerciseLog!.sets!.map(set => (
                <ExerciseSetRow set={set} />
            ))}
            <Button onPress={handleAddSet} title={"Add Set"} color={"white"}>
                <Ionicons name={"add"} size={24} color={Colors.dark700} />
            </Button>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: "600"
    }
})

export default ExerciseLog;