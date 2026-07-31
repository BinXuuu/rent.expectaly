import type { Locale } from "@/types";
import { DEFAULT_LOCALE } from "@/types";

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "意料之中～意租",
  englishName: "Expectaly Rent",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3200",
  mainSiteUrl: process.env.NEXT_PUBLIC_MAIN_SITE_URL ?? "https://expectaly.com",
  defaultLocale: (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as Locale | undefined) ?? DEFAULT_LOCALE,
} as const;
