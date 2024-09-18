import {z} from "zod";

export const CreateGroupSchema = z.object({
    pictureUrl: z.string().optional().nullable(),
    name: z.string().min(3).max(50),
    description: z.string().min(3).max(200),
    location: z.string().min(3).max(50),
    type: z.enum(['public','private']),
    groupTag: z.string().min(1).max(30),
    wallpaperUrl: z.string().optional().nullable(),
});

export type CreateGroupDto = z.infer<typeof CreateGroupSchema>;