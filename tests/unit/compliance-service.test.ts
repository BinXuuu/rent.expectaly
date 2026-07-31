import { describe, expect, it } from "vitest";
import {
  containsRiskKeyword,
  findRiskKeywordMatches,
  parseRiskKeywords,
} from "@/lib/services/compliance-service";

describe("compliance service", () => {
  it("parses a JSON array of risk keywords", () => {
    expect(parseRiskKeywords(JSON.stringify(["内部渠道", "低价急租"]))).toEqual([
      "内部渠道",
      "低价急租",
    ]);
  });

  it("returns an empty array for invalid JSON", () => {
    expect(parseRiskKeywords("not json")).toEqual([]);
  });

  it("finds keyword matches within a text", () => {
    const keywords = ["内部渠道", "免中介急租"];
    expect(findRiskKeywordMatches("博洛尼亚免中介内部渠道急租一室", keywords)).toEqual([
      "内部渠道",
    ]);
  });

  it("returns no matches for null/undefined text", () => {
    expect(findRiskKeywordMatches(null, ["内部渠道"])).toEqual([]);
    expect(findRiskKeywordMatches(undefined, ["内部渠道"])).toEqual([]);
  });

  it("containsRiskKeyword reflects whether any keyword matched", () => {
    expect(containsRiskKeyword("价格明显低于市场行情", ["低价急租"])).toBe(false);
    expect(containsRiskKeyword("内部渠道免中介费急租", ["内部渠道"])).toBe(true);
  });
});
