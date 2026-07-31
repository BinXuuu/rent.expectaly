/**
 * 全局公共类型：所有实体类型的公共基础字段与常用值对象。
 * 这是唯一类型来源之一，禁止在业务类型文件中重复定义这些结构。
 */

/** 数据库主键统一使用 UUID 字符串 */
export type ID = string;

/** ISO 8601 时间字符串 */
export type ISODateString = string;

/** 平台支持的语言 */
export type Locale = "zh-CN" | "it-IT" | "en-US";

export const SUPPORTED_LOCALES: readonly Locale[] = ["zh-CN", "it-IT", "en-US"];

export const DEFAULT_LOCALE: Locale = "zh-CN";

/** 多语言文本字段：第一期仅保证 zh-CN 必填，其余语言可选 */
export type LocalizedText = { "zh-CN": string } & Partial<Record<Locale, string>>;

/** 平台支持的货币（本项目租金以欧元为主，人民币仅作参考换算） */
export type Currency = "EUR" | "CNY";

/** 金额值对象，避免用裸 number 表达金额 */
export interface Money {
  amount: number;
  currency: Currency;
}

/** 创建/更新时间戳，所有实体必须包含 */
export interface Timestamps {
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** 软删除策略：deletedAt 为 null 表示未删除 */
export interface SoftDelete {
  deletedAt: ISODateString | null;
}

/** 创建者/修改者审计字段 */
export interface AuditFields {
  createdBy: ID | null;
  updatedBy: ID | null;
}

/** 所有数据库实体的公共基础形状 */
export interface BaseEntity extends Timestamps, SoftDelete, AuditFields {
  id: ID;
}

export type SortOrder = "asc" | "desc";

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
