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

interface ExerciseSetRowProps {
    exerciseLogId: number | string;
    set: ISet;
    metric?: ExerciseMetric;
    index: number;
    exerciseLog?: IExerciseLog
}

export const ExerciseSetRow = ({exerciseLogId,set, metric = ExerciseMetric.reps, index, exerciseLog}: ExerciseSetRowProps) => {
    const {mode} = useWorkoutContext();
    const {removeSet, updateSet} = useWorkout(mode === "routine")
    const [values, setValues] = useState({
        reps: set.reps?.toString() || "",
        weight: set.weight?.toString()  || "",
        time: set.timeInS?.toString()  || "",
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
                time: previousSet.timeInS?.toString() || values.time,
                distanceInM: previousSet.distanceInM?.toString() || values.distanceInM,
            });
        }
    }, [exerciseLogId, set.order]);

    return (
        <SwipeableRow onLeftAction={changeComplete} leftActionText={"Done"} backgroundColor={Colors.dark900} actionTypes={["delete"]}  onDelete={() => removeSet(exerciseLogId, set.id)}>
            <Animated.View>
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
                                        placeholder={"reps"}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <InputField
                                        inputStyle={styles.input}
                                        keyboardType={"numeric"}
                                        value={values.weight}
                                        onChange={(text) => onChangeInput("weight", text)}
                                        placeholder={"kg"}
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
                                <View style={styles.inputContainer}>
                                    <InputField
                                        inputStyle={styles.input}
                                        placeholder={"Dist"}
                                        keyboardType={"numeric"}
                                        value={values.distanceInM}
                                        onChange={(text) => onChangeInput("distanceInM", text)}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <InputField
                                        inputStyle={styles.input}
                                        placeholder={"Time"}
                                        keyboardType={"numeric"}
                                        value={values.time}
                                        onChange={(text) => onChangeInput("time", text)}
                                    />
                                </View>
                            </>
                        )}
                        {metric === 'time' && (
                            <View style={styles.inputContainer}>
                                <InputField
                                    inputStyle={styles.input}
                                    keyboardType={"numeric"}
                                    value={values.time}
                                    onChange={(text) => onChangeInput("timeInS", text)}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </Animated.View>
        </SwipeableRow>
    );
};

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
        width: "29%",
        alignItems: "center"
    },
    input: {textAlign: "center", backgroundColor: Colors.dark500, fontWeight: "600"},
    inactiveInputText: {color: Colors.dark300}
});
export default ExerciseSetRow;