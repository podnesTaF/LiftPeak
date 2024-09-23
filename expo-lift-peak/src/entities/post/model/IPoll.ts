import {IUser} from "@entities/user";

export interface IPoll {
    id:number;
    question: string;
    answers: IAnswer[];
    isAnonymous: boolean;
    multipleAnswer: boolean;
    currentUserVoteAnswerId?: number
}

export interface IAnswer {
    id:number;
    name: string;
    voters: IUser[]
}