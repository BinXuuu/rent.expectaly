import { expect, test } from "@playwright/test";
import { loginAsDemoAccount, logout } from "./utils/auth";

test.describe("登录与路由保护", () => {
  test("未登录访问 /account 重定向到登录页并携带 redirect 参数", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/auth\/login\?redirect=%2Faccount/);
  });

  test("演示账号登录后跳转回原目标页并展示用户中心数据", async ({ page }) => {
    await loginAsDemoAccount(page, "林飞", "/account");
    await expect(page).toHaveURL(/\/account$/);
    await expect(page.getByRole("heading", { name: /欢迎回来，林飞/ })).toBeVisible();
    // 侧边导航与统计卡片均含「我的房源」文案，用 exact 精确匹配侧边导航项
    await expect(page.getByRole("link", { name: "我的房源", exact: true })).toBeVisible();
  });

  test("退出登录后再次访问 /account 要求重新登录", async ({ page }) => {
    await loginAsDemoAccount(page, "林飞", "/account");
    await logout(page);
    await page.goto("/account");
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
