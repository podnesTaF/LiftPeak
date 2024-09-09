import {IProfile, IUserFollow} from "@entities/user";
import {IGym} from "@entities/gym";

export interface IUser {
    id: number;
    email: string;
    password: string;
    username: string;
    profileId?: number;
    profile?: IProfile;
    followings?: IUserFollow[];
    followers?: IUserFollow[];
    followingsCount?: number;
    followersCount?: number;
    isFollowing?: boolean;
    gyms?: IGym[]
}