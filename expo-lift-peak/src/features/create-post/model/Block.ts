import {TextType} from "@entities/post";

export type BlockType = TextType | 'image' | 'exercise' | "workout" | "poll";


export interface IPollBlock {
    question: string;
    answers: IAnswerBlock[];
    isAnonymous: boolean;
    multipleAnswer: boolean
}

export interface IAnswerBlock {
    id:string;
    name: string;
}

export interface BaseBlock {
    id: string;
    type: BlockType;
    poll?: IPollBlock;
}

export interface TextBlock extends BaseBlock {
    type: TextType;
    content: string;
}

export interface ImageBlock extends BaseBlock {
    type: 'image';
    content: string;
}

export interface ExerciseBlock extends BaseBlock {
    type: 'exercise';
    content: string;
}

export interface WorkoutBlock extends BaseBlock {
    type: 'workout';
    content: string;
}

export interface PollBlock extends BaseBlock {
    type: "poll",
    content: string,
}



export type Block = TextBlock | ImageBlock | ExerciseBlock | WorkoutBlock | PollBlock;
