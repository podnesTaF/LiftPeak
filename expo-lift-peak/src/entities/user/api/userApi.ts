import api from "@shared/api/AxiosInstance";
import {IProfile, IUser} from "@entities/user";

export const fetchUserProfile = async () => {
    const response = await api.get('/users/general');
    return response.data;
};

export const searchUsers = async ({search}: {search: string}) => {
    const response = await api.get<IProfile[]>('/profiles/search', {params: {value: search}});
    return response.data;
}