import api from "@shared/api/AxiosInstance";
import {IExercise} from "@entities/exercise";

export const findExerciseList = async ({search, id}: {search: string, id?: number}) => {
    const {data} = await api.get<(IExercise & {id: number, targetGroup: string[] })[]>("/exercises/search", {params: {value: search, id}});
    return data;
}

export const getFullExercise = async (id: number): Promise<IExercise> => {
    const {data} = await api.get<IExercise>(`/exercises/${id}`);
    return data;
}