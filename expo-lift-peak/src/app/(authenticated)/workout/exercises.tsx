import React, {useState} from 'react';
import {FlatList, ScrollView, TouchableOpacity, View} from "react-native";
import {useQuery} from "@tanstack/react-query";
import {ExerciseCard, findExerciseList} from "@entities/exercise";
import {Colors, defaultStyles} from "@shared/styles";
import {useExerciseStore} from "@features/workout-logger";
import {Stack, useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

const Exercises = () => {
    const [value, setValue] = React.useState("");
    const router = useRouter()

    const {addExerciseLog, getOrder} = useExerciseStore()

    const {data} = useQuery({
        queryKey: ['exerciseList'],
        queryFn: async () => findExerciseList({search: value}),
    })

    const [exercises, setExercises] = useState<typeof data>([])

    const isSelected = (exerciseId: number | string) => !!exercises?.find(e => e?.id === exerciseId);

    const manageExercise = (exerciseId: number | string) => {
       if(isSelected(exerciseId)) {
           setExercises((prev) => prev?.filter(ex => ex?.id !== exerciseId))
       } else {
           const selectedExercise = data?.find(e => e.id === exerciseId);
           if(selectedExercise) {
                setExercises((prev) => [...prev!, selectedExercise])
           }
       }
    }

    const confirmExercises = async () => {
        exercises?.forEach(exercise => {
            addExerciseLog({
                exercise: exercise,
                exerciseId: exercise.id,
                sets: [],
                order: getOrder(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        })
        router.back()
    }

    return (
        <>
        <Stack.Screen options={{
            headerRight: () => (
                <TouchableOpacity onPress={confirmExercises}>
                    <Ionicons name={"checkmark"} size={32} color={Colors.dark500} />
                </TouchableOpacity>
            )
        }} />
            <View style={defaultStyles.container}>
                <FlatList data={data}
                          renderItem={({item}) =>
                              <ExerciseCard onPress={(exerciseId) => manageExercise(exerciseId)} exercise={item} selected={isSelected(item.id)}/>
                          }
                          ItemSeparatorComponent={() => <View style={{height: 2, backgroundColor: Colors.dark300}}/>}
                          keyExtractor={(item) => item.id.toString()}
                />
            </View>
        </>
    );
};

export default Exercises;