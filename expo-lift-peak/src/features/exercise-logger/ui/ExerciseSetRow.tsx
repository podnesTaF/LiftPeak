import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import InputField from "@shared/components/form/InputField";
import {IExerciseLog, ISet} from "@entities/workout-log";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@shared/styles";
import {ExerciseMetric} from "@entities/exercise";
import Animated from "react-native-reanimated";
import SwipeableRow from "@shared/components/SwipeableRow";
import {useWorkout} from "@features/workout-logger/hooks";
import {useWorkoutContext} from "@features/workout/store/workoutContext";
import {formatDistance, formatTimeInput} from '../utils/inputFormatters'
import TimePicker from "@shared/TimePicker";

interface ExerciseSetRowProps {
    exerciseLogId: number | string;
    set: ISet;
    metric?: ExerciseMetric;
    index: number;
    exerciseLog?: IExerciseLog;
    isRoutine?: boolean
}

export const ExerciseSetRow = ({exerciseLogId,set, metric = ExerciseMetric.reps, index, exerciseLog, isRoutine}: ExerciseSetRowProps) => {
    const {mode} = useWorkoutContext();
    const {updateSet} = useWorkout(mode === "routine")
    const [values, setValues] = useState({
        reps: set.reps?.toString() || "",
        weight: set.weight?.toString()  || "",
        timeIsS: set.timeInS?.toString()  || "",
        distanceInM: set.distanceInM?.toString() || "",
    });

    const changeComplete = () => {
        updateSet(set.exerciseLogId, {...set, completed: !set.completed});
    };

    const onChangeInput = (name: string, value: string) => {
        setValues({...values, [name]: value});
        updateSet(set.exerciseLogId, {...set, [name]: value});
    };

    useEffect(() => {
        const previousSet = exerciseLog?.previousSets?.find(s => s.order === set.order);

        if (previousSet) {
            setValues({
                reps: previousSet.reps?.toString() || values.reps,
                weight: previousSet.weight?.toString() || values.weight,
                timeIsS: previousSet.timeInS?.toString() || values.timeIsS,
                distanceInM: previousSet.distanceInM?.toString() || values.distanceInM,
            });
        }
    }, [exerciseLogId, set.order]);

    return (
            <View key={set.id}
                  style={[styles.row]}>
                <View style={{alignItems: "center", width: "8%"}}>
                    <TouchableOpacity onPress={changeComplete}>
                        {set.completed ? (
                            <Ionicons name={"checkmark-circle"} size={30}
                                      color={set.completed ? Colors.lime : Colors.dark300}/>
                        ) : (
                            <Text style={{color: 'white'}}>{index + 1}</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.metricContainer}>
                    {metric === 'reps' && (
                        <>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.text, {fontSize: 12, color: Colors.dark300}]}>
                                    100kg x 10
                                </Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <InputField
                                    inputStyle={styles.input}
                                    keyboardType={"numeric"}
                                    value={values.reps}
                                    onChange={(text) => onChangeInput("reps", text)}
                                    placeholder={"Reps"}
                                />
                            </View>
                            <View style={{backgroundColor: Colors.dark500, padding: 12, paddingHorizontal: 4, borderRadius: 10 }}>
                                <TimePicker exerciseLog={exerciseLog} initValue={+values.timeIsS} onChange={(text) => onChangeInput("timeInS", text)}/>
                            </View>
                            <View style={styles.inputContainer}>
                                <InputField
                                    inputStyle={styles.input}
                                    keyboardType={"numeric"}
                                    value={values.weight}
                                    onChange={(text) => onChangeInput("weight", text)}
                                    placeholder={"Kg"}
                                />
                            </View>
                        </>
                    )}
                    {metric === ExerciseMetric.distance && (
                        <>
                            <View style={styles.inputContainer}>
                                <Text
                                    style={[styles.text, {fontSize: 14, fontWeight: "600", color: Colors.dark300}]}>
                                    10km in 59:00
                                </Text>
                            </View>
                            <View style={{backgroundColor: Colors.dark500, padding: 12, paddingHorizontal: 4, borderRadius: 10 }}>
                                <TimePicker exerciseLog={exerciseLog} initValue={+values.timeIsS} onChange={(text) => onChangeInput("timeInS", text)}/>
                            </View>
                            <View style={styles.inputContainer}>
                                <InputField
                                    inputStyle={styles.input}
                                    placeholder="km.mm"
                                    keyboardType={"number-pad"}
                                    mask={'99,99'}
                                    onChange={(formatted) => {
                                        onChangeInput("distanceInM", formatDistance(formatted));
                                    }}
                                    value={values.distanceInM}
                                />
                            </View>
                        </>
                    )}
                    {metric === 'time' && (
                        <View style={styles.inputContainer}>
                            <InputField
                                inputStyle={styles.input}
                                keyboardType={"numeric"}
                                value={values.timeIsS}
                                onChange={(text) => onChangeInput("timeInS", text)}
                            />
                        </View>
                    )}
                </View>
            </View>
    );
};

export const ExerciseSwipeableRow = ({exerciseLogId, set, children}: {exerciseLogId: number | string, set: ISet, children: React.ReactNode}) => {
    const {removeSet, updateSet} = useWorkout()

    const changeComplete = () => {
        updateSet(set.exerciseLogId, {...set, completed: !set.completed});
    };

    return (
        <SwipeableRow onLeftAction={changeComplete} leftActionText={"Done"} backgroundColor={Colors.dark900} actionTypes={["delete"]}  onDelete={() => removeSet(exerciseLogId, set.id)}>
            <Animated.View>
                {children}
            </Animated.View>
        </SwipeableRow>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        gap: 16,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: "600"
    },
    metricContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        width: "94%"
    },
    inputContainer: {
        width: "30%",
        alignItems: "center"
    },
    input: {textAlign: "center", backgroundColor: Colors.dark500, fontWeight: "500", fontSize: 14, textTransform: "uppercase"},
    inactiveInputText: {color: Colors.dark300}
});
export default ExerciseSetRow;