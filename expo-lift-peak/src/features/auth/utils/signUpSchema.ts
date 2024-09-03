import { z } from 'zod';

export const signupSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password1: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      }),

    password2: z.string(),
    username: z.string().min(1, { message: "Username is required" }), 
    phone: z.string().min(1, { message: "Phone is required" }), 
    gym: z.string().min(1, { message: "Gym location is required" }), 
    birthdate: z.string(), 
    gender: z.string().min(1, { message: "Gender is required" }),
}).refine((data) => data.password1 === data.password2, {
  path: ["password2"],
  message: "Passwords do not match",
});

export type SignupSchema = z.infer<typeof signupSchema>;
