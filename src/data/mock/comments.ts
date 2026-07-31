/**
 * 演示数据：房源评论。公开可见，替代 1 对 1 私信（见 docs/PROJECT_REQUIREMENTS.md 第 7/8 节）。
 */
import type { Comment } from "@/types";

const base = {
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
};

export const mockComments: Comment[] = [
  {
    id: "comment-milano-1",
    listingId: "listing-milano-navigli-1br",
    authorId: "profile-user-wangqiang",
    body: "请问这个房源现在还有吗？方便告知具体入住时间吗？",
    status: "visible",
    hiddenBy: null,
    hiddenReason: null,
    createdAt: "2026-07-16T10:00:00+02:00",
    updatedAt: "2026-07-16T10:00:00+02:00",
    ...base,
  },
  {
    id: "comment-torino-1",
    listingId: "listing-torino-centro-private-room",
    authorId: "profile-user-linfei",
    body: "地理位置很好，请问可以短租看看情况吗？",
    status: "visible",
    hiddenBy: null,
    hiddenReason: null,
    createdAt: "2026-07-19T09:00:00+02:00",
    updatedAt: "2026-07-19T09:00:00+02:00",
    ...base,
  },
  {
    id: "comment-napoli-abusive",
    listingId: "listing-napoli-removed",
    authorId: "profile-user-linfei",
    body: "（已隐藏的违规评论示例，原内容含辱骂性语言）",
    status: "hidden",
    hiddenBy: "profile-content-reviewer",
    hiddenReason: "违反内容发布规范：辱骂性语言。",
    createdAt: "2026-06-16T12:00:00+02:00",
    updatedAt: "2026-06-20T15:05:00+02:00",
    ...base,
  },
];
