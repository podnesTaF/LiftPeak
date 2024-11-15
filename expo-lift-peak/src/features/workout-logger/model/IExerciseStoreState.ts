import {IExerciseLog, ISet} from "@entities/workout-log";

export interface ExerciseStoreState {
    exerciseLogs: IExerciseLog[];

    isLoading: boolean;
    error: string | null;

    setExerciseLogs: (exerciseLogs: IExerciseLog[]) => void;
    addExerciseLog: (exerciseLog: Omit<IExerciseLog, "id">) => void;
    updateExerciseLog: (exerciseLog: IExerciseLog) => void;
    removeExerciseLog: (exerciseLogId: number | string) => void;

    addRest: (exerciseId: number | string, duration: number) => void;

    updateSetRest: (exerciseId: number | string, setId: number, duration: number) => void;

    addSet: (exerciseId: number | string,workoutSet: Omit<ISet, "id">) => void;
    updateSet: (exerciseId: number | string, workoutSet: ISet) => void;
    removeSet: (exerciseId: number | string, setId: number) => void;
    clearExercises: () => void;
    getExerciseSetsStats: (exerciseLogId: number | string) => {totalSets: number, setsDone: number};
    getExerciseById: (exerciseId: number | string) => IExerciseLog | undefined;
    getOrder: () => number;
    reorder: (from: number, to: number) => void;

    getCurrentExercise: () => IExerciseLog | undefined;
}