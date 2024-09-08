import { z } from "zod";

export const emailSchema = z.object({
    email: z.string().email({message: "Invalid email address"})
})

export type EmailOnlyRequest = z.infer<typeof emailSchema>