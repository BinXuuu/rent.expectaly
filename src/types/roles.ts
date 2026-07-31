/**
 * 平台角色定义（简化四角色体系，区别于「意购」项目的 11 种角色，
 * 本项目不存在商家入驻/商家后台，因此无需商家相关角色）。
 * 权限矩阵实现见 lib/permissions/matrix.ts。详见 docs/ROLES_AND_PERMISSIONS.md。
 */
import type { BaseEntity, ID } from "./common";

export type Role =
  | "guest" // 游客
  | "user" // 普通用户
  | "content_reviewer" // 内容审核员
  | "admin"; // 管理员

export const ALL_ROLES: readonly Role[] = ["guest", "user", "content_reviewer", "admin"];

export const ROLE_LABELS: Record<Role, string> = {
  guest: "游客",
  user: "普通用户",
  content_reviewer: "内容审核员",
  admin: "管理员",
};

/**
 * 对应数据库实体 user_roles：一个账号（profile）可以同时拥有多个角色，
 * 例如「内容审核员 + 普通用户」。
 */
export interface UserRoleAssignment extends BaseEntity {
  userId: ID;
  role: Role;
  grantedAt: string;
  grantedBy: ID | null;
}
