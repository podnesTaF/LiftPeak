import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import InputField from "@shared/components/form/InputField";
import {ISet} from "@entities/workout-log";
import {useExerciseStore} from "@features/workout-logger";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@shared/styles";

interface ExerciseSetRowProps {
    set: ISet;
}

const ExerciseSetRow = ({set}: ExerciseSetRowProps) => {
    const {updateSet} = useExerciseStore()
    const [values, setValues] = useState({
        reps: set.reps?.toString() || "0",
        weight: set.weight?.toString() || "0"
    })

    const changeComplete = () => {
        updateSet(set.exerciseLogId, {...set, completed: !set.completed});
    }

    const onChangeInput = (name: string, value: string) => {
        setValues({...values, [name]: value});
        updateSet(set.exerciseLogId, {...set, [name]: value});
    }

    return (
        <View key={set.id} style={{flexDirection: "row", gap: 16, alignItems: "center", justifyContent: "space-between"}}>
            <Text style={styles.text}>{set.order}</Text>
            <View style={{flexDirection: "row", alignItems: "center", gap:12}}>
                <InputField
                    keyboardType={"numeric"}
                    value={values.reps}
                    onChange={(text) => onChangeInput("reps", text)}
                />
                <Text style={styles.text}>x</Text>
                <InputField
                    keyboardType={"numeric"}
                    value={values.weight}
                    onChange={(text) => onChangeInput("weight", text)}
                />
            </View>
            <TouchableOpacity onPress={changeComplete}>
                <Ionicons name={"checkmark"} size={24} color={set.completed ? Colors.lime : Colors.dark300} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: "600"
    }
})

export default ExerciseSetRow;