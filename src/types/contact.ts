import type { ID, ISODateString } from "./common";

/**
 * 对应数据库实体 contact_reveal_events：「获取联系方式」按钮的点击事件记录。
 * 用于限流（同一账号短时间内重复获取、批量获取不同房源的联系方式）与滥用排查，
 * 详见 docs/PROJECT_REQUIREMENTS.md 第 7 节、docs/COMPLIANCE.md。
 */
export interface ContactRevealEvent {
  id: ID;
  userId: ID;
  listingId: ID;
  occurredAt: ISODateString;
}
