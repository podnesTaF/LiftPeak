import {IExerciseLog} from "./IExerciseLog";

export interface IWorkoutLog {
    id: number | string;
    durationInS?: number;
    startTime: string;
    baseWorkoutId: number | string;
    totalVolume: number;
    totalDistanceInM: number;
    exerciseLogs?: IExerciseLog[];
    createdAt: string;
    updatedAt: string;
}

export interface ActiveWorkoutLog extends Omit<IWorkoutLog, "id" | "durationInS" | "totalVolume" | "totalDistanceInM" | "exerciseLogs" | "createdAt" | "updatedAt"> {}