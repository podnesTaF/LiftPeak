import React, {useState} from 'react';
import {StyleSheet} from "react-native";
import {Colors} from "@shared/styles";
import {MuscleFilter} from "@features/constructor";


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