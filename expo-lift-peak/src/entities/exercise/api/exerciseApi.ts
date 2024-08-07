import api from "@shared/api/AxiosInstance";
import {IExercise} from "@entities/exercise";

export const findExerciseList = async ({search}: {search: string}) => {
    const {data} = await api.get<(IExercise & {id: number, targetGroup: string[] })[]>("/exercises/search", {params: {value: search}});
    return data;
}