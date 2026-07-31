import type { Result } from "@/types";
import { ok, err } from "@/types";
import { AppError, toAppErrorShape } from "@/lib/errors/app-error";
import { contactRevealEventRepository, systemSettingRepository } from "@/lib/repositories";

/**
 * 「获取联系方式」按钮的限流判断（见 docs/PROJECT_REQUIREMENTS.md 第 7 节、docs/COMPLIANCE.md）。
 * 阈值从 system_settings 读取（键名见 data/mock/system-settings.ts），
 * 未配置时回退到保守的默认值，避免因设置缺失而完全放开限流。
 */

const DEFAULT_WINDOW_SECONDS = 3600;
const DEFAULT_MAX_REQUESTS = 20;

async function getRateLimitConfig(): Promise<{ windowSeconds: number; maxRequests: number }> {
  const [windowSetting, maxSetting] = await Promise.all([
    systemSettingRepository.findByKey("contact_reveal_rate_limit_window_seconds"),
    systemSettingRepository.findByKey("contact_reveal_rate_limit_max_requests"),
  ]);

  const windowSeconds =
    windowSetting.ok && windowSetting.data
      ? Number(windowSetting.data.value)
      : DEFAULT_WINDOW_SECONDS;
  const maxRequests =
    maxSetting.ok && maxSetting.data ? Number(maxSetting.data.value) : DEFAULT_MAX_REQUESTS;

  return {
    windowSeconds: Number.isFinite(windowSeconds) ? windowSeconds : DEFAULT_WINDOW_SECONDS,
    maxRequests: Number.isFinite(maxRequests) ? maxRequests : DEFAULT_MAX_REQUESTS,
  };
}

/**
 * 校验用户当前是否仍在「获取联系方式」限流额度内。
 * 只做只读判断，不写入新的事件记录（写入将在接入真实数据库的阶段实现）。
 */
export async function assertContactRevealNotRateLimited(userId: string): Promise<Result<void>> {
  try {
    const { windowSeconds, maxRequests } = await getRateLimitConfig();
    const sinceIso = new Date(Date.now() - windowSeconds * 1000).toISOString();

    const eventsResult = await contactRevealEventRepository.findByUserSince(userId, sinceIso);
    if (!eventsResult.ok) {
      return err(eventsResult.error);
    }

    if (eventsResult.data.length >= maxRequests) {
      return err(
        AppError.rateLimited(
          `获取联系方式过于频繁，请 ${Math.ceil(windowSeconds / 60)} 分钟后再试`,
        ).toShape(),
      );
    }

    return ok(undefined);
  } catch (error) {
    return err(toAppErrorShape(error));
  }
}
