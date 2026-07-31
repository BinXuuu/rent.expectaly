import type { BaseEntity, ID } from "./common";

export type SystemSettingValueType = "boolean" | "number" | "string" | "json";

/** 对应数据库实体 system_settings：后台可配置的键值项（有效期时长列表、限流阈值、风险关键词等） */
export interface SystemSetting extends BaseEntity {
  key: string;
  value: string; // 统一存字符串，读取时按 valueType 解析
  valueType: SystemSettingValueType;
  description: string | null;
  updatedBy: ID | null;
}
