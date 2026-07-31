import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { getCurrentProfile } from "@/lib/auth/session";
import { can, ROLE_PERMISSIONS } from "@/lib/permissions";
import { ALL_ROLES, ROLE_LABELS } from "@/types";

export const metadata: Metadata = { title: "角色权限" };

const MANAGEABLE_ROLES = ALL_ROLES.filter((role) => role !== "guest");

export default async function AdminRolesPage() {
  const profile = await getCurrentProfile();

  if (!profile || !can(profile.roles, "role:manage")) {
    return (
      <div>
        <h1 className="text-ink font-serif text-2xl font-semibold">无权访问</h1>
        <p className="text-ink-muted mt-3 text-sm">
          角色权限管理仅限管理员查看，如需调整角色分配请联系管理员。
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-ink font-serif text-2xl font-semibold">角色权限</h1>
        <p className="text-ink-muted mt-1 text-sm">
          角色分配变更需接入真实数据库后开放，本页为当前权限矩阵的只读展示（详见
          docs/ROLES_AND_PERMISSIONS.md）。
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-ink text-sm font-semibold">角色权限矩阵</h2>
        {MANAGEABLE_ROLES.map((role) => (
          <div key={role} className="border-line rounded-xs border p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-ink text-sm font-semibold">{ROLE_LABELS[role]}</span>
              <span className="text-ink-faint text-xs">({role})</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {[...new Set(ROLE_PERMISSIONS[role])].map((permission) => (
                <Badge key={permission} tone="neutral">
                  {permission}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
