import api from "@shared/api/AxiosInstance";

export const fetchUserProfile = async () => {
    const response = await api.get('/users/general');
    return response.data;
};