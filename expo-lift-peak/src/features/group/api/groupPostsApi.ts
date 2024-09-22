import api from "@shared/api/AxiosInstance";
import {IGroupPost} from "@entities/post";

export const getGroupFeed =  async (groupId: number | string) => {
    const {data} = await api.get<IGroupPost[]>(`/groups/posts/${groupId}`);
    return data;
}

export const pollVote = async (answerId: number) => {
    const {data} = await api.post<{totalNumberOfVotes: number, votedId: number}>("/polls/vote", {answerId})
    return data
}