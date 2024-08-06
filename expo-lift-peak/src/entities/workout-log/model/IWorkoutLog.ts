import {IExerciseLog} from "./IExerciseLog";

export interface IWorkoutLog {
    id: number;
    durationInS: number;
    startTime: string;
    baseWorkoutId: number;
    totalVolume: number;
    totalDistanceInM: number;
    exerciseLogs?: IExerciseLog[];
    createdAt: string;
    updatedAt: string;
}

export interface ActiveWorkoutLog extends Omit<IWorkoutLog, "id" | "durationInS" | "totalVolume" | "totalDistanceInM" | "exerciseLogs" | "createdAt" | "updatedAt"> {}