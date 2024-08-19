import {IExerciseLog} from "@entities/workout-log";
import api from "@shared/api/AxiosInstance";

export const getExerciseHistoryLogs = async(exerciseId?: number): Promise<IExerciseLog[]> => {
    const {data} = await api.get("/exercises/history/" + exerciseId);
    return data;
}