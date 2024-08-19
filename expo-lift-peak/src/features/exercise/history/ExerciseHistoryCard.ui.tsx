import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {IExercise} from "@entities/exercise";
import {IExerciseLog, SetType} from "@entities/workout-log";
import {Colors, defaultStyles} from "@shared/styles";
import Avatar from "@shared/components/Avatar";
import {format} from "date-fns";
import {Ionicons} from "@expo/vector-icons";
import {Color} from "ansi-fragments/build/fragments/Color";

interface ExerciseHistoryCardUiProps {
    exercise: Partial<IExercise> & any,
    exerciseLog: IExerciseLog
}

const ExerciseHistoryCard = ({exerciseLog, exercise}: ExerciseHistoryCardUiProps) => {

    return (
        <View style={{padding: 12, borderRadius: 10, backgroundColor: Colors.dark700, gap: 20}}>
            <TouchableOpacity style={[defaultStyles.row, {gap: 14, width: "100%"}]}>
                <View style={[defaultStyles.row, {gap: 14}]}>
                    <Avatar name={exercise.name?.slice(0, 2)} size={70} borderRadius={10}/>
                    <View style={{gap: 12}}>
                        <View style={{gap: 8}}>
                            <Text style={defaultStyles.smallTitle}>
                                {exercise.name}
                            </Text>
                            <Text style={defaultStyles.secondaryText}>
                                {exercise.targetGroup?.join(" • ")}
                            </Text>
                        </View>
                        <Text style={defaultStyles.secondaryText}>
                            {format(new Date(exerciseLog.createdAt), "MMMM d, yyyy")}
                        </Text>
                    </View>
                </View>
                <Ionicons name={"chevron-forward"} size={30} color={Colors.lime}/>
            </TouchableOpacity>
            <View>
                <Text style={[defaultStyles.smallTitle, {paddingVertical: 12}]}>
                    Sets
                </Text>
                {exerciseLog.sets?.sort((a, b) => a.type === SetType.warmup ? -1 : 1)?.map((set, i) => (
                    <View key={set.id} style={[styles.setRow]}>
                            <Text style={defaultStyles.secondaryText}>
                                {set.type === SetType.warmup ? "Warm-up" : (i + 1)}
                            </Text>
                        {set.type !== SetType.warmup && (
                            <>
                                {set.reps !== null && set.weight !== null && (
                                    <Text style={defaultStyles.secondaryText}>
                                        {set.weight}kg x {set.reps} reps
                                    </Text>
                                )}
                                {set.distanceInM !== null && set.timeInS !== null && (
                                    <Text style={defaultStyles.secondaryText}>
                                        {set.distanceInM / 1000}km in {Math.floor(set.timeInS / 60)}:{set.timeInS % 60} min
                                    </Text>
                                )}
                                {set.timeInS !== null && set.weight === null && set.reps === null && set.distanceInM === null && (
                                    <Text style={defaultStyles.secondaryText}>
                                        {Math.floor(set.timeInS / 60)}:{(set.timeInS % 60 < 10 ? `0${set.timeInS % 60}`: set.timeInS % 60)} min
                                    </Text>
                                )}
                            </>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    setRow: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent:  'space-between',
        alignItems: 'center',
        borderBottomColor: Colors.dark500,
        borderBottomWidth: StyleSheet.hairlineWidth,
    }
})

export default ExerciseHistoryCard;