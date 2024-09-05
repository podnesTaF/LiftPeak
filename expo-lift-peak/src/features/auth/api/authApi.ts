import api from "@shared/api/AxiosInstance";
import {EmailOnlyRequest} from "@features/auth/utils/emailSchema";
import {IUser} from "@entities/user";

export const isLoggedIn = async (): Promise<boolean> => {
    try{
        const {data} = await api.get<boolean>("/auth/authenticated");
        return data;
    } catch (e) {
        return false;
    }
}

export const resetRequest = async ({email}: EmailOnlyRequest): Promise<string> => {
    const {data}  = await api.post<string>("/auth/request-reset", {email});

    return data
}

export const validateOtp = async (dto: {email: string, otp: string})=>  {
    const {data} = await api.post<string>("otp/validate", dto);
    return data;
}

export const resetPassword = async (dto: {password: string, jwt: string}): Promise<IUser & { expiresAt: number }> => {
    const {data} = await api.post<IUser & { expiresAt: number }>("/auth/reset-password", dto);
    return data;
}