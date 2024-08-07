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
            isLoading: false,
            error: null,
            setWorkout: (workout: Omit<IWorkout, "id">) => {
                    const generatedId = uuidv4();
                    set({workout: {...workout, id: generatedId}});
                    return {id: generatedId};
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