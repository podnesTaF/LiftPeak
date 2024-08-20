import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Colors, defaultStyles} from "@shared/styles";
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import Accordion from "@shared/components/Accordion";
import TableHead from "@features/exercise-logger/ui/ExerciseTableHead";
import ExerciseSetRow from "@features/exercise-logger/ui/ExerciseSetRow";
import {IExerciseLog, ISet, SetType} from "@entities/workout-log";
import {Color} from "ansi-fragments/build/fragments/Color";
import {useExerciseStore} from "@features/workout-logger";

interface ExpandableSetTypeProps {
    exerciseLog: IExerciseLog;
    setType: SetType;
}

export const ExpandableSetType = ({exerciseLog, setType}: ExpandableSetTypeProps) => {
    const open = useSharedValue(true);
    const {addSet} = useExerciseStore()
    const [typeSets, setTypeSets] = useState<ISet[]>([])

    const onPress = () => {
        open.value = !open.value;
    };

    useEffect(() => {
        setTypeSets(exerciseLog.sets?.filter(set => set.type === setType) || [])
    }, [exerciseLog.sets])

    const chevronStyle = useAnimatedStyle(() => {
        const rotation = interpolate(Number(open.value), [0, 1], [0, 90]);

        return {
            transform: [
                {
                    rotate: withTiming(`${rotation}deg`, {
                        duration: 200,
                    }),
                },
            ],
        };
    })

    const handleAddSet = () => {
        addSet(exerciseLog.id, {
            exerciseLogId: exerciseLog.id,
            order: typeSets.length ? typeSets.length + 1: 1,
            reps: 0,
            weight: 0,
            timeInS: 0,
            distanceInM: 0,
            type: setType,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    };


    return (
        <View style={styles.tableContainer}>
            <TouchableOpacity onPress={onPress} style={{flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, paddingHorizontal: 6}}>
                <View style={{flexDirection: "row", gap:12, alignItems: "center"}}>
                    {setType === SetType.warmup ? (
                        <Ionicons name={"flame"} color={Colors.lime} size={32} />
                    ): (
                        <Ionicons name={"barbell"} color={Colors.lime} size={32} />
                    )}
                    <Text style={styles.textHeading}>
                        {setType === SetType.warmup ? "Warm-up Sets" : "Working Sets"}
                    </Text>
                    <Animated.View style={chevronStyle}>
                        <Ionicons name={"chevron-forward"} color={Colors.lime} size={24} />
                    </Animated.View>
                </View>
                <TouchableOpacity style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                    <Ionicons name={"timer"} size={30} color={Colors.dark300} />
                    <Text style={{fontSize: 14, color: Colors.dark300, fontWeight: 600}}>
                        Off
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
            <Accordion viewKey={"accordion"} isExpanded={open}>
                <TableHead metric={exerciseLog.exercise?.metric} />
                {typeSets.map((set, index) => (
                    <ExerciseSetRow
                        key={set.id}
                        exerciseLogId={exerciseLog.id}
                        set={set}
                        index={index}
                        metric={exerciseLog.exercise?.metric}
                    />
                ))}
                <Pressable onPress={handleAddSet} style={({pressed}) => [{opacity: pressed ? 0.8 : 1, flexDirection: "row", gap: 8, alignItems:"center", width: "100%", padding: 12,}]}>
                    <View style={{borderRadius: 100, padding: 4, borderWidth: 2, borderColor: Colors.lime}}>
                        <Ionicons name={"add"} size={24} color={Colors.white} />
                    </View>
                    <Text style={[defaultStyles.secondaryText, {textTransform: "uppercase"}]}>
                                Add {setType === SetType.warmup ? "Warm-up Set" : "Working Set"}
                    </Text>
                </Pressable>
            </Accordion>
        </View>
    );
};


const styles = StyleSheet.create({
    tableContainer: {
        marginTop: 16,
    },
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    textHeading: {
        color: Colors.lime,
        fontSize: 18,
        fontWeight: "600"
    }
});
export default ExpandableSetType;