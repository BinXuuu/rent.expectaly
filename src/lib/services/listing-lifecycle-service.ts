import type { Listing } from "@/types";

/**
 * 房源有效期与生命周期判断。发帖时自选有效期时长（天），到期后应自动置为 "expired" 并从
 * 公开列表下架（见 docs/PROJECT_REQUIREMENTS.md 第 5 节）。第一期演示数据的 expiresAt 为
 * 预先计算好的值，本服务提供统一的判断/计算入口，避免各页面重复实现到期逻辑。
 */

export function computeExpiresAt(publishedAt: string, validityDays: number): string {
  const publishedDate = new Date(publishedAt);
  const expiresDate = new Date(publishedDate.getTime() + validityDays * 24 * 60 * 60 * 1000);
  return expiresDate.toISOString();
}

export function isListingExpired(listing: Listing, now: Date = new Date()): boolean {
  if (!listing.expiresAt) {
    return false;
  }
  return new Date(listing.expiresAt).getTime() <= now.getTime();
}

/** 公开列表页应展示的房源：状态为 published 且未过期 */
export function isPubliclyVisible(listing: Listing, now: Date = new Date()): boolean {
  return listing.status === "published" && !isListingExpired(listing, now);
}

export function filterPubliclyVisibleListings(
  listings: Listing[],
  now: Date = new Date(),
): Listing[] {
  return listings.filter((listing) => isPubliclyVisible(listing, now));
}

/** 距离有效期到期的剩余天数（向下取整），已过期或未发布返回 null。 */
export function daysUntilExpiry(listing: Listing, now: Date = new Date()): number | null {
  if (!listing.expiresAt || isListingExpired(listing, now)) {
    return null;
  }
  const diffMs = new Date(listing.expiresAt).getTime() - now.getTime();
  return Math.floor(diffMs / (24 * 60 * 60 * 1000));
}
