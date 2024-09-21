import api from "@shared/api/AxiosInstance";
import {IMember, MemberRole} from "@entities/group";

export const getGroupMembers = async ({id, count, query}:{id?: number | string, count?: number, query?: string}) => {
    const {data} = await api.get<{ data: IMember[], count: number, totalPages: number, currentPage: number }>("/group/" + id + "/members", {params: {count, query}})
    return data
}

export const removeFromGroup = async (id: number, groupId: string | number) => {
    await api.delete(`/group/${groupId}/members/${id}`)
}

export const getMyMembership = async (groupId: string | number) => {
    const {data} = await api.get<IMember | null>(`/group/${groupId}/members/me`)
    return data
}

export const privilegeRole = async ({id, role, groupId}:{id: number, role: MemberRole, groupId: string
|
number
}) => {
    await api.patch(`/group/${groupId}/members/${id}?role=${role}`);
}