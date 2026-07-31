import type { Metadata } from "next";
import type { AccountStatus } from "@/types";
import { ROLE_LABELS } from "@/types";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { getCurrentProfile } from "@/lib/auth/session";
import { can } from "@/lib/permissions";
import { profileRepository } from "@/lib/repositories";

export const metadata: Metadata = { title: "用户管理" };

const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  active: "正常",
  suspended: "已暂停",
  banned: "已封禁",
};

const ACCOUNT_STATUS_TONES: Record<AccountStatus, BadgeTone> = {
  active: "success",
  suspended: "warning",
  banned: "danger",
};

export default async function AdminUsersPage() {
  const profile = await getCurrentProfile();
  if (!profile || !can(profile.roles, "user:manage")) {
    return (
      <div>
        <h1 className="text-ink font-serif text-2xl font-semibold">无权访问</h1>
        <p className="text-ink-muted mt-2 text-sm">该页面仅管理员可访问。</p>
      </div>
    );
  }

  const profilesResult = await profileRepository.findAll();
  const profiles = profilesResult.ok
    ? [...profilesResult.data].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-ink font-serif text-2xl font-semibold">用户管理</h1>
        <p className="text-ink-muted mt-1 text-sm">共 {profiles.length} 个账号。</p>
      </div>

      {profiles.length === 0 ? (
        <EmptyState title="暂无用户数据" description="演示数据为空。" />
      ) : (
        <div className="border-line overflow-x-auto rounded-xs border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted text-ink-muted text-xs">
              <tr>
                <th className="px-4 py-3 font-medium">用户</th>
                <th className="px-4 py-3 font-medium">联系方式</th>
                <th className="px-4 py-3 font-medium">角色</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium">最近登录</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-line border-t">
                  <td className="text-ink px-4 py-3 font-medium">{p.displayName}</td>
                  <td className="text-ink-muted px-4 py-3">{p.email ?? p.phone ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.roles.map((role) => (
                        <Badge key={role} tone="neutral">
                          {ROLE_LABELS[role]}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={ACCOUNT_STATUS_TONES[p.status]}>
                      {ACCOUNT_STATUS_LABELS[p.status]}
                    </Badge>
                  </td>
                  <td className="text-ink-faint px-4 py-3 text-xs">
                    {p.lastLoginAt ? new Date(p.lastLoginAt).toLocaleString("zh-CN") : "从未登录"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
