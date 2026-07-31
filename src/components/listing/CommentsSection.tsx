"use client";

import { useState } from "react";
import Link from "next/link";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";

export interface DisplayComment {
  id: string;
  authorName: string;
  body: string;
}

export interface CommentsSectionProps {
  initialComments: DisplayComment[];
  currentDisplayName: string | null;
}

/**
 * 评论区：公开评论列表 + 登录用户的评论表单。第一期为界面交互演示，
 * 提交后仅在当前浏览器会话内乐观展示新评论，不写入 comments 表
 * （与项目全程「repositories 第一期只读」的原则一致）。
 */
export function CommentsSection({ initialComments, currentDisplayName }: CommentsSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim() || !currentDisplayName) return;
    setComments((current) => [
      ...current,
      { id: `local-${Date.now()}`, authorName: currentDisplayName, body: draft.trim() },
    ]);
    setDraft("");
  }

  return (
    <div>
      {comments.length === 0 ? (
        <EmptyState title="暂无评论" description="登录后可发表评论。" className="mt-3 py-10" />
      ) : (
        <div className="mt-3 flex flex-col gap-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-line rounded-xs border p-4">
              <p className="text-ink text-sm font-medium">{comment.authorName}</p>
              <p className="text-ink-muted mt-1 text-sm">{comment.body}</p>
            </div>
          ))}
        </div>
      )}

      {currentDisplayName ? (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <Textarea
            label="发表评论"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="友善交流，理性提问"
            rows={3}
          />
          <Button type="submit" variant="primary" className="w-fit" disabled={!draft.trim()}>
            发表评论
          </Button>
        </form>
      ) : (
        <Link href="/auth/login" className="text-brand-700 mt-3 inline-block text-sm underline">
          登录后发表评论
        </Link>
      )}
    </div>
  );
}
