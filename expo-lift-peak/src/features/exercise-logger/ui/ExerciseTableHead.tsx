import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@shared/styles";
import {ExerciseEquipment, ExerciseMetric} from "@entities/exercise";

interface TableHeadProps {
    metric?: ExerciseMetric;
    equipment?: ExerciseEquipment;
}

const TableHead = ({metric = ExerciseMetric.reps, equipment}: TableHeadProps) => {
    return (
        <View style={styles.row}>
            <View style={{width: "10%"}}>
                <Ionicons name={"checkmark-done"} color={Colors.lime} size={24} />
            </View>
            <View style={styles.metricContainer}>
                {metric === 'reps' && (
                    <>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>Reps</Text>
                        </View>
                        {equipment !== ExerciseEquipment.BODYWEIGHT && (
                            <>
                                <View style={styles.textContainer}>
                                    <Text style={styles.text}>Weight</Text>
                                </View>
                            </>
                        )}
                    </>
                )}
                {metric === 'distance' && (
                    <>
                        <Text style={styles.text}>Time (s)</Text>
                        <Text style={styles.text}>Distance (m)</Text>
                    </>
                )}
                {metric === 'time' && (
                    <>
                        {equipment !== ExerciseEquipment.BODYWEIGHT && (
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>Weight</Text>
                            </View>
                        )}
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>Reps</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>Time (s)</Text>
                        </View>
                    </>
                )}
            </View>
            <View style={{width: "10%"}}>
                <Ionicons name={"checkmark"} size={24} color={Colors.white}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        gap: 16,
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark300,
        paddingBottom: 8
    },
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    metricContainer: {
        flexDirection: "row",
        gap: 12,
        width: "80%"
    },
    textContainer: {
        width: "20%"
    }
});

export default TableHead;
