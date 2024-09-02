import { useExerciseStore} from "@features/workout-logger/store";

import {useRoutineStore} from "@features/workout/store/routineStore";
import {ExerciseStoreState, RoutineStoreState, WorkoutState} from "@features/workout-logger/model";

export const useWorkout = (isRoutine?: boolean): (WorkoutState & ExerciseStoreState) | RoutineStoreState  => {
    if(isRoutine) {
        return useRoutineStore();
    }
    return {...useRoutineStore(),  ...useExerciseStore()};
}