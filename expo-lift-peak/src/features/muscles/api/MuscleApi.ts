import api from "@shared/api/AxiosInstance";
import {ITarget} from "@entities/exercise";

export const getMusclesWithVectors = async () => {
    const {data} = await api.get<ITarget[]>("/targets/body")

    return data
}