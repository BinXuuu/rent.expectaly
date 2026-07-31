import type { BaseEntity, Currency } from "./common";

/**
 * 对应数据库实体 exchange_rates。
 * 第一期使用后台可配置的模拟/手动汇率，仅用于月租的人民币参考价换算。
 */
export interface ExchangeRate extends BaseEntity {
  baseCurrency: Currency;
  quoteCurrency: Currency;
  rate: number;
  source: "manual" | "external_api";
  effectiveAt: string;
  isActive: boolean;
}

export const EXCHANGE_RATE_DISCLAIMER = "参考汇率换算，最终价格以发帖人确认结果为准。";
