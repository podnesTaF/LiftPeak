import {IExercise} from "@entities/exercise/model/IExercise";

export interface IExerciseTarget {
    id: number;
    createdAt: string;
    updatedAt: string;
    targetId: number;
    exerciseId: number;
    priority: number;
    target?: ITarget;
    exercise?: IExercise;
}

export interface ITarget {
    id: number;
    name: string;
    description: string;
    parentId: number;
    parent?: ITarget;
    muscles?: ITarget[];
    paths?: {
        front?: string[],
        back?: string[]
    }
    createdAt: string;
    updatedAt: string;
}