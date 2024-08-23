import api from "@shared/api/AxiosInstance";
import {IGroup} from "@entities/group/model";

export const searchGroups = async (value: string) => {
    const {data} = await api.get<IGroup[]>("/groups/search", {
        params: {value}
    })

    return data
}

export const joinGroup = async (groupId: number) => {
    await api.post(`/group/${groupId}/members`)
}

export const leaveGroup = async (groupId: number) => {
    await api.post(`/group/${groupId}/members`)
}
export const getGroup = async (groupId?: number | string) => {
    const {data} = await api.get<IGroup>(`/groups/${groupId}`)

    return data
}