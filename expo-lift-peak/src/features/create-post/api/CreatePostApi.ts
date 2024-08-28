import {IGroupPost, IPostContent} from "@entities/post";
import {CreatePostDto} from "@features/create-post/model";
import api from "@shared/api/AxiosInstance";

export const createPost = async (groupId: number | string, dto: CreatePostDto): Promise<IGroupPost> => {
    const {data} = await api.post<IGroupPost>(`/groups/posts/${groupId}`, dto);

    return data
}