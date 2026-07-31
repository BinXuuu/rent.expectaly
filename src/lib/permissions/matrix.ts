import type { Role } from "@/types";

/**
 * 权限资源。覆盖用户端与平台后台涉及的主要数据资源。
 * 区别于「意购」项目：本项目无商家/商品/订单/支付相关资源。
 */
export type PermissionResource =
  | "listing"
  | "comment"
  | "favorite"
  | "contact_reveal"
  | "report"
  | "city"
  | "user"
  | "role"
  | "system_setting"
  | "audit_log";

export type PermissionAction =
  | "view" // 查看所有
  | "view_own" // 仅查看归属于自己的数据
  | "create"
  | "update_own"
  | "delete_own"
  | "moderate" // 审核/下架/隐藏他人内容
  | "manage"; // 完整管理权限（含增删改查）

export type PermissionKey = `${PermissionResource}:${PermissionAction}`;

const PUBLIC_READ: PermissionKey[] = ["listing:view", "city:view"];

/** 登录用户共有的基础权限（发帖、评论、收藏、获取联系方式、举报自己发起的动作） */
const AUTHENTICATED_BASE: PermissionKey[] = [
  "listing:create",
  "listing:view_own",
  "listing:update_own",
  "listing:delete_own",
  "comment:create",
  "comment:view_own",
  "comment:delete_own",
  "favorite:create",
  "favorite:view_own",
  "favorite:delete_own",
  "contact_reveal:create",
  "report:create",
];

/** 内容审核员：处理举报、下架违规房源、隐藏违规评论 */
const CONTENT_REVIEWER_OPS: PermissionKey[] = [
  "report:view",
  "report:moderate",
  "listing:moderate",
  "comment:moderate",
];

/** 管理员独有：用户管理、城市管理、系统设置、角色权限查看、审计日志 */
const ADMIN_ONLY_OPS: PermissionKey[] = [
  "listing:manage",
  "comment:manage",
  "report:manage",
  "user:manage",
  "city:manage",
  "role:manage",
  "system_setting:manage",
  "audit_log:view",
];

/** 角色 -> 权限集合。4 种角色权限累加，admin 拥有全部权限，无需额外的超级角色绕过逻辑。 */
export const ROLE_PERMISSIONS: Record<Role, PermissionKey[]> = {
  guest: [...PUBLIC_READ],
  user: [...PUBLIC_READ, ...AUTHENTICATED_BASE],
  content_reviewer: [...PUBLIC_READ, ...AUTHENTICATED_BASE, ...CONTENT_REVIEWER_OPS],
  admin: [...PUBLIC_READ, ...AUTHENTICATED_BASE, ...CONTENT_REVIEWER_OPS, ...ADMIN_ONLY_OPS],
};
