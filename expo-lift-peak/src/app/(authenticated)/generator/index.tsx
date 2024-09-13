import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import BottomSheetSelect from "@shared/components/BottomSheetSelect";
import {getEquipmentOptions, levelOptions, MuscleFilter} from "@features/constructor";
import {Stack, useRouter} from "expo-router";
import Button from "@shared/components/Button";
import {Ionicons} from "@expo/vector-icons";
import {useMutation, useQuery} from "@tanstack/react-query";
import {ExerciseLevel, ExerciseType, getEquipment, IEquipment} from "@entities/exercise";
import RestPicker from "@features/timer/ui/RestPicker";
import {TimePickerItem} from "@shared/TimePicker";
import {formatTime, getSecondsFromTimeObj, getTimeObjFromSeconds} from "@shared/utils";
import {GenerateDto} from "@features/constructor/model/GenerateDto";
import {generateWorkout} from "@features/constructor/api/constructorApi";
import {useGeneratedStore} from "@features/constructor/store/generatedStore";

const WorkoutConstructorPage = () => {
    const router = useRouter();
    const {addSettings, finishGenerateWorkout, settings} = useGeneratedStore()
    const [equipments, setEquipments] = React.useState<(string | number)[]>(settings.equipmentIds || []);
    const [level, setLevel] = React.useState<(string | number)[]>([settings.level]);
    const [selectedMuscles, setSelectedMuscles] = React.useState<{ id: number, name: string }[]>(settings.targetIds?.map(id => ({id, name: ""})) || []);
    const [time, setTime] = React.useState<number>(settings.workoutTimeInSec || 0);
    const [avgRestTime, setAvgRestTime] = React.useState<number>(settings.restBetweenSetsInSec || 0);
    
    const {data} = useQuery({
        queryKey: ['equipment'],
        queryFn: getEquipment,
    })

    const {mutate} = useMutation({
        mutationKey: ['generateWorkout'],
        mutationFn: (data: GenerateDto) => generateWorkout(data),
        onSuccess: (data) => {
            finishGenerateWorkout(data.workoutPlan, data.targetStats)
            router.push("/(authenticated)/generator/generated")
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const onChangeEquipment = (newValues: (string | number)[]) => {
        setEquipments(newValues.map(v => data?.find(e => e.id === +v)?.name || v))
    }

    const onChangeLevel = (newValue: (string | number)[]) => {
        setLevel(newValue)
    }

    const onSubmitSelection = () => {
        const settings: GenerateDto = {
            type: ExerciseType.STRENGTH,
            level: level[0] as string as ExerciseLevel,
            targetIds: selectedMuscles.map(m => m.id),
            equipmentIds: equipments.map(e => data?.find((d: IEquipment) => d.name === e)?.id || e) as number[],
            workoutTimeInSec: +time || 0,
            restBetweenSetsInSec: +avgRestTime || 0
        }

        console.log(settings)

        addSettings(settings)
        mutate(settings)
    }


    return (
        <>
            <Stack.Screen options={{
                headerTitle: "Generate Workout",
                headerTintColor: Colors.white,
                headerLeft: ({tintColor}) => (
                    <TouchableOpacity onPress={router.back}>
                        <Ionicons name={"chevron-back"} color={tintColor} size={30}/>
                    </TouchableOpacity>
                ),
                headerStyle: {
                    backgroundColor: Colors.dark700
                },
            }}/>
            <View style={[defaultStyles.container, {paddingTop: 12}]}>
                <View style={styles.container}>
                    <BottomSheetSelect value={selectedMuscles.map(m => m.name)} multiple label={"Target Muscles"}
                                       placeholder={"Select Muscles"} snapPoints={["50%", "90%"]}>
                        <MuscleFilter selectedMuscles={selectedMuscles} setSelectedMuscles={setSelectedMuscles}/>
                    </BottomSheetSelect>
                    <BottomSheetSelect allAvailable multiple label={"Equipment"} placeholder={"Select Equipment"} value={equipments}
                                       onChange={onChangeEquipment} options={
                        getEquipmentOptions(data)
                    }/>
                    <BottomSheetSelect label={"Difficulty"} placeholder={"Select Difficulty"} value={level}
                                       onChange={onChangeLevel} options={levelOptions} last={true}/>
                    <BottomSheetSelect value={time ? [formatTime(time)] : []} label={"Time to Workout"} placeholder={"Pick Time"}
                                       snapPoints={["50%", "50%"]}>
                        <TimePickerItem selectedTime={getTimeObjFromSeconds(time || 0)}
                                        onChange={(value) => {
                                            setTime(getSecondsFromTimeObj(value))
                                        }}/>
                    </BottomSheetSelect>
                    <BottomSheetSelect value={avgRestTime ? [formatTime(avgRestTime)] : []} label={"Average Rest Time"} placeholder={"Pick Time"}
                                       snapPoints={["50%", "50%"]}>
                        <RestPicker selectedTime={avgRestTime || 0} setSelectedTime={setAvgRestTime}/>
                    </BottomSheetSelect>
                </View>
                <View style={{margin: 12}}>
                    <Button  color={"success"} title={"Generate Workout"} onPress={onSubmitSelection}/>
                </View>
            </View>
        </>
    );
};

export default WorkoutConstructorPage;


export const styles = StyleSheet.create({
    container: {
        marginHorizontal: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: Colors.dark700,
        marginVertical: 20
    }
})