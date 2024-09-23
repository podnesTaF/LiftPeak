import {IGroupPost} from "@entities/post/model/IGroupPost";
import {IExercise} from "@entities/exercise";
import {IPoll} from "@entities/post/model/IPoll";
import {IPollBlock} from "@features/create-post/model";
import {IWorkout} from "@entities/workout";
import {IWorkoutPreview} from "@features/workout";

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
    workout?: IWorkout;
    workoutPreview?: IWorkoutPreview;
    poll?: IPoll | IPollBlock;
}


export enum PostContentType {
    TEXT = 'text',
    IMAGE = 'image',
    EXERCISE = 'exercise',
    WORKOUT = 'workout',
    POLL = "poll"
}

export enum TextType {
    TEXT = 'text',
    SUBTITLE = 'subtitle',
    TITLE = 'title',
}

