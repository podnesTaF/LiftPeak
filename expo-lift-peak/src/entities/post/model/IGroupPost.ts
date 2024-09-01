import {IUser} from "@entities/user";
import {IGroup} from "@entities/group";
import {BaseEntity} from "@shared/model/BaseEntity";
import {IPostContent} from "@entities/post";
import {IReactable} from "@entities/reaction";

export enum PostType {
    GROUP = 'group',
    WORKOUT = 'workout',
}

export interface IGroupPost extends IReactable, BaseEntity  {
    userId: number;
    groupId: number;
    user?: IUser;
    group?: IGroup
    contents: IPostContent[];
}