import {IWorkout} from "@entities/workout";
import {IExerciseLog, ISet, IWorkoutLog} from "@entities/workout-log";
import {create} from "zustand";
import {WorkoutState} from "@features/workout-logger";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';


export const useWorkoutStore = create<WorkoutState>()(
    persist(
        (set, get) => ({
            workout: null,
            workoutLog: null,
            exerciseLogs: [],
            sets: [],
            timer: {
                isRunning: false,
                elapsedTime: 0
            },
            isLoading: false,
            error: null,
            initializeWorkout: ({userId}:{userId: number}) => {
                const workoutId = uuidv4();
                const workoutLogId = uuidv4();
                set({
                    workout: {
                        id: workoutId,
                        title: "Test Index",
                        description: "This is a test workout",
                        userId: userId,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    workoutLog: {
                        id: workoutLogId,
                        baseWorkoutId: workoutLogId,
                        startTime: new Date().toISOString(),
                        totalVolume: 0,
                        totalDistanceInM: 0,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                });
            },
            setWorkout: (workout: Omit<IWorkout, "id">) => {
                    const generatedId = uuidv4();
                    set({workout: {...workout, id: generatedId}});
            },
            setWorkoutLog: (workoutLog: Omit<IWorkoutLog, "id">) => set({workoutLog: {...workoutLog, id: uuidv4()}}),
            clearWorkout: () => set({workout: null, workoutLog: null}),
        }),
        {
                name: "workout-storage",
                storage: createJSONStorage(() => AsyncStorage)
        }
    ),
)