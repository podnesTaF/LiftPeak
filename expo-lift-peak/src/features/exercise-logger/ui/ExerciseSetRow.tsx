import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import InputField from "@shared/components/form/InputField";
import {ISet} from "@entities/workout-log";
import {useExerciseStore} from "@features/workout-logger";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@shared/styles";
import {ExerciseMetric} from "@entities/exercise";
import {Color} from "ansi-fragments/build/fragments/Color";
import * as Haptics from "expo-haptics";
import Animated, {FadeInUp, FadeOutUp} from "react-native-reanimated";
import SwipeableRow from "@shared/components/SwipeableRow";

interface ExerciseSetRowProps {
    set: ISet;
    metric?: ExerciseMetric;
    index: number
}

export const ExerciseSetRow = ({set, metric = ExerciseMetric.reps, index}: ExerciseSetRowProps) => {
    const {updateSet} = useExerciseStore()
    const [values, setValues] = useState({
        reps: set.reps?.toString() || "0",
        weight: set.weight?.toString() || "0",
        time: set.timeInS?.toString() || "0",
        distance: set.distanceInM?.toString() || "0"
    });

    const changeComplete = () => {
        updateSet(set.exerciseLogId, {...set, completed: !set.completed});
    };

    const onChangeInput = (name: string, value: string) => {
        setValues({...values, [name]: value});
        updateSet(set.exerciseLogId, {...set, [name]: value});
    };

    return (
        <SwipeableRow backgroundColor={index % 2 === 0 ? Colors.dark500 : Colors.dark900} actionTypes={["edit", "delete"]} onEdit={() => console.log("edited")} onDelete={() => console.log("deleted")}>
            <Animated.View>
                <View key={set.id}
                      style={[styles.row, {backgroundColor: index % 2 === 0 ? Colors.dark500 : Colors.dark900}]}>
                    <View style={{alignItems: "center", width: "8%"}}>
                        <TouchableOpacity onPress={changeComplete}>
                            {set.completed ? (
                                <Ionicons name={"checkmark-circle"} size={30}
                                          color={set.completed ? Colors.lime : Colors.dark300}/>
                            ) : (
                                <Text style={{color: 'white'}}>{set.order}</Text>
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
                                        color={index % 2 === 0 ? Colors.dark500 : Colors.dark900}
                                        keyboardType={"numeric"}
                                        value={values.reps}
                                        onChange={(text) => onChangeInput("reps", text)}
                                        placeholder={"reps"}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <InputField
                                        color={index % 2 === 0 ? Colors.dark500 : Colors.dark900}
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
                                        color={index % 2 === 0 ? Colors.dark500 : Colors.dark900}
                                        keyboardType={"numeric"}
                                        value={values.distance}
                                        onChange={(text) => onChangeInput("distanceInM", text)}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <InputField
                                        color={index % 2 === 0 ? Colors.dark500 : Colors.dark900}
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
                                    color={index % 2 === 0 ? Colors.dark500 : Colors.dark900}
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
    }
});
export default ExerciseSetRow;