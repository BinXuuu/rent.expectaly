import type { BaseEntity, ID } from "./common";
import type { Role } from "./roles";

export type AuditMetadataValue = string | number | boolean | null;

/** 对应数据库实体 audit_logs：平台后台的敏感操作审计轨迹 */
export interface AuditLog extends BaseEntity {
  actorId: ID | null;
  actorRole: Role | null;
  action: string; // 例如 "listing.remove" / "comment.hide" / "role.grant"
  targetType: string; // 例如 "listing" / "comment" / "user"
  targetId: ID | null;
  metadata: Record<string, AuditMetadataValue>;
  occurredAt: string;
}
