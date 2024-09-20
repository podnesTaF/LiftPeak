import {CreateGroupDto} from "@features/group/utils/create-group.schema";
import api from "@shared/api/AxiosInstance";
import {IGroup, IMember} from "@entities/group";

export const CreateGroup = async (dto: CreateGroupDto) => {
    const {data} = await api.post<IGroup>("/groups", {...dto, isPrivate: dto.type === "private"})
    return data
}

export const getGroupMembers = async ({id, count, query}:{id?: number | string, count?: number, query?: string}) => {
    const {data} = await api.get<{ data: IMember[], count: number, totalPages: number, currentPage: number }>("/group/" + id + "/members", {params: {count, query}})
    return data
}