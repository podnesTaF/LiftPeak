import {IExerciseLog} from "@entities/workout-log/model/IExerciseLog";

export interface ISet {
    id: number;
    order: number;
    type: string;
    exerciseLogId: number;
    exerciseLog?: IExerciseLog;

    distanceInM?: number;
    weight?: number;
    timeInS?: number;
    reps?: number;
    previousSetId?: number;
    previousSet?: ISet;

    restInS?: number;

    createdAt: string;
    updatedAt: string;
}