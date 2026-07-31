import type { Comment, Result } from "@/types";
import { ok } from "@/types";
import { mockComments } from "@/data/mock";
import { createInMemoryRepository } from "./base";

export const commentRepository = {
  ...createInMemoryRepository<Comment>(() => mockComments),

  /** 房源详情页公开展示的评论：仅返回 visible 状态，隐藏/已删除评论对普通用户不可见 */
  async findVisibleByListing(listingId: string): Promise<Result<Comment[]>> {
    return ok(
      mockComments.filter(
        (c) => c.listingId === listingId && c.status === "visible" && !c.deletedAt,
      ),
    );
  },

  async findByAuthor(authorId: string): Promise<Result<Comment[]>> {
    return ok(mockComments.filter((c) => c.authorId === authorId && !c.deletedAt));
  },
};
