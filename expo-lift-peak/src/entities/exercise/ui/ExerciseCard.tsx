import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text} from "react-native";
import {IExercise} from "@entities/exercise";
import {Colors} from "@shared/styles";
import Avatar from "@shared/components/Avatar";
import {Ionicons} from "@expo/vector-icons";
import {getExerciseTargetsToString} from "@entities/exercise/utils";

interface ExerciseCardProps {
    onPress?: (exerciseId: number | string) => void;
    exercise: IExercise | Partial<IExercise> & {id: number, targetGroup: string[] };
    selected?: boolean;
}

export const ExerciseCard = ({onPress, exercise, selected}: ExerciseCardProps) => {

    return (
        <TouchableOpacity onPress={() => onPress ? onPress(exercise.id) : null} style={styles.container}>
            <View style={{flexDirection: "row", alignItems: "center", gap: 16}}>
                <Avatar name={""} size={64} url={exercise.previewUrl}>
                    <Ionicons name={"barbell"} size={40} color={Colors.white} />
                </Avatar>
                <View>
                    <Text style={{fontSize: 18, textTransform: "uppercase", fontWeight: "600", color: "white"}}>
                        {exercise.name}
                    </Text>
                    <Text style={{fontSize: 14, fontWeight: "500", color: Colors.dark300}}>
                        {exercise.targetGroup ? (
                            exercise.targetGroup.join(" • ")
                        ) : getExerciseTargetsToString(exercise.exerciseTargets)}
                    </Text>
                </View>
            </View>
            {selected && <Ionicons name={"checkmark"} size={32} color={Colors.lime} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark500,
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems:"center",
        justifyContent: "space-between",
        gap:16
    }
})

export default ExerciseCard;