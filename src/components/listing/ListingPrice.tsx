import type { Listing } from "@/types";
import { EXCHANGE_RATE_DISCLAIMER, formatMoney } from "@/lib/services/pricing-service";
import { cn } from "@/lib/utils/cn";

export interface ListingPriceProps {
  listing: Pick<Listing, "purpose" | "price" | "cnyReferencePrice">;
  className?: string;
  showDisclaimer?: boolean;
}

/** 价格展示：出租为月租、出售为总价，人民币参考价为副标，明确注明汇率换算免责声明。 */
export function ListingPrice({ listing, className, showDisclaimer = true }: ListingPriceProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-ink font-serif text-lg font-semibold">
        {formatMoney(listing.price)}
        {listing.purpose === "rent" && (
          <span className="text-ink-muted ml-1 text-xs font-normal">/ 月</span>
        )}
      </span>
      {listing.cnyReferencePrice !== null && (
        <span className="text-ink-muted text-xs">
          约 {formatMoney({ amount: listing.cnyReferencePrice, currency: "CNY" })}
          {listing.purpose === "sale" && " · 总价"}
        </span>
      )}
      {listing.cnyReferencePrice !== null && showDisclaimer && (
        <span className="text-ink-faint text-[11px]">{EXCHANGE_RATE_DISCLAIMER}</span>
      )}
    </div>
  );
}
