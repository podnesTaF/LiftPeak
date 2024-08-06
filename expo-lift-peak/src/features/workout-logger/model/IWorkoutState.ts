import {ActiveWorkout, IWorkout} from "@entities/workout";
import {ActiveWorkoutLog, IExerciseLog, ISet, IWorkoutLog} from "@entities/workout-log";

export interface WorkoutState {
    workout: ActiveWorkout | null;
    workoutLog: ActiveWorkoutLog | null;

    isLoading: boolean;
    error: string | null;

    setWorkout: (workout: IWorkout) => void;
    setWorkoutLog: (workoutLog: IWorkoutLog) => void;
    clearWorkout: () => void;
}