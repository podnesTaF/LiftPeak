import React from 'react';
import {Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {useExerciseStore} from "@features/workout-logger";
import {Ionicons} from "@expo/vector-icons";
import {Colors, defaultStyles} from "@shared/styles";
import Button from "@shared/components/Button";
import {white} from "colorette";
import InputField from "@shared/components/form/InputField";
import ExerciseSetRow from "@features/exercise-logger/ui/ExerciseSetRow";
import TableHead from "@features/exercise-logger/ui/ExerciseTableHead";

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
        <ScrollView keyboardDismissMode={"on-drag"} style={defaultStyles.container}>
            {exerciseLog.exercise?.previewUrl ? (
                <Image source={{uri: exerciseLog?.exercise.previewUrl}} style={{width: 150, height: 150}} />
            ) : (
                <Ionicons name={"barbell"} size={150} />
            )}
            <Text style={defaultStyles.header}>
                {exerciseLog.exercise?.name}
            </Text>
            <View style={styles.tableContainer}>
                <TableHead metric={exerciseLog.exercise?.metric} />
                {exerciseLog!.sets!.map(set => (
                    <ExerciseSetRow key={set.id} set={set} metric={exerciseLog.exercise?.metric} />
                ))}
            </View>
            <Button onPress={handleAddSet} title={"Add Set"} color={"white"}>
                <Ionicons name={"add"} size={24} color={Colors.dark700} />
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    tableContainer: {
        marginTop: 16,
    },
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: "600"
    }
})

export default ExerciseLog;