import {IExerciseLog} from "@entities/workout-log/model/IExerciseLog";

export interface ISet {
    id: number;
    order: number;
    type: string;
    exerciseLogId: number | string;
    exerciseLog?: IExerciseLog;

    distanceInM?: number;
    weight?: number;
    timeInS?: number;
    reps?: number;
    previousSetId?: number;
    previousSet?: ISet;

    restInS?: number;

    completed?: boolean;

    createdAt: string;
    updatedAt: string;
}