export interface IWorkoutMedia {
    id: number;
    createdAt: string;
    updatedAt: string;
    name?: null;
    mediaUrl: string;
    mediaType?: string;
    order?: number;
    workoutId: number;
}