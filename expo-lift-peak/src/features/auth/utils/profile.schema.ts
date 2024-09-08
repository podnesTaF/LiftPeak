import { z } from 'zod';

export const profileSchema = z.object({
  
    username: z.string().min(1, { message: "Username is required" }), 
    phone: z.string().min(1, { message: "Phone is required" }), 
    gym: z.string().min(1, { message: "Gym location is required" }), 
    birthdate: z.string(), 
    gender: z.string().min(1, { message: "Gender is required" }),
})

export type ProfileRequest = z.infer<typeof profileSchema>;
