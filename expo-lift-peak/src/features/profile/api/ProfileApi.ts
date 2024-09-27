import api from "@shared/api/AxiosInstance";
import {IProfile, IUser} from "@entities/user";
import {IGym} from "@entities/gym";

export const getUserInfo = async (id?: number | string) => {
    const {data} = await api.get<IUser>(`/users/${id}`);

    return data
}

export const updateUserProfile = async (profile: IProfile, gyms?: IGym[]) => {
    const {data} = await api.patch("/profiles", profile)
    if(gyms){
       await updateGyms(gyms)
    }

    return data
}
export const updateGyms = async (dto:IGym[]) => {
    const {data} = await api.patch("/users/gyms/update", dto)
    return data
}