import { z } from 'zod';

export const signupSchema = z.object({
    // username: z.string().nonempty({ message: "Username is required" }), 
    gym: z.string().nonempty({ message: "Gym location is required" }), 
    // gender: z.enum(["man", "woman", "other"], { message: "Gender must be 'man', 'woman', or 'other'" }), 
    // birthday: z.date({ message: "Invalid date format" }), // Must be a valid date
});

export type SignupSchema = z.infer<typeof signupSchema>;
