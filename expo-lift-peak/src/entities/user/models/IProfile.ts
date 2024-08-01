import {IUser} from "@entities/user";
import {Gender} from "@shared/dictionary";

export interface IProfile {
    id: number;
    createdAt: string;
    updatedAt: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    gender: Gender;
    avatarUrl?: string;
    wallpaperUrl?: string;
    userId: number;
    user?: IUser;
}