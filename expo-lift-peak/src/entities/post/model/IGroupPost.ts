import {IUser} from "@entities/user";
import {IGroup} from "@entities/group";
import {BaseEntity} from "@shared/model/BaseEntity";
import {IPostContent} from "@entities/post";

export interface IGroupPost extends BaseEntity{
    userId: number;
    groupId: number;
    user?: IUser;
    group?: IGroup
    contents: IPostContent[];
}