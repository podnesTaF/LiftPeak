import api from "@shared/api/AxiosInstance";
import {IWorkout} from "@entities/workout";

export const getAllWorkouts  = async () => {
    const {data} = await api.get<IWorkout[]>("/workouts")

    return data
}