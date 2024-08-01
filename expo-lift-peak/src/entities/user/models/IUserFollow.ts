import {IUser} from "@entities/user";

export interface IUserFollow {
    id: number;
    followedId: boolean;
    followed?: IUser;
    followerId: boolean;
    follower?: IUser;
}