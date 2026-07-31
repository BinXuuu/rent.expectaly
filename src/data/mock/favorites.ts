/**
 * 演示数据：收藏。需登录，收藏列表在用户中心展示。
 */
import type { Favorite } from "@/types";

export const mockFavorites: Favorite[] = [
  {
    id: "favorite-wangqiang-milano",
    userId: "profile-user-wangqiang",
    listingId: "listing-milano-navigli-1br",
    createdAt: "2026-07-16T10:05:00+02:00",
  },
  {
    id: "favorite-wangqiang-torino",
    userId: "profile-user-wangqiang",
    listingId: "listing-torino-centro-private-room",
    createdAt: "2026-07-19T09:10:00+02:00",
  },
  {
    id: "favorite-giulia-parma",
    userId: "profile-user-giulia",
    listingId: "listing-parma-shared-room-pets",
    createdAt: "2026-07-22T12:00:00+02:00",
  },
];
