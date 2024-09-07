import api from "@shared/api/AxiosInstance";
import {IExercise} from "@entities/exercise";

export const findExerciseList = async ({search, id, muscles}: {search: string, id?: number, muscles: string}) => {
    const {data} = await api.get<(IExercise & {id: number, targetGroup: string[] })[]>("/exercises/search", {params: {value: search, id, muscles}});
    return data;
}

export const getFullExercise = async (id: number): Promise<IExercise> => {
    const {data} = await api.get<IExercise>(`/exercises/${id}`);
    return data;
}

export const getAlternativeExercises = async (id: number): Promise<IExercise[]> => {
    const {data} = await api.get<IExercise[]>(`/exercises/${id}/alternatives`);
    return data;
}

export const getAlternativeExercisesShort = async (id: number): Promise<IExercise[]> => {
    const {data} = await api.get<IExercise[]>(`/exercises/${id}/alternatives?shortForm=true`);
    return data;
}