import React from 'react';
import {IWorkout} from "@entities/workout";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {IWorkoutPreview} from "../model";
import {Colors, defaultStyles} from "@shared/styles";
import {Ionicons} from "@expo/vector-icons";
import Button from "@shared/components/Button";

interface RoutineCardProps {
    workout: IWorkoutPreview;
}

export const RoutineCard = ({workout}: RoutineCardProps) => {
    return (
        <View style={styles.container}>
            <View style={{flexDirection: "row", justifyContent: "space-between", gap: 12}}>
                <Text style={defaultStyles.smallTitle}>
                    {workout.title}
                </Text>
                <TouchableOpacity>
                    <Ionicons name={"ellipsis-horizontal"} color={"white"} size={24}/>
                </TouchableOpacity>
            </View>
            <Text style={defaultStyles.secondaryText}>
                {workout.exercises.join(", ")}
            </Text>
            <Button title={"Start Workout"} color={"success"} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
        gap: 12,
        backgroundColor: Colors.dark700,
        borderRadius: 12
    },

})

export default RoutineCard;