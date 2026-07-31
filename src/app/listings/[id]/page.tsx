import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LISTING_PURPOSE_LABELS, RENOVATION_CONDITION_LABELS, ROOM_TYPE_LABELS } from "@/types";
import { PageContainer } from "@/components/shared/PageContainer";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { ReportDialog } from "@/components/shared/ReportDialog";
import { ListingPrice } from "@/components/listing/ListingPrice";
import { FavoriteButton } from "@/components/listing/FavoriteButton";
import { ContactRevealButton } from "@/components/listing/ContactRevealButton";
import { CommentsSection } from "@/components/listing/CommentsSection";
import { Badge } from "@/components/ui/Badge";
import { getCurrentProfile } from "@/lib/auth/session";
import {
  cityRepository,
  commentRepository,
  favoriteRepository,
  listingImageRepository,
  listingRepository,
  profileRepository,
} from "@/lib/repositories";
import { daysUntilExpiry, isPubliclyVisible } from "@/lib/services/listing-lifecycle-service";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

async function loadListing(id: string) {
  const result = await listingRepository.findById(id);
  if (!result.ok || !isPubliclyVisible(result.data)) {
    return null;
  }
  return result.data;
}

export async function generateMetadata({ params }: ListingDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await loadListing(id);
  if (!listing) {
    return { title: "房源不存在" };
  }
  return {
    title: listing.title,
    description: listing.description.slice(0, 100),
    alternates: { canonical: `/listings/${id}` },
  };
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params;
  const listing = await loadListing(id);

  if (!listing) {
    notFound();
  }

  const [cityResult, imagesRes, commentsRes, currentProfile] = await Promise.all([
    cityRepository.findById(listing.cityId),
    listingImageRepository.findByListing(listing.id),
    commentRepository.findVisibleByListing(listing.id),
    getCurrentProfile(),
  ]);

  const city = cityResult.ok ? cityResult.data : null;
  const images = imagesRes.ok ? imagesRes.data : [];
  const comments = commentsRes.ok ? commentsRes.data : [];

  const commentAuthors = await Promise.all(
    comments.map(async (comment) => {
      const authorResult = await profileRepository.findById(comment.authorId);
      return authorResult.ok ? authorResult.data.displayName : "已注销用户";
    }),
  );

  let initialFavorited = false;
  if (currentProfile) {
    const favoriteResult = await favoriteRepository.exists(currentProfile.id, listing.id);
    initialFavorited = favoriteResult.ok && favoriteResult.data;
  }

  const remainingDays = daysUntilExpiry(listing);

  return (
    <PageContainer className="flex flex-col gap-10 py-10">
      <nav aria-label="面包屑" className="text-ink-muted flex flex-wrap items-center gap-1 text-xs">
        <Link href="/" className="hover:text-ink">
          首页
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/listings" className="hover:text-ink">
          找房源
        </Link>
        {city && (
          <>
            <span aria-hidden="true">/</span>
            <Link href={`/cities/${city.slug}`} className="hover:text-ink">
              {city.name["zh-CN"]}
            </Link>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span className="text-ink">{listing.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="border-line overflow-hidden rounded-xs border">
            <PlaceholderImage label={listing.title} aspect="landscape" />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1).map((image) => (
                <div key={image.id} className="border-line overflow-hidden rounded-xs border">
                  <PlaceholderImage label={listing.title} aspect="square" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2">
              {city && (
                <Link
                  href={`/cities/${city.slug}`}
                  className="text-brand-700 text-sm hover:underline"
                >
                  {city.name["zh-CN"]}
                </Link>
              )}
              <Badge tone={listing.purpose === "sale" ? "accent" : "neutral"}>
                {LISTING_PURPOSE_LABELS[listing.purpose]}
              </Badge>
            </div>
            <h1 className="text-ink mt-1 font-serif text-2xl font-semibold sm:text-3xl">
              {listing.title}
            </h1>
            <p className="text-ink-muted mt-2 text-sm">{listing.address}</p>
          </div>

          <ListingPrice listing={listing} />

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-ink-muted">房型</dt>
            <dd className="text-ink">{ROOM_TYPE_LABELS[listing.roomType]}</dd>
            <dt className="text-ink-muted">面积</dt>
            <dd className="text-ink">{listing.areaSqm}㎡</dd>
            {listing.floor && (
              <>
                <dt className="text-ink-muted">楼层</dt>
                <dd className="text-ink">{listing.floor}</dd>
              </>
            )}
            <dt className="text-ink-muted">装修状况</dt>
            <dd className="text-ink">{RENOVATION_CONDITION_LABELS[listing.renovationCondition]}</dd>
            {listing.depositTerms && (
              <>
                <dt className="text-ink-muted">押金条款</dt>
                <dd className="text-ink">{listing.depositTerms}</dd>
              </>
            )}
            {listing.minLeaseTermMonths !== null && (
              <>
                <dt className="text-ink-muted">最短租期</dt>
                <dd className="text-ink">{listing.minLeaseTermMonths} 个月</dd>
              </>
            )}
            <dt className="text-ink-muted">
              {listing.purpose === "sale" ? "可交房时间" : "可入住时间"}
            </dt>
            <dd className="text-ink">{listing.availableFrom}</dd>
            {listing.transitNote && (
              <>
                <dt className="text-ink-muted">交通</dt>
                <dd className="text-ink">{listing.transitNote}</dd>
              </>
            )}
          </dl>

          <div className="flex flex-wrap gap-1.5">
            {listing.requiresAgencyFee ? (
              <Badge tone="warning">需中介费</Badge>
            ) : (
              <Badge tone="success">免中介费</Badge>
            )}
            {listing.hasContract ? (
              <Badge tone="accent">有合同</Badge>
            ) : (
              <Badge tone="muted">无合同</Badge>
            )}
            {listing.purpose === "rent" && listing.petsAllowed && (
              <Badge tone="neutral">可养宠物</Badge>
            )}
            {listing.furnished && <Badge tone="neutral">配备家具</Badge>}
            {listing.moveInReady && <Badge tone="neutral">拎包入住</Badge>}
          </div>

          {listing.agencyFeeNote && (
            <p className="text-ink-muted text-xs">{listing.agencyFeeNote}</p>
          )}
          {listing.contractNote && <p className="text-ink-muted text-xs">{listing.contractNote}</p>}

          {remainingDays !== null && (
            <p className="text-ink-faint text-xs">
              该房源信息将在 {remainingDays} 天后自动下架（有效期由发帖人设置）。
            </p>
          )}

          <div className="flex flex-wrap items-start gap-3">
            <ContactRevealButton listingId={listing.id} isLoggedIn={Boolean(currentProfile)} />
            <FavoriteButton
              isLoggedIn={Boolean(currentProfile)}
              initialFavorited={initialFavorited}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="text-ink font-serif text-lg font-semibold">房源描述</h2>
            <p className="text-ink-muted mt-2 text-sm leading-7">{listing.description}</p>
          </section>

          <section>
            <h2 className="text-ink font-serif text-lg font-semibold">评论</h2>
            <CommentsSection
              initialComments={comments.map((comment, index) => ({
                id: comment.id,
                authorName: commentAuthors[index],
                body: comment.body,
              }))}
              currentDisplayName={currentProfile?.displayName ?? null}
            />
          </section>

          <section className="border-line bg-surface-muted flex flex-col gap-2 rounded-xs border p-5">
            <h2 className="text-ink text-sm font-semibold">免责声明</h2>
            <p className="text-ink-muted text-xs leading-6">
              本房源信息由用户自主发布，平台不核实房源真实性、房东身份及合同条款，不参与看房、签约、付款等
              线下环节。请租客自行核实相关信息，如发现虚假或违规内容请及时举报。详见
              <Link href="/legal/disclaimer" className="text-brand-700 underline">
                免责声明
              </Link>
              。
            </p>
            <ReportDialog reportedType="listing" reportedLabel="该房源" />
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
