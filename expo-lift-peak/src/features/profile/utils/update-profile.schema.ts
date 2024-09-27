import {z} from "zod";

export const updateProfileSchema = z.object({
    goal: z.string().min(3).max(255).optional(),
    gyms: z.string().optional(),
})