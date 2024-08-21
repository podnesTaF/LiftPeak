import {IUser} from "./IUser";
import {Gender} from "@shared/dictionary";
import {ISocialMediaLink} from './ISocialMediaLink'

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
    goal?: string;
    country?: string;
    city?: string;
    socialMediaLinks?: ISocialMediaLink[];
}