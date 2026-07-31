import type { Metadata } from "next";
import { PageContainer } from "@/components/shared/PageContainer";
import { Grid } from "@/components/shared/Grid";
import { CityCard } from "@/components/city/CityCard";
import { cityRepository } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "城市",
  description: "按城市浏览意大利各地的个人房源信息。",
  alternates: { canonical: "/cities" },
};

export default async function CitiesPage() {
  const citiesRes = await cityRepository.findAll();
  const cities = (citiesRes.ok ? citiesRes.data : []).filter((c) => c.isVisible);

  return (
    <PageContainer className="flex flex-col gap-6 py-10">
      <div>
        <h1 className="text-ink font-serif text-2xl font-semibold">城市</h1>
        <p className="text-ink-muted mt-1 text-sm">按城市浏览意大利各地的房源。</p>
      </div>
      <Grid columns="4">
        {cities.map((city) => (
          <CityCard key={city.id} city={city} />
        ))}
      </Grid>
    </PageContainer>
  );
}
