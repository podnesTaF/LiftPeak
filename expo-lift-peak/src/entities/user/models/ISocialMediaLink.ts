import {IProfile} from "@entities/user";

export interface ISocialMediaLink {
    id?: number;
    profileId: number;
    profile?: IProfile;
    platform: SocialMediaPlatform;
    url: string;
}

export enum SocialMediaPlatform {
    Twitter = 'Twitter',
    Snapchat = 'Snapchat',
    Instagram = 'Instagram',
}