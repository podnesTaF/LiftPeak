import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import InputField from "@shared/components/form/InputField";
import {ISet} from "@entities/workout-log";
import {useExerciseStore} from "@features/workout-logger";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@shared/styles";
import {ExerciseMetric} from "@entities/exercise";

interface ExerciseSetRowProps {
    set: ISet;
    metric?: ExerciseMetric;
}

const ExerciseSetRow = ({set, metric = ExerciseMetric.reps}: ExerciseSetRowProps) => {
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
        <View key={set.id} style={styles.row}>
            <Text style={styles.text}>{set.order}</Text>
            <View style={styles.metricContainer}>
                {metric === 'reps' && (
                    <>
                        <View style={styles.inputContainer}>
                            <InputField
                                keyboardType={"numeric"}
                                value={values.reps}
                                onChange={(text) => onChangeInput("reps", text)}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <InputField
                                keyboardType={"numeric"}
                                value={values.weight}
                                onChange={(text) => onChangeInput("weight", text)}
                            />
                        </View>
                    </>
                )}
                {metric === "distance" && (
                    <>
                        <View style={styles.inputContainer}>
                            <InputField
                                keyboardType={"numeric"}
                                value={values.distance}
                                onChange={(text) => onChangeInput("distanceInM", text)}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <InputField
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
                            keyboardType={"numeric"}
                            value={values.time}
                            onChange={(text) => onChangeInput("timeInS", text)}
                        />
                    </View>
                )}
            </View>
            <TouchableOpacity onPress={changeComplete}>
                <Ionicons name={"checkmark"} size={24} color={set.completed ? Colors.lime : Colors.dark300} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        gap: 16,
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8
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
        width: "80%"
    },
    inputContainer: {
        width: "20%"
    }
});
export default ExerciseSetRow;