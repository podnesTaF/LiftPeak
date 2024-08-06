import {IExercise} from "@entities/exercise/model/IExercise";

export interface Instruction {
    id: number;
    content: string;
    exerciseId: number;
    exercise?: IExercise;
    createdAt: string;
    updatedAt: string;
}