import api from "@shared/api/AxiosInstance";
import {CommentType, IComment} from "@entities/reaction/model";

export const getComments = async (relatedEntityId: number | string, type: CommentType) => {
    const {data} = await api.get<IComment[]>(`/comments/${relatedEntityId}?type=${type}`)
    return data
}

export const leaveComment = async(relatedEntityId: number | string, type: CommentType, content: string) => {
    const {data} = await api.post<IComment>(`/comments/leave/${relatedEntityId}`, {
        type,
        content
    })

    return data
}