import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { getCurrentProfile } from "@/lib/auth/session";
import { can } from "@/lib/permissions";
import { systemSettingRepository } from "@/lib/repositories";

export const metadata: Metadata = { title: "系统设置" };

export default async function AdminSettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile || !can(profile.roles, "system_setting:manage")) {
    return (
      <div>
        <h1 className="text-ink font-serif text-2xl font-semibold">无权访问</h1>
        <p className="text-ink-muted mt-2 text-sm">该页面仅管理员可访问。</p>
      </div>
    );
  }

  const settingsResult = await systemSettingRepository.findAll();
  const settings = settingsResult.ok ? settingsResult.data : [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-ink font-serif text-2xl font-semibold">系统设置</h1>
        <p className="text-ink-muted mt-1 text-sm">
          配置项当前为只读展示，编辑功能将在接入真实数据库后开放。本项目不存在支付/微信登录等功能开关，见
          docs/NO_TRANSACTION_POLICY.md。
        </p>
      </div>

      <section>
        <h2 className="text-ink mb-3 text-sm font-semibold">配置项</h2>
        <div className="flex flex-col gap-3">
          {settings.map((setting) => (
            <div key={setting.id} className="border-line rounded-xs border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-ink text-sm font-medium">{setting.key}</span>
                <Badge tone="neutral">{setting.valueType}</Badge>
              </div>
              <p className="text-ink-muted mt-1 text-sm">{setting.value}</p>
              {setting.description && (
                <p className="text-ink-faint mt-1 text-xs">{setting.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
