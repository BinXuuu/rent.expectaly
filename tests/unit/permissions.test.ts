import { describe, expect, it } from "vitest";
import { can, assertPermission, isAdmin } from "@/lib/permissions";
import { AppError } from "@/lib/errors/app-error";

describe("permission matrix", () => {
  it("allows guests to view public listing resources only", () => {
    expect(can(["guest"], "listing:view")).toBe(true);
    expect(can(["guest"], "city:view")).toBe(true);
    expect(can(["guest"], "listing:create")).toBe(false);
    expect(can(["guest"], "favorite:create")).toBe(false);
  });

  it("allows logged-in users to create/manage their own listings, comments and favorites", () => {
    expect(can(["user"], "listing:create")).toBe(true);
    expect(can(["user"], "listing:update_own")).toBe(true);
    expect(can(["user"], "comment:create")).toBe(true);
    expect(can(["user"], "favorite:create")).toBe(true);
    expect(can(["user"], "contact_reveal:create")).toBe(true);
    expect(can(["user"], "report:create")).toBe(true);
    expect(can(["user"], "listing:moderate")).toBe(false);
    expect(can(["user"], "user:manage")).toBe(false);
  });

  it("allows content reviewers to moderate reports/listings/comments but not manage users", () => {
    expect(can(["content_reviewer"], "report:view")).toBe(true);
    expect(can(["content_reviewer"], "report:moderate")).toBe(true);
    expect(can(["content_reviewer"], "listing:moderate")).toBe(true);
    expect(can(["content_reviewer"], "comment:moderate")).toBe(true);
    expect(can(["content_reviewer"], "user:manage")).toBe(false);
    expect(can(["content_reviewer"], "system_setting:manage")).toBe(false);
  });

  it("grants admin every permission, without a separate super-admin bypass", () => {
    expect(isAdmin(["admin"])).toBe(true);
    expect(can(["admin"], "listing:manage")).toBe(true);
    expect(can(["admin"], "user:manage")).toBe(true);
    expect(can(["admin"], "system_setting:manage")).toBe(true);
    expect(can(["admin"], "role:manage")).toBe(true);
  });

  it("assertPermission throws AppError with PERMISSION_DENIED code when unauthorized", () => {
    expect(() => assertPermission(["user"], "listing:manage")).toThrowError(AppError);
    try {
      assertPermission(["user"], "listing:manage");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("PERMISSION_DENIED");
    }
  });

  it("assertPermission does not throw when the role has the permission", () => {
    expect(() => assertPermission(["user"], "listing:create")).not.toThrow();
  });
});
