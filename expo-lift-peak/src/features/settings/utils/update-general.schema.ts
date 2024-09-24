import {z} from "zod";
import {Gender} from "@shared/dictionary";

export const updateGeneralSchema = z.object({
    firstName: z.string().min(2).max(50).optional(),
    lastName: z.string().min(2).max(50).optional(),
    gender: z.string().nullable(),
    dateOfBirth: z.string().nullable()
})

export type UpdateGeneralSchema = z.infer<typeof updateGeneralSchema>;