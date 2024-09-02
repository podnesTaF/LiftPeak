import { z } from 'zod';

export const signupSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }), 
    phone: z.string().min(1, { message: "Phone is required" }), 
    gym: z.string().min(1, { message: "Gym location is required" }), 
    // gender: z.enum(["man", "woman", "other"], { message: "Gender must be 'man', 'woman', or 'other'" }), 
    // birthday: z.date({ message: "Invalid date format" }), 
});

export type SignupSchema = z.infer<typeof signupSchema>;
