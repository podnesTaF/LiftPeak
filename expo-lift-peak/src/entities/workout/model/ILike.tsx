import {IWorkout} from "@entities/workout";
import {IUser} from "@entities/user";

export interface ILike {
    workoutId: number;
    workout?: IWorkout;
    userId: number;
    user?: IUser;
}