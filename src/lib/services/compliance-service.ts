/**
 * 风险关键词自动预警：将命中平台配置的风险关键词的内容标记出来，供内容审核员优先处理，
 * 本身不构成自动下架或封禁决定，最终处置仍需人工判断。
 * 关键词来源 system_settings.risk_keywords（valueType: "json"，存储为字符串数组的 JSON），
 * 详见 src/data/mock/system-settings.ts。
 */

export function parseRiskKeywords(rawValue: string): string[] {
  try {
    const parsed: unknown = JSON.parse(rawValue);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.length > 0);
    }
    return [];
  } catch {
    return [];
  }
}

export function findRiskKeywordMatches(
  text: string | null | undefined,
  keywords: string[],
): string[] {
  if (!text || keywords.length === 0) return [];
  return keywords.filter((keyword) => keyword.length > 0 && text.includes(keyword));
}

export function containsRiskKeyword(text: string | null | undefined, keywords: string[]): boolean {
  return findRiskKeywordMatches(text, keywords).length > 0;
}
