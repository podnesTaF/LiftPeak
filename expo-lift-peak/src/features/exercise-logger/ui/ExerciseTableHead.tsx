import React from 'react';
import {Image, StyleSheet, Text, View} from "react-native";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {Colors} from "@shared/styles";
import {ExerciseEquipment, ExerciseMetric} from "@entities/exercise";

interface TableHeadProps {
    metric?: ExerciseMetric;
    equipment?: ExerciseEquipment;
}

export const TableHead = ({metric = ExerciseMetric.reps, equipment}: TableHeadProps) => {
    return (
        <View style={styles.row}>
            <View style={{width: "6%"}}>
                <Ionicons name={"checkmark-done"} color={Colors.lime} size={24} />
            </View>
            <View style={styles.metricContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Previous</Text>
                </View>
                {metric === 'reps' && (
                    <>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>Reps</Text>
                        </View>
                        {equipment !== ExerciseEquipment.BODYWEIGHT && (
                            <>
                                <View style={styles.textContainer}>
                                    <Image source={require("@assets/images/icons/ic-tonnage-lifted.png")} style={{width: 24, height: 24}} />
                                    <Text style={styles.text}>
                                        kg
                                    </Text>
                                </View>
                            </>
                        )}
                    </>
                )}
                {metric === 'distance' && (
                    <>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>Time (s)</Text>
                        </View>
                        <View style={styles.textContainer}>
                        <Text style={styles.text}>Distance (m)</Text>
                        </View>
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
                           <Image source={require("@assets/images/icons/ic-tonnage-lifted.png")} style={{width: 24, height: 24}} />
                            <Text style={styles.text}>
                                kg
                            </Text>
                        </View>
                    </>
                )}
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
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    text: {
        color: Colors.lime,
        fontSize: 12,
        fontWeight: "600",
    },
    metricContainer: {
        flexDirection: "row",
        gap: 12,
        width: "94%"
    },
    textContainer: {
        width: "29%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap:6,
    }
});

export default TableHead;