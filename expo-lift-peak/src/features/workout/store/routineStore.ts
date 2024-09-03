import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from 'uuid';
import {RoutineStoreState, WorkoutState} from "@features/workout-logger";
import {IExerciseLog, ISet, IWorkoutLog} from "@entities/workout-log";
import {IWorkout} from "@entities/workout";

export const useRoutineStore = create<RoutineStoreState>()(
    persist(
        (set, get) => ({
            workout: null,
            workoutLog: null,
            sets: [],
            exerciseLogs: [],
            timer: {
                isRunning: false,
                elapsedTime: 0
            },
            isLoading: false,
            error: null,
            setExerciseLogs: (exerciseLogs: IExerciseLog[]) => set({exerciseLogs}),
            initializeWorkout: ({ userId }: { userId: number }) => {
                const routineId = uuidv4();
                const routineLogId = uuidv4();
                set({
                    workout: {
                        id: routineId,
                        title: "",
                        description: "",
                        isRoutine: true,
                        userId: userId,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    workoutLog: {
                        id: routineLogId,
                        baseWorkoutId: routineLogId,
                        startTime: new Date().toISOString(),
                        totalVolume: 0,
                        totalDistanceInM: 0,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                });
            },
            setWorkout: (routine: Omit<IWorkout, "id">) => {
                const generatedId = uuidv4();
                set({ workout: { ...routine, id: generatedId } });
            },
            updateWorkoutField: (updatedField) => {
                set({ workout: { ...get().workout as any, ...updatedField } });
            },
            setWorkoutLog: (routineLog: Omit<IWorkoutLog, "id">) => set({ workoutLog: { ...routineLog, id: uuidv4() } }),
            clearWorkout: () => set({ workout: null, workoutLog: null }),
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
            }
        }),
        {
            name: "routine-storage",
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
);