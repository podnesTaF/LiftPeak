import React from 'react';
import {Stack, useRouter} from "expo-router";
import Button from '@shared/components/Button';
import {Colors, defaultStyles} from "@shared/styles";
import {Alert, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {BlurView} from "expo-blur";
import {Ionicons} from "@expo/vector-icons";
import Constants from "expo-constants";
import {WorkoutProvider} from "@features/workout/store/workoutContext";
import {useRoutineStore} from "@features/workout/store/routineStore";
import {useMutation} from "@tanstack/react-query";
import {
    createWorkout,
    CreateWorkoutDto,
    CreateWorkoutDtoSchema,
    formatExercises,
    formatWorkoutData
} from "@features/workout";
import {CreateExerciseLogDto, CreateExerciseLogDtoArraySchema} from "@features/exercise-logger";
import {useToastStore} from "@shared/store";

const Layout = () => {
    const {
        clearExercises,
        clearWorkout,
        workout,
        workoutLog,
        exerciseLogs
    } = useRoutineStore();
    const router = useRouter();

    const {mutate} = useMutation({
        mutationFn: (
            data: {createWorkoutDto: CreateWorkoutDto, exercises: CreateExerciseLogDto}
        ) => createWorkout(data.createWorkoutDto, data.exercises),
        onError: (error) => {
            showToast(
                "Creation Error",
                error.message || "An error occurred while creating workout",
                "error",
                4000
            );
        },
        onSuccess: (data) => {
            showToast(
                "Workout Created",
                "Workout has been successfully created",
                "success",
                4000
            );
            clearWorkout();
            clearExercises();
            router.push({pathname: "/(authenticated)/(tabs)/start"});
        }
    })
    const { showToast } = useToastStore();

    const handleBackAction = () => {
        Alert.alert("Discard Changes?", "You have unsaved changes. Are you sure you want to discard them?", [
            {
                text: "Keep and Exit",
                style: "cancel",
                onPress: () => {
                    router.back();
                }
            },
            {
                text: "Discard",
                style: "destructive",
                onPress: () => {
                    clearExercises();
                    clearWorkout();
                    router.back();
                }
            }
        ]);
    }

    const confirmSave = () => {
        Alert.alert("Save Workout", "Are you sure you want to save this workout?", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Save",
                style: "default",
                onPress: saveRoutine
                }
        ])
    }

    const saveRoutine = () => {
        const exerciseData = formatExercises(exerciseLogs);

        const workoutData = formatWorkoutData({
            workout, workoutLog,
        })

        const exerciseLogsValidationResult = CreateExerciseLogDtoArraySchema.safeParse(exerciseData);

        if (!exerciseLogsValidationResult.success) {
            showToast(
                "Validation Error",
                exerciseLogsValidationResult.error.message,
                "error",
                10000
            );
            return;
        }

        const validationResult = CreateWorkoutDtoSchema.safeParse(workoutData);
        if (!validationResult.success) {
            showToast(
                "Validation Error",
                validationResult.error.message,
                "error",
                10000
            );
            return;
        }

        mutate({createWorkoutDto: validationResult.data, exercises: exerciseLogsValidationResult.data});
    }

    return (
        <WorkoutProvider mode={"routine"}>
            <View style={{flex: 1, backgroundColor: Colors.dark900}}>
            <Stack>
                <Stack.Screen
                    name={"index"}
                    options={{
                        headerTintColor: "white",
                        headerStyle: {
                            backgroundColor: Colors.dark700,
                        },
                        header: () => (
                            <BlurView intensity={50} tint={"dark"} style={{flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: "center", paddingTop: Constants.statusBarHeight}}>
                                <TouchableOpacity onPress={handleBackAction}>
                                    <Ionicons name={"chevron-back"} size={30} color={"white"} />
                                </TouchableOpacity>
                                <View style={{paddingVertical: 16}}>
                                    <Text style={defaultStyles.smallTitle}>
                                        Create Workout
                                    </Text>
                                </View>
                                <Button onPress={confirmSave} style={{paddingVertical: 8, paddingHorizontal: 12}} color={"success"} title={"Save"}/>
                            </BlurView>
                        )
                    }}
                />
            </Stack>
        </View>
        </WorkoutProvider>
    );
};

export default Layout;