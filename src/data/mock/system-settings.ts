/**
 * 演示数据：后台可配置的系统设置键值项。
 */
import type { SystemSetting } from "@/types";

const base = {
  deletedAt: null,
  createdBy: null,
  updatedBy: "profile-admin",
  createdAt: "2026-07-01T09:00:00+02:00",
  updatedAt: "2026-07-01T09:00:00+02:00",
};

export const mockSystemSettings: SystemSetting[] = [
  {
    id: "setting-listing-validity-options",
    key: "listing_validity_options_days",
    value: JSON.stringify([7, 15, 30]),
    valueType: "json",
    description: "发帖时可选的有效期时长（天）",
    ...base,
  },
  {
    id: "setting-contact-reveal-rate-limit-window",
    key: "contact_reveal_rate_limit_window_seconds",
    value: "3600",
    valueType: "number",
    description: "「获取联系方式」限流窗口（秒）",
    ...base,
  },
  {
    id: "setting-contact-reveal-rate-limit-max",
    key: "contact_reveal_rate_limit_max_requests",
    value: "20",
    valueType: "number",
    description: "限流窗口内允许的最大「获取联系方式」次数",
    ...base,
  },
  {
    id: "setting-risk-keywords",
    key: "risk_keywords",
    value: JSON.stringify(["内部渠道", "免中介急租", "低价急租", "无需看房"]),
    valueType: "json",
    description: "房源/评论风险关键词自动预警词库",
    ...base,
  },
];
