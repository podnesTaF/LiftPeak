import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import BottomSheetSelect from "@shared/components/BottomSheetSelect";
import {equipmentOptions, levelOptions, MuscleFilter} from "@features/constructor";
import {Stack, useRouter} from "expo-router";
import Button from "@shared/components/Button";
import {Ionicons} from "@expo/vector-icons";

const WorkoutConstructorPage = () => {
    const router = useRouter();
    const [equipments, setEquipments] = React.useState<(string | number)[]>([]);
    const [level, setLevel] = React.useState<(string | number)[]>([]);
    const [selectedMuscles, setSelectedMuscles] = React.useState<{id: number, name: string}[]>([]);

    const onChangeEquipment = (newValues: (string | number)[]) => {
        setEquipments(newValues)
    }

    const onChangeLevel = (newValue: (string | number)[]) => {
        setLevel(newValue)
    }

    const onSubmitSelection = () => {
        console.log("available equipments", equipments);
        console.log("level", level)
        console.log("muscles", selectedMuscles);
    }



    return (
        <>
            <Stack.Screen options={{
                headerTitle: "Exercises",
                headerTintColor: Colors.white,
                headerLeft: ({tintColor}) => (
                    <TouchableOpacity onPress={router.back}>
                        <Ionicons name={"chevron-back"} color={tintColor} size={30} />
                    </TouchableOpacity>
                ),
                headerStyle: {
                    backgroundColor: Colors.dark700
                },
                headerRight: () => (
                        <Button onPress={onSubmitSelection} color={"transparent"} title={"Save"} />
                )
            }}/>
            <View style={[defaultStyles.container, {padding: 16}]}>
                <Text style={defaultStyles.smallTitle}>
                    Fill in Workout Specifics
                </Text>
                <View style={{gap: 12, marginVertical: 20}}>
                    <BottomSheetSelect value={selectedMuscles.map(m => m.name)} multiple label={"Target Muscles"} placeholder={"Select Muscles"} snapPoints={["50%", "90%"]}>
                        <MuscleFilter selectedMuscles={selectedMuscles} setSelectedMuscles={setSelectedMuscles} />
                    </BottomSheetSelect>
                    <BottomSheetSelect multiple label={"Available Equipment"} placeholder={"Select Equipment"} value={equipments} onChange={onChangeEquipment} options={equipmentOptions} />
                    <BottomSheetSelect label={"Difficulty Level"} placeholder={"Select Difficulty"} value={level} onChange={onChangeLevel} options={levelOptions} />
                </View>
            </View>
        </>
    );
};

export default WorkoutConstructorPage;