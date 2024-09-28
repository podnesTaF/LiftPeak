import api from "@shared/api/AxiosInstance";
import {IProfile, IUser} from "@entities/user";
import {IGym} from "@entities/gym";

export const getUserInfo = async (id?: number | string) => {
    const {data} = await api.get<IUser>(`/users/${id}`);

    return data
}

export const getPeople = async ({type, name, userId}: {
    type: "following" | "followers",
    name?: string,
    userId: number
}) => {
    const {data} = await api.get<IUser[]>(`/users/${userId}/people`, {
        params: {
            type,
            name
        }
    })

    return data
}

export const updateUserProfile = async (profile: Partial<IProfile>, gyms?: IGym[]) => {
    const {data} = await api.patch<IProfile>("/profiles", profile)
    if (gyms) {
        await updateGyms(gyms)
    }

    return data
}
export const updateGyms = async (dto: IGym[]) => {
    const {data} = await api.patch("/users/gyms/update", dto)
    return data
}