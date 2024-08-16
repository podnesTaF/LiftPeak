import React from 'react';
import {Text, View} from "react-native";
import {defaultStyles} from "@shared/styles";
import BottomSheetSelect from "@shared/components/BottomSheetSelect";
import {equipmentOptions, levelOptions, MuscleFilter} from "@features/constructor";

const WorkoutConstructorPage = () => {

    const [equipments, setEquipments] = React.useState<(string | number)[]>([]);
    const [level, setLevel] = React.useState<(string | number)[]>([]);
    const [selectedMuscles, setSelectedMuscles] = React.useState<any[]>([]);

    const onChangeEquipment = (newValues: (string | number)[]) => {
        setEquipments(newValues)
    }

    const onChangeLevel = (newValue: (string | number)[]) => {
        setLevel(newValue)
    }

    return (
        <View style={[defaultStyles.container, {padding: 16}]}>
           <Text style={defaultStyles.smallTitle}>
               Fill in Workout Specifics
           </Text>
            <View style={{gap: 12, marginVertical: 20}}>
                <BottomSheetSelect value={selectedMuscles} onChange={(values) => setSelectedMuscles(values)} multiple label={"Target Muscles"} placeholder={"Select Muscles"} snapPoints={["50%", "90%"]}>
                    <MuscleFilter selectedMuscles={selectedMuscles} setSelectedMuscles={setSelectedMuscles} />
                </BottomSheetSelect>
                <BottomSheetSelect multiple label={"Available Equipment"} placeholder={"Select Equipment"} value={equipments} onChange={onChangeEquipment} options={equipmentOptions} />
                <BottomSheetSelect label={"Difficulty Level"} placeholder={"Select Difficulty"} value={level} onChange={onChangeLevel} options={levelOptions} />
            </View>
        </View>
    );
};

export default WorkoutConstructorPage;