import {GenerateDto} from "@features/constructor/model/GenerateDto";
import api from "@shared/api/AxiosInstance";
import {IExercise} from "@entities/exercise";

export const generateWorkout = async (dto: GenerateDto) => {
    const {data} = await api.post<{
        workoutPlan: { exercise: IExercise; sets: number; restTime: number }[];
        targetStats: any;
    }>('/constructor/generate', dto);
    return data;
}