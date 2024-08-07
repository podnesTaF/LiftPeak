import {IUser} from "@entities/user";
import {IWorkoutLog} from "@entities/workout-log";

export interface IWorkout {
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
}

export interface ActiveWorkout extends Omit<IWorkout, "id" | "createdAt" | "workoutLogId" | "updatedAt"> {
}