import api from "@shared/api/AxiosInstance";
import {EmailOnlyRequest} from "@features/auth/utils/email.schema";
import {IUser} from "@entities/user";
import { UserRequest } from "../utils/user.schema";

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


export const login = async (email: string, password: string): Promise<IUser & { expiresAt: number }> => {
    const { data } = await api.post<IUser & { expiresAt: number }>("/auth/login", { email, password });
    return data;
  };

export const register = async (email: string, password: string, username: string): Promise<IUser & { expiresAt: number }> => {
    const { data } = await api.post<IUser & { expiresAt: number }>("/auth/register", {email, password, username});
    return data;
  };

