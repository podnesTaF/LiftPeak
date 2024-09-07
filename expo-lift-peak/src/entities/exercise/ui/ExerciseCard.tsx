import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text} from "react-native";
import {IExercise} from "@entities/exercise";
import {Colors, defaultStyles} from "@shared/styles";
import Avatar from "@shared/components/Avatar";
import {Ionicons} from "@expo/vector-icons";
import {getExerciseTargetsToString} from "@entities/exercise/utils";
import {useRouter} from "expo-router";

interface ExerciseCardProps {
    onPress?: (exercise: IExercise | Partial<IExercise> & { id: number, targetGroup: string[] }) => void;
    exercise: IExercise | Partial<IExercise> & { id: number, targetGroup: string[] };
    selected?: boolean;
}

export const ExerciseCard = ({onPress, exercise, selected}: ExerciseCardProps) => {
    const router = useRouter();
    return (
        <TouchableOpacity activeOpacity={0.9} onPress={() => onPress ? onPress(exercise) : null} style={styles.container}>
            <View style={{flexDirection: "row", alignItems: "center", gap: 16}}>
                <View style={{overflow: "hidden"}}>
                    <Avatar name={""} size={60} url={exercise.previewUrl}>
                        <Ionicons name={"barbell"} size={40} color={Colors.white}/>
                    </Avatar>
                    {selected && (
                        <View style={styles.selectedIndicator}>
                            <Ionicons name={"checkmark"} size={32} color={Colors.success}/>
                        </View>
                    )}
                </View>
                <View style={{gap:8}}>
                    <Text style={defaultStyles.smallTitle}>
                        {exercise.name}
                    </Text>
                    <Text style={{fontSize: 14, fontWeight: "500", color: Colors.dark300}}>
                        {exercise.targetGroup ? (
                            exercise.targetGroup.join(" • ")
                        ) : getExerciseTargetsToString(exercise.exerciseTargets)}
                    </Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => router.push(`/(authenticated)/exercises/${exercise.id}`)}>
                <Ionicons name={"information-circle-outline"} size={28} color={Colors.white}/>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16
    },
    selectedIndicator: {
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default ExerciseCard;