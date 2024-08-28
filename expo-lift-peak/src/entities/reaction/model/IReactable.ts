import {ILike} from "@entities/workout/model/ILike";
import {IComment} from "@entities/reaction";

export interface IReactable {
    likesCount?: number;
    commentsCount?: number;
    comments?: IComment[];
    liked?: boolean;
    likes?: ILike[];
}