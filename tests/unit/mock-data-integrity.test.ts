import { describe, expect, it } from "vitest";
import {
  mockAuditLogs,
  mockCities,
  mockComments,
  mockContactRevealEvents,
  mockFavorites,
  mockListingImages,
  mockListings,
  mockProfiles,
  mockReports,
  mockSystemSettings,
  mockUserRoleAssignments,
} from "@/data/mock";

/**
 * 种子数据完整性校验：确保演示数据内部的外键引用一致，
 * 避免后续阶段的页面在联调时因为脏数据而出现空白/崩溃。
 */
describe("mock data referential integrity", () => {
  const cityIds = new Set(mockCities.map((c) => c.id));
  const profileIds = new Set(mockProfiles.map((p) => p.id));
  const listingIds = new Set(mockListings.map((l) => l.id));
  const commentIds = new Set(mockComments.map((c) => c.id));

  it("every listing references an existing city and publisher", () => {
    for (const listing of mockListings) {
      expect(cityIds.has(listing.cityId)).toBe(true);
      expect(profileIds.has(listing.publisherId)).toBe(true);
    }
  });

  it("every listing image references an existing listing", () => {
    for (const image of mockListingImages) {
      expect(listingIds.has(image.listingId)).toBe(true);
    }
  });

  it("every comment references an existing listing and author", () => {
    for (const comment of mockComments) {
      expect(listingIds.has(comment.listingId)).toBe(true);
      expect(profileIds.has(comment.authorId)).toBe(true);
    }
  });

  it("hidden comments always carry a hiddenBy and hiddenReason", () => {
    for (const comment of mockComments) {
      if (comment.status === "hidden") {
        expect(comment.hiddenBy).not.toBeNull();
        expect(comment.hiddenReason).not.toBeNull();
      } else {
        expect(comment.hiddenBy).toBeNull();
      }
    }
  });

  it("every favorite references an existing user and listing", () => {
    for (const favorite of mockFavorites) {
      expect(profileIds.has(favorite.userId)).toBe(true);
      expect(listingIds.has(favorite.listingId)).toBe(true);
    }
  });

  it("every contact reveal event references an existing user and listing", () => {
    for (const event of mockContactRevealEvents) {
      expect(profileIds.has(event.userId)).toBe(true);
      expect(listingIds.has(event.listingId)).toBe(true);
    }
  });

  it("every report references an existing listing or comment depending on reportedType", () => {
    for (const report of mockReports) {
      expect(profileIds.has(report.reporterId)).toBe(true);
      if (report.reportedType === "listing") {
        expect(listingIds.has(report.reportedId)).toBe(true);
      } else {
        expect(commentIds.has(report.reportedId)).toBe(true);
      }
      if (report.handledBy) {
        expect(profileIds.has(report.handledBy)).toBe(true);
      }
    }
  });

  it("every audit log actor (when set) references an existing profile", () => {
    for (const log of mockAuditLogs) {
      if (log.actorId) {
        expect(profileIds.has(log.actorId)).toBe(true);
      }
    }
  });

  it("every user role assignment references an existing profile and a role it actually holds", () => {
    for (const assignment of mockUserRoleAssignments) {
      expect(profileIds.has(assignment.userId)).toBe(true);
      const profile = mockProfiles.find((p) => p.id === assignment.userId);
      expect(profile?.roles).toContain(assignment.role);
    }
  });

  it("system settings keys are unique", () => {
    const keys = mockSystemSettings.map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("published listings always have publishedAt and expiresAt set", () => {
    for (const listing of mockListings) {
      if (["published", "expired", "removed"].includes(listing.status)) {
        expect(listing.publishedAt).not.toBeNull();
        expect(listing.expiresAt).not.toBeNull();
      }
      if (listing.status === "draft" || listing.status === "pending_review") {
        expect(listing.publishedAt).toBeNull();
      }
    }
  });
});
