import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { getCurrentProfile } from "@/lib/auth/session";
import { commentRepository, listingRepository } from "@/lib/repositories";

export const metadata: Metadata = { title: "我的评论", robots: { index: false, follow: false } };

export default async function AccountCommentsPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const commentsRes = await commentRepository.findByAuthor(profile.id);
  const comments = commentsRes.ok ? commentsRes.data : [];

  const listingTitleById = new Map<string, string>();
  await Promise.all(
    comments.map(async (comment) => {
      if (listingTitleById.has(comment.listingId)) return;
      const result = await listingRepository.findById(comment.listingId);
      if (result.ok) {
        listingTitleById.set(comment.listingId, result.data.title);
      }
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-ink font-serif text-2xl font-semibold">我的评论</h1>
        <p className="text-ink-muted mt-1 text-sm">你在各个房源下发表的评论记录。</p>
      </div>

      {comments.length === 0 ? (
        <EmptyState title="暂无评论" description="在房源详情页发表评论后，会展示在这里。" />
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <div key={comment.id} className="border-line rounded-xs border p-4">
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/listings/${comment.listingId}`}
                  className="text-brand-700 text-sm font-medium hover:underline"
                >
                  {listingTitleById.get(comment.listingId) ?? "房源"}
                </Link>
                {comment.status === "hidden" && <Badge tone="warning">已隐藏</Badge>}
              </div>
              <p className="text-ink-muted mt-2 text-sm">{comment.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
