import {IEquipment} from "@entities/exercise";
import api from "@shared/api/AxiosInstance";

export const getEquipment = async () => {
    const {data} = await api.get<IEquipment[]>("/equipments");
    return data
}