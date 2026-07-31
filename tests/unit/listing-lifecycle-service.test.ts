import { describe, expect, it } from "vitest";
import {
  computeExpiresAt,
  daysUntilExpiry,
  filterPubliclyVisibleListings,
  isListingExpired,
  isPubliclyVisible,
} from "@/lib/services/listing-lifecycle-service";
import { mockListings } from "@/data/mock";

describe("listing lifecycle service", () => {
  it("computes expiresAt as publishedAt + validityDays", () => {
    const expiresAt = computeExpiresAt("2026-07-01T10:00:00+02:00", 30);
    expect(new Date(expiresAt).toISOString()).toBe(
      new Date("2026-07-31T10:00:00+02:00").toISOString(),
    );
  });

  it("treats a listing without expiresAt as never expired", () => {
    const draft = mockListings.find((l) => l.id === "listing-modena-draft")!;
    expect(isListingExpired(draft)).toBe(false);
  });

  it("marks the venezia demo listing as expired relative to a fixed 'now'", () => {
    const expiredListing = mockListings.find((l) => l.id === "listing-venezia-expired")!;
    const now = new Date("2026-07-23T00:00:00+02:00");
    expect(isListingExpired(expiredListing, now)).toBe(true);
    expect(isPubliclyVisible(expiredListing, now)).toBe(false);
  });

  it("only surfaces published + non-expired listings as publicly visible", () => {
    const now = new Date("2026-07-23T00:00:00+02:00");
    const visible = filterPubliclyVisibleListings(mockListings, now);
    for (const listing of visible) {
      expect(listing.status).toBe("published");
    }
    // draft / pending_review / expired / removed 均不应出现
    expect(visible.some((l) => l.id === "listing-modena-draft")).toBe(false);
    expect(visible.some((l) => l.id === "listing-bologna-pending-review")).toBe(false);
    expect(visible.some((l) => l.id === "listing-venezia-expired")).toBe(false);
    expect(visible.some((l) => l.id === "listing-napoli-removed")).toBe(false);
  });

  it("computes remaining days until expiry for a still-valid listing", () => {
    const listing = mockListings.find((l) => l.id === "listing-parma-shared-room-pets")!;
    const now = new Date("2026-07-23T10:00:00+02:00");
    expect(daysUntilExpiry(listing, now)).toBe(29);
  });

  it("returns null remaining days for an already-expired listing", () => {
    const expiredListing = mockListings.find((l) => l.id === "listing-venezia-expired")!;
    const now = new Date("2026-07-23T00:00:00+02:00");
    expect(daysUntilExpiry(expiredListing, now)).toBeNull();
  });
});
