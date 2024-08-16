import {IUser} from "@entities/user";

export interface IWorkoutPreview {
    id: number;
    title: string;
    exercises: string[];
    sets: number;
    user?: Partial<IUser>;
}