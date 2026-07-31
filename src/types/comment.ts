import type { BaseEntity, ID } from "./common";

export type CommentStatus = "visible" | "hidden" | "removed";

/** 对应数据库实体 comments：房源下的公开评论，登录用户可发表，替代 1 对 1 私信（见 docs/PROJECT_REQUIREMENTS.md 第 7/8 节） */
export interface Comment extends BaseEntity {
  listingId: ID;
  authorId: ID;
  body: string;
  status: CommentStatus;
  hiddenBy: ID | null;
  hiddenReason: string | null;
}
