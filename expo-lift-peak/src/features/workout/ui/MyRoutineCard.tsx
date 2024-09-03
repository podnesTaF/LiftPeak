import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {IWorkoutPreview} from "../model";
import {Colors, defaultStyles} from "@shared/styles";
import {Ionicons} from "@expo/vector-icons";
import Button from "@shared/components/Button";

interface RoutineCardProps {
    workout: IWorkoutPreview;
    onPress?: (workoutId: number | string) => void;
    startable?: boolean;
    onPressStart?: (workoutId: number | string) => void;
}

export const MyRoutineCard = ({workout, onPress, startable, onPressStart}: RoutineCardProps) => {

    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress && onPress(workout.id)}>
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
            {startable && <Button onPress={() => onPressStart && onPressStart(workout.id)} title={"Start Workout"} color={"success"}/>}
        </TouchableOpacity>
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

export default MyRoutineCard;