import { useQuery } from "@tanstack/react-query"
import { getUserInfo } from "../api"

export const useUserData = (userId: string | number) => {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: () => getUserInfo(userId),
        enabled: !!userId
    })
}