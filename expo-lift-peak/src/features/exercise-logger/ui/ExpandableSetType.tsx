import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@shared/styles";
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import Accordion from "@shared/components/Accordion";
import TableHead from "@features/exercise-logger/ui/ExerciseTableHead";
import ExerciseSetRow from "@features/exercise-logger/ui/ExerciseSetRow";
import {IExerciseLog, SetType} from "@entities/workout-log";

interface ExpandableSetTypeProps {
    exerciseLog: IExerciseLog;
    setType: SetType;
}

export const ExpandableSetType = ({exerciseLog, setType}: ExpandableSetTypeProps) => {
    const open = useSharedValue(true);

    const onPress = () => {
        open.value = !open.value;
    };

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
                {exerciseLog!.sets!.map((set, index) => (
                    <ExerciseSetRow
                        key={set.id}
                        set={set}
                        index={index}
                        metric={exerciseLog.exercise?.metric}
                    />
                ))}
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