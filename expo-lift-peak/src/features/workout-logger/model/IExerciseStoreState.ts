import {IExerciseLog, ISet} from "@entities/workout-log";

export interface ExerciseStoreState {
    exerciseLogs: IExerciseLog[];

    isLoading: boolean;
    error: string | null;

    addExerciseLog: (exerciseLog: Omit<IExerciseLog, "id">) => void;
    updateExerciseLog: (exerciseLog: IExerciseLog) => void;
    removeExerciseLog: (exerciseLogId: number | string) => void;
    addSet: (exerciseId: number | string,workoutSet: Omit<ISet, "id">) => void;
    updateSet: (exerciseId: number | string, workoutSet: ISet) => void;
    removeSet: (exerciseId: number | string, setId: number) => void;
    clearExercises: () => void;
    getExerciseSetsStats: (exerciseLogId: number | string) => {totalSets: number, setsDone: number};
    getExerciseById: (exerciseId: number | string) => IExerciseLog | undefined;
    getOrder: () => number;
    reorder: (from: number, to: number) => void;
}