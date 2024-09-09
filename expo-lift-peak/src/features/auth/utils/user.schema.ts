import { z } from "zod";
import { checkIfUserExists } from "@features/auth/api/authApi";

// Asynchronous validation for username availability
export const userSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .refine(async (username) => {
        const isAvailable = await checkIfUserExists(username, "username");
        return !isAvailable;
      }, { message: "Username is already taken" }),
  });

export type UserRequest = z.infer<typeof userSchema>;
