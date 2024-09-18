import {CreateGroupDto} from "@features/group/utils/create-group.schema";
import api from "@shared/api/AxiosInstance";
import {IGroup} from "@entities/group";

export const CreateGroup = async (dto: CreateGroupDto) => {
    const {data} = await api.post<IGroup>("/groups", {...dto, isPrivate: dto.type === "private"})
    return data
}