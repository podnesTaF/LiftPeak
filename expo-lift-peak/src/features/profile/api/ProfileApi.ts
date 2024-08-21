import api from "@shared/api/AxiosInstance";
import {IUser} from "@entities/user";

export const getUserInfo = async (id?: number | string) => {
    const {data} = await api.get<IUser>(`/users/${id}`);

    return data
}