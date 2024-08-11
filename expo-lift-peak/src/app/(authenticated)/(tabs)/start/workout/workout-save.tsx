import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import InputField from "@shared/components/form/InputField";
import {useDiscardWorkout, useExerciseStore, useWorkoutStore} from "@features/workout-logger";
import {useTimerStore} from "@features/timer";
import {createWorkout, CreateWorkoutDto, CreateWorkoutDtoSchema} from "@features/workout";
import {useToastStore} from "@shared/store";
import {Stack, useRouter} from "expo-router";
import {CreateExerciseLogDto, CreateExerciseLogDtoArraySchema} from "@features/exercise-logger";
import {useMutation} from "@tanstack/react-query";

const WorkoutSave = () => {
    const [title, setTitle] = useState("Active Workout");
    const [description, setDescription] = useState("");

    const {workout, workoutLog} = useWorkoutStore()
    const {exerciseLogs} = useExerciseStore()
    const {elapsedTime} = useTimerStore();
    const discardWorkout = useDiscardWorkout()

    const { showToast } = useToastStore();
    const router = useRouter();

    const {mutate} = useMutation({
        mutationFn: async (data: {createWorkoutDto: CreateWorkoutDto, exercises: CreateExerciseLogDto}) => createWorkout(data.createWorkoutDto, data.exercises),
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
                "Success",
                `You successfully created workout ${data.title}`,
                "success",
                2000
            );
            discardWorkout();
            router.replace('/(authenticated)/(tabs)/home');
        }
    })

    const handleSave = async () => {

        const exerciseLogsData = exerciseLogs.map(log => ({
            workoutLogId: null,
            exerciseId: log.exerciseId,
            order: log.order || null,
            sets: log.sets?.map(set => ({
                order: set.order || null,
                type: set.type,
                distanceInM: set.distanceInM ? +set.distanceInM : null,
                weight: set.weight ? +set.weight : null,
                timeInS: set.timeInS ?  +set.timeInS : null,
                reps: set.reps ? +set.reps : null,
                previousSetId: set.previousSetId || null,
                restInS: set.restInS || null,
            })) || [],
        }));

        const data = {
            title,
            description,
            isRoutine: workout?.isRoutine || false,
            routineId: null,
            createLogDto: {
                durationInS: elapsedTime,
                startTime: workoutLog?.startTime || new Date(Date.now() - elapsedTime),
                totalVolume: exerciseLogs?.reduce((total, log) => total + (log.sets?.reduce((t, s) => t + (s.weight ? +s.weight : 0),0) || 0), 0) || 0,
                totalDistanceInM: 0,
            },
        };

        const exerciseLogsValidationResult = CreateExerciseLogDtoArraySchema.safeParse(exerciseLogsData);
        if (!exerciseLogsValidationResult.success) {
            showToast(
                "Validation Error",
                exerciseLogsValidationResult.error.message,
                "error",
                10000
            );
            return;
        }

        const validationResult = CreateWorkoutDtoSchema.safeParse(data);
        if (!validationResult.success) {
            showToast(
                "Validation Error",
                validationResult.error.message,
                "error",
                10000
            );
            return;
        }

        mutate({createWorkoutDto: validationResult.data,exercises: exerciseLogsValidationResult.data});
    };


    return (
        <>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <TouchableOpacity onPress={handleSave}>
                            <Text>
                                Save
                            </Text>
                        </TouchableOpacity>
                    )
                }}
            />
            <View style={[{gap:10, marginTop: 70, paddingVertical: 10}]}>
                <View>
                    <InputField placeholder={"Title"} value={title} onChange={(v) => setTitle(v)} />
                </View>
                <InputField placeholder={"Description"} value={description} onChange={(v) => setDescription(v)} />
            </View>
        </>
    );
};

export default WorkoutSave;