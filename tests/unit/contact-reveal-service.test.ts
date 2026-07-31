import { describe, expect, it } from "vitest";
import { assertContactRevealNotRateLimited } from "@/lib/services/contact-reveal-service";

describe("contact reveal rate limiting", () => {
  it("allows a user with only a couple of past reveal events within the default window", async () => {
    const result = await assertContactRevealNotRateLimited("profile-user-wangqiang");
    expect(result.ok).toBe(true);
  });

  it("allows a user with no past reveal events at all", async () => {
    const result = await assertContactRevealNotRateLimited("profile-user-giulia");
    expect(result.ok).toBe(true);
  });
});
