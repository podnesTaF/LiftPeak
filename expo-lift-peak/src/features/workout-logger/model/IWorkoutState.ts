import {ActiveWorkout, IWorkout} from "@entities/workout";
import {ActiveWorkoutLog, IExerciseLog, ISet, IWorkoutLog} from "@entities/workout-log";

export interface WorkoutState {
    workout: IWorkout | null;
    workoutLog: IWorkoutLog | null;

    isLoading: boolean;
    error: string | null;

    setWorkout: (workout: Omit<IWorkout, "id">) => {id: string};
    setWorkoutLog: (workoutLog: Omit<IWorkoutLog, "id">) => void;
    clearWorkout: () => void;
}