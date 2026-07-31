import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingForm } from "@/components/listing/ListingForm";
import { getCurrentProfile } from "@/lib/auth/session";
import { cityRepository, listingRepository } from "@/lib/repositories";

export const metadata: Metadata = { title: "编辑房源", robots: { index: false, follow: false } };

interface EditListingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const [listingResult, citiesRes] = await Promise.all([
    listingRepository.findById(id),
    cityRepository.findAll(),
  ]);

  // 服务端校验房源 publisherId 归属，非本人房源统一返回 404，不泄露房源是否存在
  if (!listingResult.ok || listingResult.data.publisherId !== profile.id) {
    notFound();
  }

  const listing = listingResult.data;
  const cityOptions = (citiesRes.ok ? citiesRes.data : [])
    .filter((c) => c.isVisible)
    .map((c) => ({ value: c.id, label: c.name["zh-CN"] }));

  return (
    <div className="max-w-3xl">
      <div>
        <h1 className="text-ink font-serif text-2xl font-semibold">编辑房源</h1>
        <p className="text-ink-muted mt-1 text-sm">
          修改后的房源信息将重新进入待审核流程（如命中风险关键词）。
        </p>
      </div>
      <div className="mt-8">
        <ListingForm
          mode="edit"
          cityOptions={cityOptions}
          defaultValues={{
            purpose: listing.purpose,
            title: listing.title,
            description: listing.description,
            cityId: listing.cityId,
            address: listing.address,
            roomType: listing.roomType,
            areaSqm: listing.areaSqm,
            floor: listing.floor ?? undefined,
            renovationCondition: listing.renovationCondition,
            priceAmount: listing.price.amount,
            depositTerms: listing.depositTerms ?? undefined,
            requiresAgencyFee: listing.requiresAgencyFee,
            hasContract: listing.hasContract,
            minLeaseTermMonths: listing.minLeaseTermMonths,
            availableFrom: listing.availableFrom,
            petsAllowed: listing.petsAllowed,
            furnished: listing.furnished,
            moveInReady: listing.moveInReady,
            transitNote: listing.transitNote ?? undefined,
            validityDays: listing.validityDays,
          }}
        />
      </div>
    </div>
  );
}
