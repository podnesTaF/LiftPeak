import {IExerciseLog, ISet} from "@entities/workout-log";
import {create} from "zustand";
import {ExerciseStoreState} from "@features/workout-logger/model";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';


export const useExerciseStore = create<ExerciseStoreState>()(
    persist(
        (set, get) => ({
            exerciseLogs: [],
            isLoading: false,
            error: null,
            setExerciseLogs: (exerciseLogs: IExerciseLog[]) => set({exerciseLogs}),
            addExerciseLog: (exerciseLog: Omit<IExerciseLog, "id">) => set({exerciseLogs: [...get().exerciseLogs, {...exerciseLog, id: uuidv4()}]}),
            updateExerciseLog: (exerciseLog: IExerciseLog) => set({exerciseLogs: get().exerciseLogs.map(log => log.id === exerciseLog.id ? exerciseLog : log)}),
            removeExerciseLog: (exerciseLogId: number | string) => set({exerciseLogs: get().exerciseLogs.filter(log => log.id !== exerciseLogId)}),
            addSet: (exerciseId: number | string, workoutSet: Omit<ISet, "id">) => set({
                exerciseLogs: get().exerciseLogs.map(log => log.id === exerciseId ? {...log, sets: [...log!.sets as any, {...workoutSet, id: uuidv4()}]} : log)
            }),
            updateSet: (exerciseId: number | string, workoutSet: ISet) => set({
                exerciseLogs: get().exerciseLogs.map(log => log.id === exerciseId ? {
                    ...log,
                    sets: log.sets?.map(set => set.id === workoutSet.id ? workoutSet : set)
                } : log)
            }),
            removeSet: (exerciseLogId: number | string, setId: number) => set({
                exerciseLogs: get().exerciseLogs.map(log => log.id === exerciseLogId ? {
                    ...log,
                    sets: log.sets?.filter(set => set.id !== setId).map(
                        (set, index) => ({...set, order: index + 1})
                    )
                } : log)
            }),
            clearExercises: () => set({exerciseLogs: []}),
            getExerciseSetsStats: (exerciseLogId) => {
                const exerciseLog = get().exerciseLogs.find(log => log.id === exerciseLogId);
                return {
                    totalSets: exerciseLog?.sets?.length || 0,
                    setsDone: exerciseLog?.sets?.filter(set => set.completed).length || 0
                };
            },
            getExerciseById: exerciseId => get().exerciseLogs.find(log => log.id === exerciseId),
            getOrder: () => get().exerciseLogs.length,
            reorder: (from, to) => {
                set((state) => {
                    const updatedLogs = [...state.exerciseLogs];

                    const [movedItem] = updatedLogs.splice(from, 1);

                    updatedLogs.splice(to, 0, movedItem);

                    const reorderedLogs = updatedLogs.map((log, index) => ({
                        ...log,
                        order: index + 1,
                    }));

                    return { exerciseLogs: reorderedLogs };
                });
            },
            addRest: (exerciseId, duration) => {
                set({
                    exerciseLogs: get().exerciseLogs.map(log => log.id === exerciseId ? {
                        ...log,
                        sets: log.sets?.map(set => ({...set, restInS: duration}))
                    } : log)
                });
            },
            updateSetRest: (exerciseId, setId, duration) => {
                set({
                    exerciseLogs: get().exerciseLogs.map(log => log.id === exerciseId ? {
                        ...log,
                        sets: log.sets?.map(set => set.id === setId ? {...set, restInS: duration} : set)
                    } : log)
                });
            },
            getCurrentExercise: () => {
                const exerciseLogs = get().exerciseLogs;

                const currentExercise = exerciseLogs.find(log => {
                    const totalSets = log.sets?.length || 0;
                    const completedSets = log.sets?.filter(set => set.completed).length || 0;
                    return completedSets < totalSets;
                });

                return currentExercise;
            }
        }),
        {
            name: "exercise-storage",
            storage:  createJSONStorage(() => AsyncStorage),
        }
    )
)