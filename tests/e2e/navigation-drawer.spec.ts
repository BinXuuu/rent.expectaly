import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 375, height: 812 } });

test.describe("移动端导航抽屉", () => {
  test("点击汉堡菜单打开移动端主导航", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "打开菜单" }).click();
    const drawerNav = page.getByRole("navigation", { name: "移动端主导航" });
    await expect(drawerNav.getByRole("link", { name: "找房源" })).toBeVisible();
    await expect(drawerNav.getByRole("link", { name: "城市" })).toBeVisible();
  });

  test("移动端筛选抽屉可在房源列表页打开", async ({ page }) => {
    await page.goto("/listings");
    await page.getByRole("button", { name: /筛选/ }).click();
    await expect(page.getByRole("heading", { name: "筛选", exact: true })).toBeVisible();
  });
});
