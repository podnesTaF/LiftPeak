import api from "@shared/api/AxiosInstance";

export const isLoggedIn = async (): Promise<boolean> => {
    try{
        const {data} = await api.get<boolean>("/auth/authenticated");
        return data;
    } catch (e) {
        return false;
    }
}