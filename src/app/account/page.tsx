import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/session";
import { commentRepository, favoriteRepository, listingRepository } from "@/lib/repositories";

export default async function AccountOverviewPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const [listingsRes, favoritesRes, commentsRes] = await Promise.all([
    listingRepository.findByPublisher(profile.id),
    favoriteRepository.findByUser(profile.id),
    commentRepository.findByAuthor(profile.id),
  ]);

  const stats = [
    {
      label: "我的房源",
      value: listingsRes.ok ? listingsRes.data.length : 0,
      href: "/account/listings",
    },
    {
      label: "我的收藏",
      value: favoritesRes.ok ? favoritesRes.data.length : 0,
      href: "/account/favorites",
    },
    {
      label: "我的评论",
      value: commentsRes.ok ? commentsRes.data.length : 0,
      href: "/account/comments",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-ink font-serif text-2xl font-semibold">
          欢迎回来，{profile.displayName}
        </h1>
        <p className="text-ink-muted mt-1 text-sm">在这里管理你发布的房源、收藏与评论。</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="focus-ring border-line hover:border-brand-200 flex flex-col gap-1 rounded-xs border p-4"
          >
            <span className="text-ink font-serif text-2xl font-semibold">{stat.value}</span>
            <span className="text-ink-muted text-xs">{stat.label}</span>
          </Link>
        ))}
      </div>

      <div className="border-line bg-surface-muted text-ink-muted rounded-xs border p-5 text-sm">
        提醒：平台仅提供房源信息展示与内容审核，不参与看房、签约、付款等线下环节，也不进行任何形式的平台内交易。详见
        <Link href="/about" className="text-brand-700 underline">
          关于平台
        </Link>
        。
      </div>
    </div>
  );
}
