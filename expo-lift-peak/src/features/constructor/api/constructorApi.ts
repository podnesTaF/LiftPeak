import {GenerateDto} from "@features/constructor/model/GenerateDto";
import api from "@shared/api/AxiosInstance";

export const generateWorkout = async (dto: GenerateDto) => {
    const {data} = await api.post('/workout/generate', dto);
    return data;
}