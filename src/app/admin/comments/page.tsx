import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ReviewDialog } from "@/components/admin/ReviewDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { commentRepository, listingRepository, profileRepository } from "@/lib/repositories";

export const metadata: Metadata = { title: "评论管理" };

export default async function AdminCommentsPage() {
  const [commentsRes, profilesRes] = await Promise.all([
    commentRepository.findAll(),
    profileRepository.findAll(),
  ]);

  const comments = (commentsRes.ok ? commentsRes.data : []).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  const authorNameById = new Map(
    (profilesRes.ok ? profilesRes.data : []).map((p) => [p.id, p.displayName]),
  );

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
        <h1 className="text-ink font-serif text-2xl font-semibold">评论管理</h1>
        <p className="text-ink-muted mt-1 text-sm">全平台共 {comments.length} 条评论。</p>
      </div>

      {comments.length === 0 ? (
        <EmptyState title="暂无评论" description="演示数据为空。" />
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border-line flex flex-wrap items-start justify-between gap-3 rounded-xs border p-4"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-ink text-sm font-medium">
                    {authorNameById.get(comment.authorId) ?? "已注销用户"}
                  </span>
                  <Link
                    href={`/listings/${comment.listingId}`}
                    className="text-brand-700 text-xs hover:underline"
                  >
                    {listingTitleById.get(comment.listingId) ?? "房源"}
                  </Link>
                  {comment.status === "hidden" && <Badge tone="warning">已隐藏</Badge>}
                  {comment.status === "removed" && <Badge tone="danger">已删除</Badge>}
                </div>
                <p className="text-ink-muted mt-2 text-sm">{comment.body}</p>
                {comment.hiddenReason && (
                  <p className="text-ink-faint mt-1 text-xs">隐藏原因：{comment.hiddenReason}</p>
                )}
              </div>
              {comment.status === "visible" && (
                <ReviewDialog
                  title="评论管理"
                  subject={comment.body.slice(0, 30)}
                  triggerLabel="隐藏"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
