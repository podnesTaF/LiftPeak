import api from "@shared/api/AxiosInstance";
import {IWorkout} from "@entities/workout";
import {IComment} from "@entities/reaction";
import {PostType} from "@entities/post";

export const getAllWorkouts  = async () => {
    const {data} = await api.get<IWorkout[]>("/workouts")

    return data
}

export const getWorkoutComments = async (workoutId: number) => {
    const {data} = await api.get<IComment[]>(`/comments/workout/${workoutId}`)

    return data
}

export const commentWorkout = async (workoutId: number, content: string) => {
    const {data} = await api.post(`/comments/leave/${workoutId}`, {content})
    return data
}

export const reactWorkout = async (workoutId: number) => {
    const {data} = await api.post<{like: boolean, likesCount: number}>(`/likes/workout/${workoutId}`)
    return data
}

export const markAsSeen = async (postId: number, postType: PostType) => {
    await api.post(`/feed/mark-post-as-seen/${postId}?postType=${postType}`)
}