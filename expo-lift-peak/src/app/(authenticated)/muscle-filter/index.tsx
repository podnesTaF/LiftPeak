import React, {useState} from 'react';
import {View, StyleSheet, Text, ScrollView, TouchableOpacity} from "react-native";

import {Body} from "@features/muscles";
import {Colors, defaultStyles} from "@shared/styles";
import {camelCaseToWords} from "@shared/utils";
import {Ionicons} from "@expo/vector-icons";

const views = [
    "front",
    "back"
] as const;

const Muscles = () => {
    const [view, setView] = useState<"front" | "back">("front")
    const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);

    const clearSelection = () => {
        setSelectedMuscles([])
    }

    return (
        <View style={{flex: 1}}>
            <View style={{gap:12,backgroundColor: Colors.dark700, paddingHorizontal: 16, paddingBottom: 16}}>
                <Text style={[defaultStyles.header, {fontSize: 24}]}>
                    Choose Target Muscles
                </Text>
                <Text style={defaultStyles.secondaryText}>
                    Select muscles that you want to be targeted by your workout
                </Text>
            </View>
            <View style={[defaultStyles.container, {padding: 16, gap: 20, paddingBottom: 0}]}>
                <View style={styles.row}>
                    <Text style={{color: "white", fontWeight: "500", fontSize: 16, paddingVertical: 12}}>
                        View
                    </Text>
                    <ScrollView
                        horizontal
                        snapToInterval={50}
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                    >
                        {views.map((v, i) => (
                            <TouchableOpacity key={i} onPress={() => setView(v)} style={[styles.selectionContainer, {backgroundColor: view === v ? Colors.success : Colors.dark700}]}>
                                <Text style={{color: "white", fontWeight: "500", fontSize: 16, textTransform: "capitalize"}}>
                                    {v}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.row}>
                    <Text style={{color: "white", fontWeight: "500", fontSize: 16,paddingVertical: 12}}>
                            Selected:
                    </Text>
                    <ScrollView
                        pagingEnabled={true}
                        decelerationRate="fast"
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={50}
                        contentContainerStyle={{paddingRight: 24}}
                    >
                        {selectedMuscles.map((muscle, index) => (
                            <TouchableOpacity key={muscle + index} style={styles.selectionContainer}>
                                <Text style={{color: "white", fontWeight: "500", fontSize: 16, textTransform: "capitalize"}}>
                                    {camelCaseToWords(muscle)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    {selectedMuscles.length ? <TouchableOpacity onPress={clearSelection}
                                       style={{position: "absolute", right: 0, top: 5, opacity: 0.7}}>
                        <Ionicons name={"close-circle"} size={32} color={Colors.dark100}/>
                    </TouchableOpacity> : null}
                </View>
                <Body look={view} selectedMuscles={selectedMuscles} setSelectedMuscles={setSelectedMuscles} />
            </View>
        </View>
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