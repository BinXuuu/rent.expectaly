"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buttonClasses } from "@/components/ui/Button";

export interface FavoriteButtonProps {
  isLoggedIn: boolean;
  initialFavorited: boolean;
}

/**
 * 收藏切换按钮。第一期为界面交互演示：本地切换状态，不写入 favorites 表
 * （与项目全程「repositories 第一期只读」的原则一致）。未登录跳转登录页。
 */
export function FavoriteButton({ isLoggedIn, initialFavorited }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);

  if (!isLoggedIn) {
    return (
      <Link href="/auth/login" className={buttonClasses("secondary", "md")}>
        登录后收藏
      </Link>
    );
  }

  return (
    <Button variant={favorited ? "primary" : "secondary"} onClick={() => setFavorited((v) => !v)}>
      <Heart aria-hidden="true" className="h-4 w-4" fill={favorited ? "currentColor" : "none"} />
      {favorited ? "已收藏" : "收藏"}
    </Button>
  );
}
