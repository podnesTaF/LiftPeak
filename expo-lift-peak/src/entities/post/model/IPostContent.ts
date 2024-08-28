import {IGroupPost} from "@entities/post/model/IGroupPost";
import {IExercise} from "@entities/exercise";

export interface IPostContent {
    id: number;
    type: PostContentType;
    content?: string;
    postId: number;
    post?: IGroupPost;
    textType?: TextType;
    imageUrl?: string;
    exerciseId?: number;
    exercise?: IExercise;
    workoutId?: number;
    workout?: IExercise;
}


export enum PostContentType {
    TEXT = 'text',
    IMAGE = 'image',
    EXERCISE = 'exercise',
    WORKOUT = 'workout',
}

export enum TextType {
    TEXT = 'text',
    SUBTITLE = 'subtitle',
    TITLE = 'title',
}

