import {IGroup} from "@entities/group/model/IGroup";
import {IUser} from "@entities/user";

export interface IMember {
    id: number;
    groupId: number;
    group?: IGroup;
    userId: number;
    user?: IUser;
}