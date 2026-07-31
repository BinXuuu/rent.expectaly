import type { Metadata } from "next";
import Link from "next/link";
import { LISTING_STATUS_LABELS, type ListingStatus } from "@/types";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { ReviewDialog } from "@/components/admin/ReviewDialog";
import {
  cityRepository,
  listingRepository,
  profileRepository,
  systemSettingRepository,
} from "@/lib/repositories";
import { findRiskKeywordMatches, parseRiskKeywords } from "@/lib/services/compliance-service";

export const metadata: Metadata = { title: "房源管理" };

const STATUS_TONE: Record<ListingStatus, BadgeTone> = {
  draft: "muted",
  pending_review: "warning",
  published: "success",
  expired: "neutral",
  removed: "danger",
};

export default async function AdminListingsPage() {
  const [listingsRes, citiesRes, profilesRes, riskKeywordsResult] = await Promise.all([
    listingRepository.findAll(),
    cityRepository.findAll(),
    profileRepository.findAll(),
    systemSettingRepository.findByKey("risk_keywords"),
  ]);

  const listings = (listingsRes.ok ? listingsRes.data : []).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
  const cityNameById = new Map(
    (citiesRes.ok ? citiesRes.data : []).map((c) => [c.id, c.name["zh-CN"]]),
  );
  const publisherNameById = new Map(
    (profilesRes.ok ? profilesRes.data : []).map((p) => [p.id, p.displayName]),
  );
  const riskKeywords =
    riskKeywordsResult.ok && riskKeywordsResult.data
      ? parseRiskKeywords(riskKeywordsResult.data.value)
      : [];

  const pendingReview = listings.filter((l) => l.status === "pending_review");
  const others = listings.filter((l) => l.status !== "pending_review");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-ink font-serif text-2xl font-semibold">房源管理</h1>
        <p className="text-ink-muted mt-1 text-sm">
          全平台共 {listings.length} 条房源，其中 {pendingReview.length} 条待审核。
        </p>
      </div>

      {pendingReview.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-ink text-sm font-semibold">待审核</h2>
          {pendingReview.map((listing) => {
            const riskMatches = findRiskKeywordMatches(
              `${listing.title} ${listing.description}`,
              riskKeywords,
            );
            return (
              <div
                key={listing.id}
                className="border-line flex flex-wrap items-start justify-between gap-3 rounded-xs border p-4"
              >
                <div>
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
                    {riskMatches.length > 0 && (
                      <Badge tone="danger">命中风险关键词：{riskMatches.join("、")}</Badge>
                    )}
                  </div>
                  <p className="text-ink-faint mt-2 text-xs">
                    {cityNameById.get(listing.cityId)} · 发帖人：
                    {publisherNameById.get(listing.publisherId) ?? "—"}
                  </p>
                </div>
                <ReviewDialog title="房源审核" subject={listing.title} triggerLabel="审核" />
              </div>
            );
          })}
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-ink text-sm font-semibold">全部房源</h2>
        {others.map((listing) => (
          <div
            key={listing.id}
            className="border-line flex flex-wrap items-center justify-between gap-3 rounded-xs border p-4"
          >
            <div>
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
              </div>
              <p className="text-ink-faint mt-2 text-xs">
                {cityNameById.get(listing.cityId)} · 发帖人：
                {publisherNameById.get(listing.publisherId) ?? "—"}
              </p>
            </div>
            {listing.status !== "removed" && (
              <ReviewDialog title="房源管理" subject={listing.title} triggerLabel="下架" />
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
