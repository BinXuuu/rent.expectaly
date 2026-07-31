import type { ContactRevealEvent, Result } from "@/types";
import { ok } from "@/types";
import { mockContactRevealEvents } from "@/data/mock";

/** 用于限流判断，第一期无软删除概念 */
export const contactRevealEventRepository = {
  async findByUser(userId: string): Promise<Result<ContactRevealEvent[]>> {
    return ok(mockContactRevealEvents.filter((e) => e.userId === userId));
  },

  async findByUserSince(userId: string, sinceIso: string): Promise<Result<ContactRevealEvent[]>> {
    return ok(
      mockContactRevealEvents.filter((e) => e.userId === userId && e.occurredAt >= sinceIso),
    );
  },
};
