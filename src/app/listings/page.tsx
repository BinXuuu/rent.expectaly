import Link from "next/link";
import type { Metadata } from "next";
import type { ListingPurpose, RoomType } from "@/types";
import { LISTING_PURPOSE_LABELS, ROOM_TYPE_LABELS } from "@/types";
import { PageContainer } from "@/components/shared/PageContainer";
import { Grid } from "@/components/shared/Grid";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListingCard } from "@/components/listing/ListingCard";
import { ListingListRow } from "@/components/listing/ListingListRow";
import { MobileFilterDrawer } from "@/components/listing/MobileFilterDrawer";
import { cityRepository, listingRepository } from "@/lib/repositories";
import { filterPubliclyVisibleListings } from "@/lib/services/listing-lifecycle-service";

export const metadata: Metadata = {
  title: "找房源",
  description: "按出租/出售类别、城市、房型、价格区间、中介费、合同等条件筛选意大利个人房源。",
  alternates: { canonical: "/listings" },
};

const SORT_OPTIONS = [
  { value: "newest", label: "最新发布" },
  { value: "price_asc", label: "价格从低到高" },
  { value: "price_desc", label: "价格从高到低" },
] as const;

const PURPOSE_OPTIONS: { value: ListingPurpose; label: string }[] = (
  Object.entries(LISTING_PURPOSE_LABELS) as [ListingPurpose, string][]
).map(([value, label]) => ({ value, label }));

