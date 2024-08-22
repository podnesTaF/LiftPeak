import React, {useState} from 'react';
import {View, StyleSheet, Text, ScrollView, TouchableOpacity} from "react-native";

import {Body} from "@features/muscles";
import {Colors, defaultStyles} from "@shared/styles";
import {camelCaseToWords} from "@shared/utils";
import {Ionicons} from "@expo/vector-icons";
import {MuscleFilter} from "@features/constructor";

const views = [
    "front",
    "back"
] as const;

const Muscles = () => {
    const [selectedMuscles, setSelectedMuscles] = useState<{id: number, name: string}[]>([]);


    return (
        <MuscleFilter selectedMuscles={selectedMuscles} setSelectedMuscles={setSelectedMuscles} />
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14
    },
    selectionContainer: {
        backgroundColor: Colors.dark700,
        borderRadius: 6,
        padding: 12,
        marginRight: 12
    }
})

export default Muscles;