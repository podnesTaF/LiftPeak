import {IExercise} from "@entities/exercise";
import {IWorkout} from "@entities/workout";

export interface IMedia {
    id: number;
    name: string;
    mediaUrl: string;
    mediaType: MediaType;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface IExerciseMedia extends IMedia {
    exerciseId: number;
    exercise?: IExercise;
    previewUrl?: string;
}

export interface IWorkoutMedia extends IMedia {
    workoutId: number;
    workout?: IWorkout;
}

export enum MediaType {
    Image = 'image',
    Video = 'video',
}
