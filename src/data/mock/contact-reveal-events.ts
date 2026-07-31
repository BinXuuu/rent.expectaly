/**
 * 演示数据：「获取联系方式」点击事件记录，用于限流与滥用排查（见 docs/COMPLIANCE.md）。
 */
import type { ContactRevealEvent } from "@/types";

export const mockContactRevealEvents: ContactRevealEvent[] = [
  {
    id: "contact-reveal-wangqiang-milano",
    userId: "profile-user-wangqiang",
    listingId: "listing-milano-navigli-1br",
    occurredAt: "2026-07-16T10:06:00+02:00",
  },
  {
    id: "contact-reveal-linfei-torino",
    userId: "profile-user-linfei",
    listingId: "listing-torino-centro-private-room",
    occurredAt: "2026-07-19T09:12:00+02:00",
  },
];
