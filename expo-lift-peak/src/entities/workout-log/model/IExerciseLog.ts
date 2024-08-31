import {IWorkoutLog} from "@entities/workout-log/model/IWorkoutLog";
import {ISet} from "@entities/workout-log/model/ISet";
import {IExercise} from "@entities/exercise";

export interface IExerciseLog {
    id: number | string;
    workoutLogId?: number | string;
    workoutLog?: IWorkoutLog;
    exerciseId: number;
    exercise?: IExercise;
    order: number;
    sets?: ISet[];
    previousSets?: ISet[];
    createdAt: string;
    updatedAt: string;
}

export interface ActiveExerciseLog extends Omit<IExerciseLog, "id" | "workoutLogId" | "workoutLog" | "createdAt" | "updatedAt"> {}