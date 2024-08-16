import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {IWorkoutPreview} from "@features/workout";
import Avatar from "@shared/components/Avatar";
import {Ionicons} from "@expo/vector-icons";
import {useMutation} from "@tanstack/react-query";
import {addToRoutine} from "@entities/routine/api";

interface  RoutineCardProps {
    onPress?: (workoutId: number | string) => void;
    workout: IWorkoutPreview;
}

export const RoutineCard = ({workout, onPress}: RoutineCardProps) => {
    const {mutate} = useMutation({
        mutationKey: ["addToRoutine", workout.id],
        mutationFn: () => addToRoutine({workoutId: workout.id}),
    })

    return (
        <TouchableOpacity style={styles.container}  onPress={() => onPress && onPress(workout.id)}>
            <View style={{flexDirection: "row", justifyContent: "space-between", gap: 12}}>
                <View style={{flexDirection: 'row', gap: 12, alignItems: 'center'}}>
                    <Avatar size={20} name={workout.user?.username?.slice(0,2)  || ''} url={workout.user?.profile?.avatarUrl}>
                        <Ionicons name={"barbell"} size={16} color={Colors.dark300} />
                    </Avatar>
                    <Text style={[defaultStyles.smallTitle, {fontSize: 12}]}>
                        {workout.user?.username}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => mutate()}>
                    <Ionicons name={"add-outline"} color={"white"} size={24}/>
                </TouchableOpacity>
            </View>
            <Text style={defaultStyles.smallTitle}>
                {workout.title}
            </Text>
            <Text style={defaultStyles.secondaryText}>
                {workout.exercises.join(", ")}
            </Text>
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