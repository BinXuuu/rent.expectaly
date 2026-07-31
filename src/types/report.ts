import type { BaseEntity, ID } from "./common";

export type ReportedEntityType = "listing" | "comment";

export type ReportCategory =
  | "false_information" // 虚假房源信息
  | "fraud_suspicion" // 欺诈嫌疑
  | "duplicate" // 重复发布
  | "already_rented" // 房源已出租但未下架
  | "abusive_content" // 辱骂/违规评论内容
  | "spam" // 广告/垃圾信息
  | "other";

export type ReportStatus =
  | "pending" // 待处理
  | "investigating" // 调查中
  | "resolved" // 已处理
  | "dismissed" // 已驳回
  | "removed"; // 已下架/已隐藏

/** 对应数据库实体 reports */
export interface Report extends BaseEntity {
  reportedType: ReportedEntityType;
  reportedId: ID;
  reporterId: ID;
  category: ReportCategory;
  description: string;
  status: ReportStatus;
  handledBy: ID | null;
  handledAt: string | null;
  resolutionNote: string | null;
}
