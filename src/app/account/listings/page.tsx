import type { Metadata } from "next";
import Link from "next/link";
import { LISTING_PURPOSE_LABELS, LISTING_STATUS_LABELS } from "@/types";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { ListingRowActions } from "@/components/listing/ListingRowActions";
import { ListingPrice } from "@/components/listing/ListingPrice";
import { getCurrentProfile } from "@/lib/auth/session";
import { cityRepository, listingRepository } from "@/lib/repositories";
import { daysUntilExpiry } from "@/lib/services/listing-lifecycle-service";

export const metadata: Metadata = { title: "我的房源", robots: { index: false, follow: false } };

const STATUS_TONE: Record<string, BadgeTone> = {
  draft: "muted",
  pending_review: "warning",
  published: "success",
  expired: "neutral",
  removed: "danger",
};

export default async function AccountListingsPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const [listingsRes, citiesRes] = await Promise.all([
    listingRepository.findByPublisher(profile.id),
    cityRepository.findAll(),
  ]);

  const listings = (listingsRes.ok ? listingsRes.data : []).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
  const cityNameById = new Map(
    (citiesRes.ok ? citiesRes.data : []).map((c) => [c.id, c.name["zh-CN"]]),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-ink font-serif text-2xl font-semibold">我的房源</h1>
          <p className="text-ink-muted mt-1 text-sm">
            管理你发布的全部房源，包括草稿与已下架条目。
          </p>
        </div>
        <Link href="/listings/new" className={buttonClasses("primary", "md")}>
          发布新房源
        </Link>
      </div>

      {listings.length === 0 ? (
        <EmptyState
          title="暂无房源"
          description="点击右上角「发布新房源」开始发布你的第一条房源信息。"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {listings.map((listing) => {
            const remainingDays = daysUntilExpiry(listing);
            return (
              <div
                key={listing.id}
                className="border-line flex flex-col gap-3 rounded-xs border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/listings/${listing.id}`}
                      className="text-ink hover:text-brand-700 text-sm font-medium"
                    >
                      {listing.title}
                    </Link>
                    <Badge tone={STATUS_TONE[listing.status]}>
                      {LISTING_STATUS_LABELS[listing.status]}
                    </Badge>
                    <Badge tone={listing.purpose === "sale" ? "accent" : "neutral"}>
                      {LISTING_PURPOSE_LABELS[listing.purpose]}
                    </Badge>
                  </div>
                  <p className="text-ink-muted mt-1 text-xs">
                    {cityNameById.get(listing.cityId)}
                    {remainingDays !== null && ` · 剩余有效期 ${remainingDays} 天`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <ListingPrice listing={listing} showDisclaimer={false} />
                  <ListingRowActions listingId={listing.id} status={listing.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
