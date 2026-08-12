export const SOCIAL_LINKS = {
  tiktok: {
    name: "TikTok",
    href: "https://www.tiktok.com/@hottestdealsuk",
    label: "@hottestdealsuk on TikTok",
  },
  whatnot: {
    name: "Whatnot",
    href: "https://www.whatnot.com/en-GB/user/hottestdealsuk",
    label: "hottestdealsuk on Whatnot",
  },
} as const;

export type SocialPlatform = keyof typeof SOCIAL_LINKS;
