import {IGroup} from "@entities/group/model/IGroup";
import {IUser} from "@entities/user";

export enum MemberRole {
    ADMIN = 'admin',
    MEMBER = 'member',
}

export interface IMember {
    id: number;
    groupId: number;
    group?: IGroup;
    userId: number;
    user?: IUser;
    role: MemberRole
}