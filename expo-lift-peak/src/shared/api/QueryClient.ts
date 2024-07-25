import { QueryClient } from '@tanstack/react-query';
import api from "@shared/api/AxiosInstance";

// Create a query client
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: async ({ queryKey }) => {
                const { data } = await api.get(queryKey[0] as string);
                return data;
            },
        },
    },
});