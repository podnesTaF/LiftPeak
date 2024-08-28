import api from "@shared/api/AxiosInstance";
import {IGroupPost} from "@entities/post";

export const getGroupFeed =  async (groupId: number | string) => {
    const {data} = await api.get<IGroupPost[]>(`/groups/posts/${groupId}`);
    return data;
}