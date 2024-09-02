import {ActiveWorkout, IWorkout} from "@entities/workout";
import {ActiveWorkoutLog, IExerciseLog, ISet, IWorkoutLog} from "@entities/workout-log";
import {ExerciseStoreState} from "@features/workout-logger";

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

    updateWorkoutField: (updatedField: Partial<IWorkout>) => void;
    initializeWorkout: (props: {userId: number, isRoutine?: boolean}) => void;
    addMedia: (media: {actualUrl: string, thumbnailUrl: string}) => void;
    removeMedia: (url: string) => void
    setWorkout: (workout: Omit<IWorkout, "id">) => void;
    setWorkoutLog: (workoutLog: Omit<IWorkoutLog, "id">) => void;
    clearWorkout: () => void;
}

export interface RoutineStoreState extends Omit<WorkoutState, "workoutMedia" | "addMedia" | "removeMedia">, ExerciseStoreState {
}