import { z } from 'zod';

export const profileSchema = z.object({
    phone: z.string().optional(),
    gym: z.string().optional(),
    birthdate: z.string().optional(), 
    gender: z.string().optional()
})

export type ProfileRequest = z.infer<typeof profileSchema>;
