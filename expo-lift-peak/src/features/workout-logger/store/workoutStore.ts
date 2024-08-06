import {IWorkout} from "@entities/workout";
import {IExerciseLog, ISet, IWorkoutLog} from "@entities/workout-log";
import {create} from "zustand";
import {WorkoutState} from "@features/workout-logger";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useWorkoutStore = create<WorkoutState>()(
    persist(
        (set, get) => ({
            workout: null,
            workoutLog: null,
            exerciseLogs: [],
            sets: [],
            isLoading: false,
            error: null,
            setWorkout: (workout: IWorkout) => set({workout}),
            setWorkoutLog: (workoutLog: IWorkoutLog) => set({workoutLog}),
            clearWorkout: () => set({workout: null, workoutLog: null}),
        }),
        {
                name: "workout-storage",
                storage: createJSONStorage(() => AsyncStorage)
        }
    ),
)