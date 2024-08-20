import {IUser} from "@entities/user";
import {IWorkoutLog} from "@entities/workout-log";
import {IWorkoutMedia} from "@entities/workout/model/IWorkoutMedia";
import {ILike} from "@entities/workout/model/ILike";

export interface IWorkout {
    id: number | string;
    title: string;
    description?: string;
    isRoutine?: boolean;
    routineId?: number;
    userId: number;
    workoutLogId?: number;
    workoutLog?: IWorkoutLog;
    likes?: ILike[];
    likesCount?: number;
    commentsCount?: number;
    liked?: boolean;
    user?: IUser;
    createdAt: string;
    updatedAt: string;
    mediaContents: IWorkoutMedia[]
}

export interface ActiveWorkout extends Omit<IWorkout, "id" | "createdAt" | "workoutLogId" | "updatedAt"> {
}