import {IWorkout} from "@entities/workout";
import {IUser} from "@entities/user";

export interface IWorkoutComment {
    id: number;
    workoutId: number;
commenterId: number;
    content: string;
    workout?: IWorkout;
    commenter?: IUser;
    createdAt: string;
    updatedAt: string;
}