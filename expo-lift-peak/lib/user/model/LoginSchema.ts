import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email("Please provide a valid email").nonempty("Please provide your email"),
    password: z.string().nonempty("Please provide your password"),
});

export type LoginUserRequest = z.infer<typeof loginSchema>;