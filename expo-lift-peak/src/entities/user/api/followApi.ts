import api from "@shared/api/AxiosInstance";
import {IUser} from "@entities/user";

export const getMyFollowings = async (query?:{idOnly?: boolean}) => {
    const response = await api.get<IUser[] | Partial<IUser>[]>(`/users/me/followings`, {params: query});
    return response.data;
};