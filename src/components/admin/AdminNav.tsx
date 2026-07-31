"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/types";
import type { PermissionKey } from "@/lib/permissions";
import { can } from "@/lib/permissions";
import { cn } from "@/lib/utils/cn";

interface AdminNavItem {
  label: string;
  href: string;
  /** 至少满足其中一项权限即可看到该导航项；留空表示所有平台后台角色均可见。 */
  anyOf?: PermissionKey[];
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "仪表盘", href: "/admin" },
  { label: "房源管理", href: "/admin/listings", anyOf: ["listing:moderate", "listing:manage"] },
  {
    label: "举报处理",
    href: "/admin/reports",
    anyOf: ["report:view", "report:moderate", "report:manage"],
  },
  { label: "评论管理", href: "/admin/comments", anyOf: ["comment:moderate", "comment:manage"] },
  { label: "用户管理", href: "/admin/users", anyOf: ["user:manage"] },
  { label: "城市管理", href: "/admin/cities", anyOf: ["city:manage"] },
  { label: "系统设置", href: "/admin/settings", anyOf: ["system_setting:manage"] },
  { label: "角色权限", href: "/admin/roles", anyOf: ["role:manage"] },
  { label: "审计日志", href: "/admin/audit-logs", anyOf: ["audit_log:view"] },
];

export interface AdminNavProps {
  roles: Role[];
}

export function AdminNav({ roles }: AdminNavProps) {
  const pathname = usePathname();
  const visibleItems = ADMIN_NAV_ITEMS.filter(
    (item) => !item.anyOf || item.anyOf.some((permission) => can(roles, permission)),
  );

  return (
    <nav aria-label="平台后台导航" className="flex flex-col gap-1">
      {visibleItems.map((item) => {
        const isActive =
          item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "focus-ring rounded-xs px-3 py-2 text-sm",
              isActive
                ? "bg-brand-50 text-brand-700 font-medium"
                : "text-ink-muted hover:bg-surface-muted",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
