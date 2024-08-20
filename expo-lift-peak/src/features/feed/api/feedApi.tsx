import api from "@shared/api/AxiosInstance";
import {IWorkout, IWorkoutComment} from "@entities/workout";

export const getAllWorkouts  = async () => {
    const {data} = await api.get<IWorkout[]>("/workouts")

    return data
}

export const getWorkoutComments = async (workoutId: number) => {
    const {data} = await api.get<IWorkoutComment[]>(`/workouts/feed/${workoutId}/comments`)

    return data
}

export const commentWorkout = async (workoutId: number, content: string) => {
    const {data} = await api.post(`/workouts/feed/${workoutId}/comment`, {content})
    return data
}

export const reactWorkout = async (workoutId: number) => {
    const {data} = await api.post(`/workouts/feed/${workoutId}/react`)
    return data
}