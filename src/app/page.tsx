import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/shared/PageContainer";
import { Grid } from "@/components/shared/Grid";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ListingCard } from "@/components/listing/ListingCard";
import { CityCard } from "@/components/city/CityCard";
import { buttonClasses } from "@/components/ui/Button";
import { cityRepository, listingRepository } from "@/lib/repositories";
import { filterPubliclyVisibleListings } from "@/lib/services/listing-lifecycle-service";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const [listingsRes, citiesRes] = await Promise.all([
    listingRepository.findAll(),
    cityRepository.findAll(),
  ]);

  const listings = filterPubliclyVisibleListings(listingsRes.ok ? listingsRes.data : []);
  const latestListings = [...listings]
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, 4);
  const noAgencyFeeListings = listings.filter((l) => !l.requiresAgencyFee).slice(0, 4);
  const saleListings = listings
    .filter((l) => l.purpose === "sale")
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, 4);
  const allCities = citiesRes.ok ? citiesRes.data : [];
  const cityNameById = new Map(allCities.map((c) => [c.id, c.name["zh-CN"]]));
  const cities = allCities.slice(0, 6);

  return (
    <>
      <section className="border-line bg-surface border-b">
        <PageContainer className="flex flex-col gap-6 py-16 sm:py-24">
          <p className="text-brand-700 text-xs tracking-[0.2em] uppercase">Expectaly Rent</p>
          <h1 className="text-ink max-w-2xl font-serif text-4xl font-semibold sm:text-5xl">
            意大利个人房源租赁与买卖信息平台
          </h1>
          <p className="text-ink-muted max-w-xl text-base leading-7">
            个人房东/二房东/业主自主发帖展示出租或出售房源，租客与购房者浏览、收藏、评论。
            纯挂资源信息展示，不做平台内交易与撮合交付。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/listings" className={buttonClasses("primary", "lg")}>
              浏览房源
            </Link>
            <Link href="/listings/new" className={buttonClasses("secondary", "lg")}>
              发布房源
            </Link>
          </div>
        </PageContainer>
      </section>

      <div className="flex flex-col gap-16 py-16 sm:gap-20 sm:py-20">
        <PageContainer className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="最新房源"
            title="最近发布"
            description="按发布时间排序的最新房源信息。"
            href="/listings"
          />
          <Grid columns="4">
            {latestListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                cityName={cityNameById.get(listing.cityId)}
              />
            ))}
          </Grid>
        </PageContainer>

        {noAgencyFeeListings.length > 0 && (
          <PageContainer className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="省心之选"
              title="免中介费房源"
              description="无需支付中介费用的房源，直接与房东沟通。"
              href="/listings?agency_fee=no"
            />
            <Grid columns="4">
              {noAgencyFeeListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  cityName={cityNameById.get(listing.cityId)}
                />
              ))}
            </Grid>
          </PageContainer>
        )}

        {saleListings.length > 0 && (
          <PageContainer className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="购房精选"
              title="出售房源"
              description="个人业主自主发帖出售的房源，价格为总价（欧元）。"
              href="/listings?purpose=sale"
            />
            <Grid columns="4">
              {saleListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  cityName={cityNameById.get(listing.cityId)}
                />
              ))}
            </Grid>
          </PageContainer>
        )}

        <PageContainer className="flex flex-col gap-6">
          <SectionHeading eyebrow="按城市浏览" title="热门城市" href="/cities" />
          <Grid columns="4">
            {cities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </Grid>
        </PageContainer>

        <PageContainer>
          <div className="border-line bg-surface flex flex-col items-center gap-4 rounded-md border px-6 py-12 text-center">
            <h2 className="text-ink font-serif text-2xl font-semibold">如何使用本平台</h2>
            <p className="text-ink-muted max-w-2xl text-sm">
              登录后即可发布房源、评论、收藏与获取联系方式。平台仅提供信息展示与内容审核，
              不参与看房、签约、付款等线下环节，也不进行任何形式的平台内交易。
            </p>
            <Link href="/about" className={buttonClasses("secondary", "md")}>
              了解平台说明
            </Link>
          </div>
        </PageContainer>
      </div>
    </>
  );
}
