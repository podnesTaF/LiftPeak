import {IProfile} from "@entities/user";

export interface IUser {
    id: number;
    email: string;
    password: string;
    username: string;
    profileId?: number;
    profile?: IProfile;
}