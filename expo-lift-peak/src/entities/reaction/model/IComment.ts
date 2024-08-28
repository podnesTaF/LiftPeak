import {BaseEntity} from "@shared/model/BaseEntity";
import {IUser} from "@entities/user";
import {IWorkout} from "@entities/workout";
import {IGroupPost} from "@entities/post";

export enum CommentType {
    WORKOUT_POST = 'workout_post',
    GROUP_POST = 'group_post',
}
export interface IComment extends BaseEntity{
    content: string;

    commenterId: number;
    commenter?: IUser;

    type: CommentType;

    workoutId?: number;
    workout?: IWorkout;

    postId?: number;
    post?: IGroupPost;
}