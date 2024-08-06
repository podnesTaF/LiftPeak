import {IExerciseLog, ISet} from "@entities/workout-log";

export interface ExerciseStoreState {
    exerciseLogs: IExerciseLog[];

    isLoading: boolean;
    error: string | null;

    addExerciseLog: (exerciseLog: IExerciseLog) => void;
    updateExerciseLog: (exerciseLog: IExerciseLog) => void;
    removeExerciseLog: (exerciseLogId: number) => void;
    addSet: (exerciseId: number,workoutSet: ISet) => void;
    updateSet: (exerciseId: number, workoutSet: ISet) => void;
    removeSet: (exerciseId: number, setId: number) => void;
    clearExercises: () => void;
}