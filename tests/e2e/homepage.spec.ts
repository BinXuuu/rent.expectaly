import { expect, test } from "@playwright/test";

test.describe("首页", () => {
  test("加载首页并展示核心分区", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/意料之中/);
    await expect(page.getByRole("link", { name: /意料之中～意租/ }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "最近发布" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "热门城市" })).toBeVisible();
  });

  test("首页无水平溢出", async ({ page }) => {
    await page.goto("/");
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(hasOverflow).toBe(false);
  });

  test("浏览房源与发布房源入口可达", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "浏览房源" }).click();
    await expect(page).toHaveURL(/\/listings$/);
  });
});
