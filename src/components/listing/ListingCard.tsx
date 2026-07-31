import Link from "next/link";
import { Heart } from "lucide-react";
import type { Listing } from "@/types";
import { LISTING_PURPOSE_LABELS, ROOM_TYPE_LABELS } from "@/types";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import { ListingPrice } from "./ListingPrice";

export interface ListingCardProps {
  listing: Listing;
  cityName?: string;
  className?: string;
}

/**
 * 房源卡片：统一网格展示单位。直角/极小圆角、无阴影，图片比例统一为 4:3，
 * 中介费/合同/宠物等标签展示在图片下方，收藏按钮悬浮于图片右上角。
 */
export function ListingCard({ listing, cityName, className }: ListingCardProps) {
  return (
    <article className={cn("group flex flex-col", className)}>
      <Link href={`/listings/${listing.id}`} className="focus-ring block rounded-xs">
        <div className="border-line relative overflow-hidden rounded-xs border">
          <PlaceholderImage label={listing.title} aspect="landscape" />
          <button
            type="button"
            aria-label="加入收藏"
            className="focus-ring bg-surface/90 text-ink-muted hover:text-danger-900 absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full"
          >
            <Heart aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </Link>

      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          {cityName && <span className="text-ink-muted text-xs">{cityName}</span>}
          <Badge tone={listing.purpose === "sale" ? "accent" : "neutral"}>
            {LISTING_PURPOSE_LABELS[listing.purpose]}
          </Badge>
        </div>
        <Link href={`/listings/${listing.id}`} className="focus-ring rounded-xs">
          <h2 className="text-ink hover:text-brand-700 line-clamp-2 text-sm font-medium">
            {listing.title}
          </h2>
        </Link>
        <span className="text-ink-faint text-xs">
          {ROOM_TYPE_LABELS[listing.roomType]} · {listing.areaSqm}㎡
        </span>
        <ListingPrice listing={listing} showDisclaimer={false} className="mt-1" />
        <div className="mt-1 flex flex-wrap gap-1">
          {listing.requiresAgencyFee ? (
            <Badge tone="warning">需中介费</Badge>
          ) : (
            <Badge tone="success">免中介费</Badge>
          )}
          {listing.hasContract ? (
            <Badge tone="accent">有合同</Badge>
          ) : (
            <Badge tone="muted">无合同</Badge>
          )}
          {listing.purpose === "rent" && listing.petsAllowed && (
            <Badge tone="neutral">可养宠物</Badge>
          )}
        </div>
      </div>
    </article>
  );
}
