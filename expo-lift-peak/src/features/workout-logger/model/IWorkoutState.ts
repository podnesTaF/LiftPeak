import {ActiveWorkout, IWorkout} from "@entities/workout";
import {ActiveWorkoutLog, IExerciseLog, ISet, IWorkoutLog} from "@entities/workout-log";

export interface WorkoutState {
    workout: IWorkout | null;
    workoutLog: IWorkoutLog | null;
    workoutMedia: {actualUrl: string, thumbnailUrl: string}[];

    timer: {
        isRunning: boolean;
        elapsedTime: number;
    }

    isLoading: boolean;
    error: string | null;

    initializeWorkout: (props: {userId: number}) => void;
    addMedia: (media: {actualUrl: string, thumbnailUrl: string}) => void;
    removeMedia: (url: string) => void
    setWorkout: (workout: Omit<IWorkout, "id">) => void;
    setWorkoutLog: (workoutLog: Omit<IWorkoutLog, "id">) => void;
    clearWorkout: () => void;
}