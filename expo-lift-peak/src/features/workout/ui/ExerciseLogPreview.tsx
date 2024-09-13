import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {getExerciseTargetsToString, IExercise} from "@entities/exercise";
import Avatar from "@shared/components/Avatar";
import {SetType} from "@entities/workout-log";

interface ExerciseLogPreviewProps {
    exercise: IExercise;
    sets: number;
    restTime: number;
}

const ExerciseLogPreview = ({exercise, restTime, sets}: ExerciseLogPreviewProps) => {
    return (
        <View style={{padding: 8, backgroundColor: Colors.dark700, gap: 8, borderRadius: 12}}>
            <View style={{flexDirection: "row", alignItems: "center", gap: 12}}>
                <Avatar name={exercise.name[0]} url={exercise.previewUrl} size={60} borderRadius={8} />
               <View style={{gap: 6}}>
                   <Text style={defaultStyles.smallTitle}>
                       {exercise.name}
                   </Text>
                     <Text style={defaultStyles.secondaryText}>
                          {getExerciseTargetsToString(exercise.exerciseTargets)}
                        </Text>
               </View>
            </View>
            <View>
                <View style={defaultStyles.row}>
                    <Text style={[defaultStyles.smallTitle, {paddingVertical: 12}]}>
                        Sets
                    </Text>
                    <Text style={[defaultStyles.smallTitle, {paddingVertical: 12, color: Colors.success}]}>
                        Prev Result
                    </Text>
                </View>
                {Array.from({length: sets}).map((_, i) => (
                    <View key={i} style={[styles.setRow]}>
                        <Text style={defaultStyles.secondaryText}>
                            {(i + 1)}
                        </Text>
                        <Text style={defaultStyles.secondaryText}>
                            -
                        </Text>
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


export default ExerciseLogPreview;