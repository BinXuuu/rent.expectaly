/**
 * 演示数据：平台后台敏感操作审计轨迹。
 */
import type { AuditLog } from "@/types";

const base = {
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
};

export const mockAuditLogs: AuditLog[] = [
  {
    id: "audit-log-remove-napoli-listing",
    actorId: "profile-content-reviewer",
    actorRole: "content_reviewer",
    action: "listing.moderate",
    targetType: "listing",
    targetId: "listing-napoli-removed",
    metadata: { reason: "already_rented", reportId: "report-napoli-false-info" },
    occurredAt: "2026-06-20T15:00:00+02:00",
    createdAt: "2026-06-20T15:00:00+02:00",
    updatedAt: "2026-06-20T15:00:00+02:00",
    ...base,
  },
  {
    id: "audit-log-hide-napoli-comment",
    actorId: "profile-content-reviewer",
    actorRole: "content_reviewer",
    action: "comment.moderate",
    targetType: "comment",
    targetId: "comment-napoli-abusive",
    metadata: { reason: "abusive_content", reportId: "report-napoli-comment-abusive" },
    occurredAt: "2026-06-20T15:05:00+02:00",
    createdAt: "2026-06-20T15:05:00+02:00",
    updatedAt: "2026-06-20T15:05:00+02:00",
    ...base,
  },
  {
    id: "audit-log-grant-reviewer-role",
    actorId: "profile-admin",
    actorRole: "admin",
    action: "role.grant",
    targetType: "user",
    targetId: "profile-content-reviewer",
    metadata: { role: "content_reviewer" },
    occurredAt: "2026-03-01T09:00:00+02:00",
    createdAt: "2026-03-01T09:00:00+02:00",
    updatedAt: "2026-03-01T09:00:00+02:00",
    ...base,
  },
];
