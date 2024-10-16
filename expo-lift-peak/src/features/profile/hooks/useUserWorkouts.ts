import { getUserWorkouts } from "@features/feed"
import { useQuery } from "@tanstack/react-query"

export const useUserWorkouts = (userId: string | number) => {
    return useQuery({
        queryKey: ['profileFeed', userId],
        queryFn: () => getUserWorkouts(userId),
        enabled: !!userId
    })
}