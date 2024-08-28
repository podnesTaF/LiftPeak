import {BaseEntity} from "@shared/model/BaseEntity";
import {IUser} from "@entities/user";
import {IWorkout} from "@entities/workout";
import {IGroupPost} from "@entities/post";

export interface ILike extends BaseEntity {
    userId: number;
    user?: IUser;

    workoutId?: number;
    workout?: IWorkout;

    postId?: number;
    post?: IGroupPost;
}