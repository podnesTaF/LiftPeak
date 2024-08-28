import {IUser} from "@entities/user";
import {IGroup} from "@entities/group";

export interface IGroupPost {
    id: number;
    userId: number;
    groupId: number;
    user?: IUser;
    group?: IGroup
}