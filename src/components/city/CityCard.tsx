import Link from "next/link";
import type { City } from "@/types";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { cn } from "@/lib/utils/cn";

export interface CityCardProps {
  city: City;
  className?: string;
}

/** 城市卡片：城市列表页展示单位，跳转至城市详情（该城市下的房源列表）。 */
export function CityCard({ city, className }: CityCardProps) {
  return (
    <Link
      href={`/cities/${city.slug}`}
      className={cn("focus-ring group flex flex-col rounded-xs", className)}
    >
      <div className="border-line overflow-hidden rounded-xs border">
        <PlaceholderImage label={city.name["zh-CN"]} aspect="landscape" />
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <h2 className="text-ink group-hover:text-brand-700 text-sm font-medium">
          {city.name["zh-CN"]}
        </h2>
        {city.introduction && (
          <p className="text-ink-muted line-clamp-2 text-xs">{city.introduction["zh-CN"]}</p>
        )}
      </div>
    </Link>
  );
}
