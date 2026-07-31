import type { BaseEntity, ID, Locale } from "./common";
import type { Role } from "./roles";

export type AccountStatus = "active" | "suspended" | "banned";

export type AuthProvider = "email" | "phone" | "main_site_sso";

/**
 * 对应数据库实体 profiles。
 * 真实认证信息（密码哈希等）由 Supabase Auth 管理，此处只存业务侧资料。
 * 区别于「意购」项目：本项目无商家身份、无地址簿（房源交易发生在线下，
 * 平台不承担收货地址相关职责，见 docs/NO_TRANSACTION_POLICY.md）。
 */
export interface Profile extends BaseEntity {
  authUserId: ID; // 对应 Supabase Auth 用户 ID
  displayName: string;
  avatarUrl: string | null;
  email: string | null;
  phone: string | null;
  primaryProvider: AuthProvider;
  /** 便于跨子域与主站账号互通，参见 docs/MAIN_SITE_INTEGRATION.md */
  mainSiteUserId: ID | null;
  locale: Locale;
  roles: Role[];
  status: AccountStatus;
  lastLoginAt: string | null;
}
