import type { Metadata } from "next";
import { EmptyState } from "@/components/shared/EmptyState";
import { Grid } from "@/components/shared/Grid";
import { ListingCard } from "@/components/listing/ListingCard";
import { getCurrentProfile } from "@/lib/auth/session";
import { cityRepository, favoriteRepository, listingRepository } from "@/lib/repositories";

export const metadata: Metadata = { title: "我的收藏", robots: { index: false, follow: false } };

export default async function AccountFavoritesPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const [favoritesRes, citiesRes] = await Promise.all([
    favoriteRepository.findByUser(profile.id),
    cityRepository.findAll(),
  ]);

  const favorites = favoritesRes.ok ? favoritesRes.data : [];
  const cityNameById = new Map(
    (citiesRes.ok ? citiesRes.data : []).map((c) => [c.id, c.name["zh-CN"]]),
  );

  const listings = (
    await Promise.all(
      favorites.map(async (favorite) => {
        const result = await listingRepository.findById(favorite.listingId);
        return result.ok ? result.data : null;
      }),
    )
  ).filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-ink font-serif text-2xl font-semibold">我的收藏</h1>
        <p className="text-ink-muted mt-1 text-sm">收藏的房源会保留在这里，方便随时回顾。</p>
      </div>

      {listings.length === 0 ? (
        <EmptyState title="暂无收藏房源" description="在房源详情页点击收藏，加入你的收藏列表。" />
      ) : (
        <Grid columns="4">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              cityName={cityNameById.get(listing.cityId)}
            />
          ))}
        </Grid>
      )}
    </div>
  );
}
