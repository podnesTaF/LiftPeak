import {IUser} from "@entities/user";
import {IWorkoutLog} from "@entities/workout-log";
import {IWorkoutMedia} from "@entities/workout/model/IWorkoutMedia";
import {ILike} from "@entities/workout/model/ILike";
import {IReactable} from "@entities/reaction";

export interface IWorkout extends IReactable{
    id: number | string;
    title: string;
    description?: string;
    isRoutine?: boolean;
    routineId?: number;
    userId: number;
    workoutLogId?: number;
    workoutLog?: IWorkoutLog;
    user?: IUser;
    createdAt: string;
    updatedAt: string;
    mediaContents?: IWorkoutMedia[]
}

export interface ActiveWorkout extends Omit<IWorkout, "id" | "createdAt" | "workoutLogId" | "updatedAt"> {
}