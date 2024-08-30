import React, {useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import InputField from "@shared/components/form/InputField";
import {useDiscardWorkout, useExerciseStore, useWorkoutStore} from "@features/workout-logger";
import {useTimerStore} from "@features/timer";
import {createWorkout, CreateWorkoutDto, CreateWorkoutDtoSchema} from "@features/workout";
import {useToastStore} from "@shared/store";
import {Stack, useRouter} from "expo-router";
import {CreateExerciseLogDto, CreateExerciseLogDtoArraySchema} from "@features/exercise-logger";
import {useMutation} from "@tanstack/react-query";
import {MediaPicker} from "@features/media-upload";
import {defaultStyles} from "@shared/styles";


const WorkoutSave = () => {
    const {workout, updateWorkoutField, workoutLog, clearWorkout, addMedia, workoutMedia, removeMedia} = useWorkoutStore()
    const {exerciseLogs, clearExercises} = useExerciseStore()
    const {elapsedTime} = useTimerStore()
    const {discardWorkout} = useDiscardWorkout();

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
                "Workout Created",
                "Workout has been successfully created",
                "success",
                4000
            );
            discardWorkout();
            router.push({pathname: "/(authenticated)/(tabs)/start"});
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
            title: workout?.title,
            description: workout?.description,
            isRoutine: workout?.isRoutine || false,
            routineId: null,
            mediaUrls: workoutMedia.map(media => media.actualUrl),
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
            <ScrollView contentContainerStyle={{gap: 16}} style={defaultStyles.container}>
                <View style={{gap: 12, padding: 16}}>
                    <InputField placeholder={"Title"} value={workout?.title || ""} onChange={(v) => updateWorkoutField({title: v})} />
                    <InputField placeholder={"Description"} value={workout?.description || ''} onChange={(v) => updateWorkoutField({description: v})} />
                </View>
                <MediaPicker uploadedFiles={workoutMedia} removeMedia={removeMedia} addMedia={addMedia} />
            </ScrollView>
        </>
    );
};

export default WorkoutSave;