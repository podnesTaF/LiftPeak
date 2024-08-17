import { z } from "zod";

export const passwordSchema = z
  .object({
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
  })
  .refine((data) => data.password1 === data.password2, {
    path: ["password2"],
    message: "Passwords do not match",
  });

export type PasswordOnlyRequest = z.infer<typeof passwordSchema>;
