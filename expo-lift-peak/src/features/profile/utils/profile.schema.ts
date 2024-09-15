import { z } from "zod";

// Define a regular expression for social media link validation
const socialMediaLinkRegex = new RegExp(
  /^(https?:\/\/)?(www\.)?(twitter\.com|instagram\.com|facebook\.com|linkedin\.com)\/[A-Za-z0-9_]+$/
);

const gymSchema = z.object({
  name: z.string(),
  address: z.string(),
  longitude: z.number(),
  latitude: z.number(),
});

const socialMediaLinkSchema = z.object({
  profileId: z.number(),
  platform: z.enum(["Twitter", "Facebook", "Instagram", "LinkedIn"]), 
  url: z.string().refine((value) => socialMediaLinkRegex.test(value), {
    message: "Invalid social media link format",
  }),
});

export const profileSchema = z.object({
  avatarUrl: z.string().optional(),
  wallpaperUrl: z.string().optional(),
  goal: z.string().optional(),
  gym: z.array(gymSchema).optional(),
  socialMediaLinks: z.array(z.string()).optional(),
});

export type ProfileRequest = z.infer<typeof profileSchema>;