const ROOM_TYPE_OPTIONS: { value: RoomType; label: string }[] = (
  Object.entries(ROOM_TYPE_LABELS) as [RoomType, string][]
).map(([value, label]) => ({ value, label }));

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function buildQueryString(
  current: SearchParams,
  overrides: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(current)) {
    const v = firstValue(value);
    if (v) params.set(key, v);
  }
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = firstValue(params.q)?.trim().toLowerCase();
  const purpose = firstValue(params.purpose) as ListingPurpose | undefined;
  const citySlug = firstValue(params.city);
  const roomType = firstValue(params.room_type) as RoomType | undefined;
  const agencyFee = firstValue(params.agency_fee); // "yes" | "no" | undefined
  const contract = firstValue(params.contract); // "yes" | "no" | undefined
  const pets = firstValue(params.pets) === "yes";
  const priceMin = firstValue(params.price_min) ? Number(params.price_min) : undefined;
  const priceMax = firstValue(params.price_max) ? Number(params.price_max) : undefined;
  const sort = firstValue(params.sort) ?? "newest";
  const view = firstValue(params.view) === "list" ? "list" : "grid";

  const [listingsRes, citiesRes] = await Promise.all([
    listingRepository.findAll(),
    cityRepository.findAll(),
  ]);

  const cities = citiesRes.ok ? citiesRes.data : [];
  const cityNameById = new Map(cities.map((c) => [c.id, c.name["zh-CN"]]));
  const city = cities.find((c) => c.slug === citySlug);

  let listings = filterPubliclyVisibleListings(listingsRes.ok ? listingsRes.data : []);

  if (q) {
    listings = listings.filter((l) => l.title.toLowerCase().includes(q));
  }
  if (purpose) {
    listings = listings.filter((l) => l.purpose === purpose);
  }
  if (city) {
    listings = listings.filter((l) => l.cityId === city.id);
  }
  if (roomType) {
    listings = listings.filter((l) => l.roomType === roomType);
  }
  if (agencyFee === "yes") {
    listings = listings.filter((l) => l.requiresAgencyFee);
  } else if (agencyFee === "no") {
    listings = listings.filter((l) => !l.requiresAgencyFee);
  }
  if (contract === "yes") {
    listings = listings.filter((l) => l.hasContract);
  } else if (contract === "no") {
    listings = listings.filter((l) => !l.hasContract);
  }
  if (pets) {
    listings = listings.filter((l) => l.petsAllowed);
  }
  if (priceMin !== undefined) {
    listings = listings.filter((l) => l.price.amount >= priceMin);
  }
  if (priceMax !== undefined) {
    listings = listings.filter((l) => l.price.amount <= priceMax);
  }

  const sorted = [...listings].sort((a, b) => {
    switch (sort) {
      case "price_asc":
        return a.price.amount - b.price.amount;
      case "price_desc":
        return b.price.amount - a.price.amount;
      default:
        return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
    }
  });

  const hasActiveFilters = Boolean(
    q || purpose || city || roomType || agencyFee || contract || pets || priceMin || priceMax,
  );

  const filterFields = (
    <div className="flex flex-col gap-5">
      <div>
        <label htmlFor="q" className="text-ink text-sm font-medium">
          搜索
        </label>
        <input
          id="q"
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="房源标题"
          className="focus-ring border-line-strong bg-surface text-ink mt-1.5 h-10 w-full rounded-sm border px-3 text-sm"
        />
      </div>

      <div>
        <label htmlFor="purpose" className="text-ink text-sm font-medium">
          类别
        </label>
        <select
          id="purpose"
          name="purpose"
          defaultValue={purpose ?? ""}
          className="focus-ring border-line-strong bg-surface text-ink mt-1.5 h-10 w-full rounded-sm border px-3 text-sm"
        >
          <option value="">出租 + 出售</option>
          {PURPOSE_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="city" className="text-ink text-sm font-medium">
          城市
        </label>
        <select
          id="city"
          name="city"
          defaultValue={citySlug ?? ""}
          className="focus-ring border-line-strong bg-surface text-ink mt-1.5 h-10 w-full rounded-sm border px-3 text-sm"
        >
          <option value="">全部城市</option>
          {cities.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name["zh-CN"]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="room_type" className="text-ink text-sm font-medium">
          房型
        </label>
        <select
          id="room_type"
          name="room_type"
          defaultValue={roomType ?? ""}
          className="focus-ring border-line-strong bg-surface text-ink mt-1.5 h-10 w-full rounded-sm border px-3 text-sm"
        >
          <option value="">全部房型</option>
          {ROOM_TYPE_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="agency_fee" className="text-ink text-sm font-medium">
          中介费
        </label>
        <select
          id="agency_fee"
          name="agency_fee"
          defaultValue={agencyFee ?? ""}
          className="focus-ring border-line-strong bg-surface text-ink mt-1.5 h-10 w-full rounded-sm border px-3 text-sm"
        >
          <option value="">不限</option>
          <option value="no">免中介费</option>
          <option value="yes">需中介费</option>
        </select>
      </div>

      <div>
        <label htmlFor="contract" className="text-ink text-sm font-medium">
          合同
        </label>
        <select
          id="contract"
          name="contract"
          defaultValue={contract ?? ""}
          className="focus-ring border-line-strong bg-surface text-ink mt-1.5 h-10 w-full rounded-sm border px-3 text-sm"
        >
          <option value="">不限</option>
          <option value="yes">有合同</option>
          <option value="no">无合同</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="pets"
          value="yes"
          defaultChecked={pets}
          className="focus-ring border-line-strong h-4 w-4 rounded-xs"
        />
        <span className="text-ink">可养宠物</span>
      </label>

      <div>
        <span className="text-ink text-sm font-medium">
          价格区间（欧元，出租为月租/出售为总价）
        </span>
        <div className="mt-1.5 flex items-center gap-2">
          <input
            type="number"
            name="price_min"
            min={0}
            defaultValue={priceMin ?? ""}
            placeholder="最低"
            className="focus-ring border-line-strong bg-surface text-ink h-10 w-full rounded-sm border px-3 text-sm"
          />
          <span className="text-ink-faint">–</span>
          <input
            type="number"
            name="price_max"
            min={0}
            defaultValue={priceMax ?? ""}
            placeholder="最高"
            className="focus-ring border-line-strong bg-surface text-ink h-10 w-full rounded-sm border px-3 text-sm"
          />
        </div>
      </div>

      <input type="hidden" name="sort" value={sort} />
      <input type="hidden" name="view" value={view} />

      <div className="flex flex-col gap-2">
        <button
          type="submit"
          className="focus-ring bg-brand-700 hover:bg-brand-900 h-10 rounded-sm text-sm font-medium text-white"
        >
          应用筛选
        </button>
        {hasActiveFilters && (
          <Link
            href="/listings"
            className="focus-ring text-ink-muted text-center text-sm underline"
          >
            清除全部筛选
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <PageContainer className="flex flex-col gap-6 py-10">
      <div>
        <h1 className="text-ink font-serif text-2xl font-semibold">找房源</h1>
        <p className="text-ink-muted mt-1 text-sm">共 {sorted.length} 套房源</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <form action="/listings" method="get">
            {filterFields}
          </form>
        </aside>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <form action="/listings" method="get">
              {Object.entries(params).map(([key, value]) => {
                if (key === "sort" || key === "view") return null;
                const v = firstValue(value);
                return v ? <input key={key} type="hidden" name={key} value={v} /> : null;
              })}
              <input type="hidden" name="view" value={view} />
              <label htmlFor="sort" className="sr-only">
                排序
              </label>
              <select
                id="sort"
                name="sort"
                defaultValue={sort}
                className="focus-ring border-line-strong bg-surface text-ink h-9 rounded-sm border px-2 text-sm"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </form>

            <div className="flex items-center gap-2">
              <Link
                href={buildQueryString(params, { view: "grid" })}
                className={`focus-ring rounded-xs border px-3 py-1.5 text-xs ${view === "grid" ? "border-brand-700 text-brand-700" : "border-line text-ink-muted"}`}
              >
                网格
              </Link>
              <Link
                href={buildQueryString(params, { view: "list" })}
                className={`focus-ring rounded-xs border px-3 py-1.5 text-xs ${view === "list" ? "border-brand-700 text-brand-700" : "border-line text-ink-muted"}`}
              >
                列表
              </Link>
            </div>
          </div>

          <MobileFilterDrawer resultCount={sorted.length}>
            <form action="/listings" method="get">
              {filterFields}
            </form>
          </MobileFilterDrawer>

          {sorted.length === 0 ? (
            <EmptyState
              title="没有找到符合条件的房源"
              description="试试调整筛选条件，或清除全部筛选重新浏览。"
              action={
                <Link href="/listings" className="focus-ring text-brand-700 text-sm underline">
                  清除全部筛选
                </Link>
              }
            />
          ) : view === "grid" ? (
            <Grid columns="4">
              {sorted.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  cityName={cityNameById.get(listing.cityId)}
                />
              ))}
            </Grid>
          ) : (
            <div className="flex flex-col gap-3">
              {sorted.map((listing) => (
                <ListingListRow
                  key={listing.id}
                  listing={listing}
                  cityName={cityNameById.get(listing.cityId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
