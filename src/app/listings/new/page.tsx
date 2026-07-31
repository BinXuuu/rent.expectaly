import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { ListingForm } from "@/components/listing/ListingForm";
import { getCurrentProfile } from "@/lib/auth/session";
import { cityRepository } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "发布房源",
  robots: { index: false, follow: false },
};

export default async function NewListingPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/auth/login?redirect=/listings/new");
  }

  const citiesRes = await cityRepository.findAll();
  const cityOptions = (citiesRes.ok ? citiesRes.data : [])
    .filter((c) => c.isVisible)
    .map((c) => ({ value: c.id, label: c.name["zh-CN"] }));

  return (
    <PageContainer className="max-w-3xl py-10">
      <div>
        <h1 className="text-ink font-serif text-2xl font-semibold">发布房源</h1>
        <p className="text-ink-muted mt-1 text-sm">
          发布免费，请如实填写房源信息。提交后如命中风险关键词会先进入人工审核。
        </p>
      </div>
      <div className="mt-8">
        <ListingForm mode="create" cityOptions={cityOptions} />
      </div>
    </PageContainer>
  );
}
