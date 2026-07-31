import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageContainer } from "@/components/shared/PageContainer";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { Grid } from "@/components/shared/Grid";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListingCard } from "@/components/listing/ListingCard";
import { cityRepository, listingRepository } from "@/lib/repositories";
import { filterPubliclyVisibleListings } from "@/lib/services/listing-lifecycle-service";

interface CityDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function loadCity(slug: string) {
  const result = await cityRepository.findBySlug(slug);
  if (!result.ok || !result.data || !result.data.isVisible) {
    return null;
  }
  return result.data;
}

export async function generateMetadata({ params }: CityDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = await loadCity(slug);
  if (!city) {
    return { title: "城市不存在" };
  }
  return {
    title: city.name["zh-CN"],
    description: city.introduction?.["zh-CN"] ?? city.name["zh-CN"],
    alternates: { canonical: `/cities/${slug}` },
  };
}

export default async function CityDetailPage({ params }: CityDetailPageProps) {
  const { slug } = await params;
  const city = await loadCity(slug);

  if (!city) {
    notFound();
  }

  const listingsRes = await listingRepository.findByCity(city.id);
  const listings = filterPubliclyVisibleListings(listingsRes.ok ? listingsRes.data : []);

  return (
    <PageContainer className="flex flex-col gap-8 py-10">
      <nav aria-label="面包屑" className="text-ink-muted flex flex-wrap items-center gap-1 text-xs">
        <Link href="/" className="hover:text-ink">
          首页
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/cities" className="hover:text-ink">
          城市
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">{city.name["zh-CN"]}</span>
      </nav>

      <div className="border-line overflow-hidden rounded-md border">
        <PlaceholderImage label={city.name["zh-CN"]} aspect="landscape" />
      </div>

      <div>
        <h1 className="text-ink font-serif text-2xl font-semibold sm:text-3xl">
          {city.name["zh-CN"]}
        </h1>
        {city.introduction && (
          <p className="text-ink-muted mt-2 max-w-2xl text-sm">{city.introduction["zh-CN"]}</p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-ink font-serif text-xl font-semibold">
          {city.name["zh-CN"]}的房源（{listings.length}）
        </h2>
        {listings.length === 0 ? (
          <EmptyState title="该城市暂无房源" description="欢迎稍后再来看看，或浏览其他城市。" />
        ) : (
          <Grid columns="4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} cityName={city.name["zh-CN"]} />
            ))}
          </Grid>
        )}
      </div>
    </PageContainer>
  );
}
