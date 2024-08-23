import {IUser} from "@entities/user";
import {IMember} from "@entities/group/model/IMember";

export interface IGroup {
    id: number;
    name: string;
    description: string;
    pictureUrl: string;
    wallPictureUrl: string;
    isPrivate: boolean;
    groupTag: string;
    ownerId: number;
    owner?: IUser;
    active: boolean;
    members: IMember[];
    isMember?: boolean;
    membersCount?: number
}