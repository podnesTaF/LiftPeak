import api from "@shared/api/AxiosInstance";
import {IWorkoutPreview} from "../model";

export const getRoutineList = async (): Promise<IWorkoutPreview[]> => {
    const {data} = await api.get<IWorkoutPreview[]>("workouts/routine/list");
    return data
}