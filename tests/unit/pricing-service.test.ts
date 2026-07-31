import { describe, expect, it } from "vitest";
import { convertAmount, formatMoney } from "@/lib/services/pricing-service";

describe("pricing service", () => {
  it("returns the same money object when currencies match", async () => {
    const result = await convertAmount({ amount: 1200, currency: "EUR" }, "EUR");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({ amount: 1200, currency: "EUR" });
    }
  });

  it("converts EUR to CNY using the active exchange rate", async () => {
    const result = await convertAmount({ amount: 1200, currency: "EUR" }, "CNY");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.currency).toBe("CNY");
      expect(result.data.amount).toBeCloseTo(1200 * 7.85, 2);
    }
  });

  it("formats money using Intl.NumberFormat", () => {
    const formatted = formatMoney({ amount: 1200, currency: "EUR" });
    expect(formatted).toContain("1,200");
  });
});
