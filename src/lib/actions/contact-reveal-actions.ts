"use server";

import { getCurrentProfile } from "@/lib/auth/session";
import { listingRepository, profileRepository } from "@/lib/repositories";
import { assertContactRevealNotRateLimited } from "@/lib/services/contact-reveal-service";

export type RevealContactResult =
  { ok: true; phone: string | null; email: string | null } | { ok: false; error: string };

/**
 * 「获取联系方式」按钮的服务端动作：校验登录态与限流额度，
 * 通过后返回发帖人（房源 publisherId 对应 profile）预留的联系方式。
 * 第一期只做限流的只读判断，不写入新的 contact_reveal_events 记录
 * （与项目全程「repositories 第一期只读」的原则一致，见 docs/PROGRESS.md 已知问题）。
 */
export async function revealContact(listingId: string): Promise<RevealContactResult> {
  const profile = await getCurrentProfile();
  if (!profile) {
    return { ok: false, error: "请先登录" };
  }

  const rateLimitResult = await assertContactRevealNotRateLimited(profile.id);
  if (!rateLimitResult.ok) {
    return { ok: false, error: rateLimitResult.error.message };
  }

  const listingResult = await listingRepository.findById(listingId);
  if (!listingResult.ok) {
    return { ok: false, error: "房源不存在" };
  }

  const publisherResult = await profileRepository.findById(listingResult.data.publisherId);
  if (!publisherResult.ok) {
    return { ok: false, error: "无法获取发帖人信息" };
  }

  return { ok: true, phone: publisherResult.data.phone, email: publisherResult.data.email };
}
