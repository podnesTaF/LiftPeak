import { SocialMediaPlatform } from "@entities/user";

export const generateSocialMediaUrl = (
    platform: SocialMediaPlatform,
    username: string
  ) => {
    switch (platform) {
      case SocialMediaPlatform.Instagram:
        return `https://www.instagram.com/${username}`;
      case SocialMediaPlatform.Snapchat:
        return `https://www.snapchat.com/add/${username}`;
      case SocialMediaPlatform.Twitter:
        return `https://www.twitter.com/${username}`;
      default:
        return "";
    }
  };