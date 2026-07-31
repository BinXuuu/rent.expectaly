import Link from "next/link";
import type { Listing } from "@/types";
import { LISTING_PURPOSE_LABELS, ROOM_TYPE_LABELS } from "@/types";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { Badge } from "@/components/ui/Badge";
import { ListingPrice } from "./ListingPrice";

export interface ListingListRowProps {
  listing: Listing;
  cityName?: string;
}

/** 房源列表视图行：与 ListingCard 共用同一批数据，适合信息密度更高的浏览方式。 */
export function ListingListRow({ listing, cityName }: ListingListRowProps) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="focus-ring border-line hover:border-brand-200 flex gap-4 rounded-xs border p-3"
    >
      <PlaceholderImage
        label={listing.title}
        aspect="square"
        className="h-24 w-24 shrink-0 rounded-xs"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <div className="flex items-center gap-1.5">
          {cityName && <span className="text-ink-muted text-xs">{cityName}</span>}
          <Badge tone={listing.purpose === "sale" ? "accent" : "neutral"}>
            {LISTING_PURPOSE_LABELS[listing.purpose]}
          </Badge>
        </div>
        <h3 className="text-ink line-clamp-1 text-sm font-medium">{listing.title}</h3>
        <span className="text-ink-faint text-xs">
          {ROOM_TYPE_LABELS[listing.roomType]} · {listing.areaSqm}㎡
        </span>
        <div className="flex flex-wrap gap-1">
          {listing.requiresAgencyFee ? (
            <Badge tone="warning">需中介费</Badge>
          ) : (
            <Badge tone="success">免中介费</Badge>
          )}
          {listing.hasContract && <Badge tone="accent">有合同</Badge>}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end justify-center">
        <ListingPrice listing={listing} showDisclaimer={false} className="items-end text-right" />
      </div>
    </Link>
  );
}
