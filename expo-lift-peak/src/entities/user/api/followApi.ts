import api from "@shared/api/AxiosInstance";
import {IUser} from "@entities/user";

export const followUser = async (id: number) => {
    const response = await api.post(`/users/follow/${id}`);
    return response.data;
};

export const unfollowUser = async (id:number) => {
    const response = await api.delete(`/users/unfollow/${id}`);
    return response.data;
};

export const getMyFollowings = async () => {
    const response = await api.get<IUser[]>(`/users/me/followings`);
    return response.data;
};