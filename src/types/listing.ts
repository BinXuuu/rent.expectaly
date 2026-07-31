import type { BaseEntity, ID, LocalizedText, Money } from "./common";
import type { CityRef } from "./city";

/** 房源类别：出租 / 出售。两者共用同一套标签体系，价格与部分租赁专属字段按类别区分展示。 */
export type ListingPurpose = "rent" | "sale";

export const LISTING_PURPOSE_LABELS: Record<ListingPurpose, string> = {
  rent: "出租",
  sale: "出售",
};

/** 房型 */
export type RoomType = "entire_place" | "shared_room" | "private_room" | "bed_space";

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  entire_place: "整租",
  shared_room: "合租",
  private_room: "单间",
  bed_space: "床位",
};

/** 装修状况 */
export type RenovationCondition = "luxury" | "standard" | "basic";

export const RENOVATION_CONDITION_LABELS: Record<RenovationCondition, string> = {
  luxury: "精装",
  standard: "简装",
  basic: "毛坯",
};

/** 朝向 */
export type Orientation = "north" | "south" | "east" | "west" | "southeast" | "southwest";

/**
 * 房源生命周期状态。
 * draft：草稿（未提交）
 * pending_review：待审核（命中风险关键词等触发人工审核）
 * published：已发布（公开可见）
 * expired：已过期（到期自动下架，发帖人可重新发布延长）
 * removed：已下架（发帖人主动下架或审核员强制下架）
 */
export type ListingStatus = "draft" | "pending_review" | "published" | "expired" | "removed";

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  draft: "草稿",
  pending_review: "待审核",
  published: "已发布",
  expired: "已过期",
  removed: "已下架",
};

/** 发帖时可选的有效期时长（天），到期自动下架 */
export const LISTING_VALIDITY_OPTIONS_DAYS: readonly number[] = [7, 15, 30];

/**
 * 对应数据库实体 listings。
 * 明确不包含任何交易/支付/交付相关字段，详见 docs/NO_TRANSACTION_POLICY.md。
 */
export interface Listing extends BaseEntity {
  publisherId: ID; // 发帖人 profile id
  purpose: ListingPurpose; // 出租 / 出售
  title: string;
  description: string;
  cityId: CityRef;
  address: string; // 街道级详细地址，供大致定位使用
  roomType: RoomType; // 出售房源统一使用 entire_place（不存在“出售一张床位”的概念）
  areaSqm: number;
  floor: string | null; // 支持 "3" "地面层" 等自由文本
  orientation: Orientation | null;
  renovationCondition: RenovationCondition;

  price: Money; // 出租为月租、出售为总价，主货币欧元
  cnyReferencePrice: number | null; // 人民币参考价，注明「参考汇率换算，最终价格以发帖人确认结果为准」
  depositTerms: string | null; // 押金条款，仅出租房源使用，出售房源恒为 null

  requiresAgencyFee: boolean;
  agencyFeeNote: string | null;
  hasContract: boolean;
  contractNote: string | null;

  minLeaseTermMonths: number | null; // 最短租期（月），仅出租房源使用，出售房源恒为 null
  availableFrom: string; // ISO date，出租为可入住起始日期，出售为可交房起始日期
  petsAllowed: boolean; // 仅出租房源展示（是否允许宠物由业主自行决定购房后事项，出售房源不适用）
  furnished: boolean;
  moveInReady: boolean;
  transitNote: string | null; // 交通便利性说明文字

  validityDays: number; // 发帖时自选的有效期时长
  publishedAt: string | null;
  expiresAt: string | null; // publishedAt + validityDays 计算得出，服务层负责判断到期

  status: ListingStatus;
  requiresManualReview: boolean; // 命中风险关键词等触发人工审核
}

/** 对应数据库实体 listing_images：第一期使用占位图，不接入真实图床 */
export interface ListingImage extends BaseEntity {
  listingId: ID;
  url: string;
  sortOrder: number;
  altText: LocalizedText | null;
}
