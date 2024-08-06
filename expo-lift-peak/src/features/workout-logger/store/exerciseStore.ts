import {, IExerciseLog, ISet} from "@entities/workout-log";
import {create} from "zustand";
import {ExerciseStoreState} from "@features/workout-logger";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useExerciseStore = create<ExerciseStoreState>()(
    persist(
        (set, get) => ({
            exerciseLogs: [],
            isLoading: false,
            error: null,
            addExerciseLog: (exerciseLog: IExerciseLog) => set({exerciseLogs: [...get().exerciseLogs, exerciseLog]}),
            updateExerciseLog: (exerciseLog: IExerciseLog) => set({exerciseLogs: get().exerciseLogs.map(log => log.id === exerciseLog.id ? exerciseLog : log)}),
            removeExerciseLog: (exerciseLogId: number) => set({exerciseLogs: get().exerciseLogs.filter(log => log.id !== exerciseLogId)}),
            addSet: (exerciseId: number, workoutSet: ISet) => set({
                exerciseLogs: get().exerciseLogs.map(log => log.id === exerciseId ? {...log, sets: [...log.sets, workoutSet]} : log)
            }),
            updateSet: (exerciseId: number, workoutSet: ISet) => set({
                exerciseLogs: get().exerciseLogs.map(log => log.id === exerciseId ? {
                    ...log,
                    sets: log.sets.map(set => set.id === workoutSet.id ? workoutSet : set)
                } : log)
            }),
            removeSet: (exerciseId: number, setId: number) => set({
                exerciseLogs: get().exerciseLogs.map(log => log.id === exerciseId ? {
                    ...log,
                    sets: log.sets.filter(set => set.id !== setId)
                } : log)
            }),
            clearExercises: () => set({exerciseLogs: []}),
        }),
        {
            name: "exercise-storage",
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
)