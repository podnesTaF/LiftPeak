import {TextType} from "@entities/post";

export type BlockType = TextType | 'image' | 'exercise' | "workout";

export interface BaseBlock {
    id: string;
    type: BlockType;
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



export type Block = TextBlock | ImageBlock | ExerciseBlock | WorkoutBlock;
