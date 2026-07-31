import type { Favorite, Result } from "@/types";
import { ok } from "@/types";
import { mockFavorites } from "@/data/mock";

/** 收藏记录无软删除概念（取消收藏即从集合中移除），因此不复用 createInMemoryRepository */
export const favoriteRepository = {
  async findByUser(userId: string): Promise<Result<Favorite[]>> {
    return ok(mockFavorites.filter((f) => f.userId === userId));
  },

  async findByListing(listingId: string): Promise<Result<Favorite[]>> {
    return ok(mockFavorites.filter((f) => f.listingId === listingId));
  },

  async exists(userId: string, listingId: string): Promise<Result<boolean>> {
    return ok(mockFavorites.some((f) => f.userId === userId && f.listingId === listingId));
  },
};
