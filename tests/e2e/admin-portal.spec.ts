import { expect, test } from "@playwright/test";
import { loginAsDemoAccount } from "./utils/auth";

test.describe("平台后台", () => {
  test("普通用户访问平台后台展示无权访问引导", async ({ page }) => {
    await loginAsDemoAccount(page, "林飞", "/admin");
    await expect(page.getByRole("heading", { name: "无权访问平台后台" })).toBeVisible();
  });

  test("内容审核员仅看到权限范围内的导航项", async ({ page }) => {
    await loginAsDemoAccount(page, "若曦", "/admin");
    const nav = page.getByRole("navigation", { name: "平台后台导航" });
    await expect(nav.getByRole("link", { name: "仪表盘" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "举报处理" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "用户管理" })).toHaveCount(0);
    await expect(nav.getByRole("link", { name: "角色权限" })).toHaveCount(0);
  });

  test("内容审核员直接访问 /admin/roles 被拦截，不泄露权限矩阵", async ({ page }) => {
    await loginAsDemoAccount(page, "若曦", "/admin/roles");
    await expect(page.getByRole("heading", { name: "无权访问", exact: true })).toBeVisible();
    await expect(page.getByText("role:manage")).toHaveCount(0);
  });

  test("管理员可访问角色权限矩阵且导航完整", async ({ page }) => {
    await loginAsDemoAccount(page, "志远", "/admin/roles");
    await expect(page.getByRole("heading", { name: "角色权限", exact: true })).toBeVisible();
    await expect(page.getByText("role:manage")).toBeVisible();
  });

  test("举报处理队列展示命中风险关键词的待处理举报并可打开处理弹层", async ({ page }) => {
    await loginAsDemoAccount(page, "若曦", "/admin/reports");
    await expect(page.getByText(/命中风险关键词/)).toBeVisible();
    await page.getByRole("button", { name: "处理" }).first().click();
    await expect(page.getByText("处理决定")).toBeVisible();
  });

  test("房源管理队列展示待审核房源", async ({ page }) => {
    await loginAsDemoAccount(page, "若曦", "/admin/listings");
    // 举报处理弹层的 description 也会在 DOM 中渲染同名文本（关闭态），用链接角色精确匹配列表项标题
    await expect(page.getByRole("link", { name: "博洛尼亚免中介内部渠道急租一室" })).toBeVisible();
  });
});
