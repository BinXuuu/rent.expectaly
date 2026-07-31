"use client";

import { useState } from "react";
import Link from "next/link";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { buttonClasses } from "@/components/ui/Button";
import type { ListingStatus } from "@/types";

export interface ListingRowActionsProps {
  listingId: string;
  status: ListingStatus;
}

/**
 * 我的房源行内操作：编辑（跳转真实编辑页）、下架/重新发布（第一期为界面交互演示，
 * 提交后仅本地确认，尚未接入 listings 表的真实状态写入）。
 */
export function ListingRowActions({ listingId, status }: ListingRowActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const isDelistAction = status === "published" || status === "pending_review";
  const actionLabel = isDelistAction ? "下架" : "重新发布";

  function handleClose() {
    setDialogOpen(false);
    setConfirmed(false);
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/account/listings/${listingId}/edit`}
        className={buttonClasses("secondary", "sm")}
      >
        编辑
      </Link>
      <Button variant="ghost" size="sm" onClick={() => setDialogOpen(true)}>
        {actionLabel}
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        title={isDelistAction ? "确认下架该房源？" : "确认重新发布该房源？"}
      >
        {confirmed ? (
          <div className="flex flex-col gap-4">
            <p className="text-ink text-sm">
              {isDelistAction
                ? "房源已下架，不再对外展示（演示交互，暂未接入后端持久化）。"
                : "房源已重新发布，有效期重新计算（演示交互，暂未接入后端持久化）。"}
            </p>
            <Button variant="secondary" onClick={handleClose} className="w-fit">
              关闭
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-ink-muted text-sm">
              {isDelistAction
                ? "下架后该房源将从公开列表中移除，你可以随时重新发布。"
                : "重新发布后需要重新选择有效期时长，到期时间将从当前时间重新计算。"}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={handleClose}>
                取消
              </Button>
              <Button variant="primary" onClick={() => setConfirmed(true)}>
                确认
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
