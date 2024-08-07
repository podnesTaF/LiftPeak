import React from 'react';
import {IExerciseLog} from "@entities/workout-log";
import {View, StyleSheet, Text, TouchableOpacity} from "react-native";
import {getExerciseTargetsToString} from "@features/workout-logger/utils";
import {useExerciseStore} from "@features/workout-logger/store/exerciseStore";
import {Colors} from "@shared/styles";
import Avatar from "@shared/components/Avatar";
import {Ionicons} from "@expo/vector-icons";

interface ExerciseItemProps {
    exerciseLog: IExerciseLog;
    onPress?: (exerciseLogId: number | string) => void;
}

export const ExerciseItem = ({exerciseLog, onPress}: ExerciseItemProps) => {
    const {getExerciseSetsStats} = useExerciseStore();
    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress ? onPress(exerciseLog.id) : null}>
           <View style={{flexDirection: "row", alignItems: "center", gap: 16}}>
               <Avatar name={""} size={64} url={exerciseLog.exercise?.previewUrl}>
                   <Ionicons name={"barbell"} size={40} color={Colors.white} />
               </Avatar>
               <View style={{justifyContent: "space-between", gap:12}}>
                   <View>
                       <Text style={{fontSize: 18, textTransform: "uppercase", fontWeight: "600", color: "white"}}>
                           {exerciseLog.exercise?.name}
                       </Text>
                       <Text style={{fontSize: 14, fontWeight: "500", color: Colors.dark300}}>
                           {getExerciseTargetsToString(exerciseLog.exercise?.exerciseTargets)}
                       </Text>
                   </View>
                   <View>
                       <Text style={{fontSize: 16, fontWeight: "700", color: Colors.lime}}>
                           {getExerciseSetsStats(exerciseLog.id).totalSets} / {getExerciseSetsStats(exerciseLog.id).setsDone} Sets Done
                       </Text>
                   </View>
               </View>
           </View>
            <Ionicons name={"chevron-forward"} size={32} color={Colors.lime} />
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
});
