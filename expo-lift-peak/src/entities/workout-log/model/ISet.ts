import {IExerciseLog} from "@entities/workout-log/model/IExerciseLog";

export interface ISet {
    id: number;
    order: number;
    type: string;
    exerciseLogId: number | string;
    exerciseLog?: IExerciseLog;

    distanceInM: number | null;
    weight: number | null;
    timeInS: number | null;
    reps: number | null;
    previousSetId?: number;
    previousSet?: ISet;

    restInS?: number;

    completed?: boolean;

    createdAt: string;
    updatedAt: string;
}

export enum SetType {
    warmup = 'warmup',
    workout = 'workout',
}
