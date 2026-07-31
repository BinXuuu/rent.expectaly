/**
 * 演示数据：汇率。仅用于月租的人民币参考价换算，第一期使用后台可配置的模拟/手动汇率。
 */
import type { ExchangeRate } from "@/types";

const base = {
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  source: "manual",
  isActive: true,
} as const;

export const mockExchangeRates: ExchangeRate[] = [
  {
    id: "rate-eur-cny",
    baseCurrency: "EUR",
    quoteCurrency: "CNY",
    rate: 7.85,
    effectiveAt: "2026-07-20T00:00:00+02:00",
    createdAt: "2026-07-20T08:00:00+02:00",
    updatedAt: "2026-07-20T08:00:00+02:00",
    ...base,
  },
];
