import { expect, test } from "@playwright/test";
import { loginAsDemoAccount } from "./utils/auth";

test.describe("核心用户旅程", () => {
  test("发布房源表单可填写并提交确认", async ({ page }) => {
    await loginAsDemoAccount(page, "林飞", "/listings/new");
    await page.getByLabel("房源标题").fill("E2E 测试房源");
    await page.getByLabel("房源描述").fill("这是一条端到端测试用的房源描述。");
    await page.getByLabel("详细地址").fill("Via Test 1, Milano");
    await page.getByLabel("面积（㎡）").fill("30");
    await page.getByLabel("月租（欧元）").fill("500");
    await page.getByLabel("最短租期（月）").fill("6");
    await page.getByLabel("可入住日期").fill("2026-09-01");
    await page.getByRole("button", { name: "提交房源" }).click();
    await expect(page.getByText("房源已提交")).toBeVisible();
  });

  test("我的房源管理页展示状态徽章与对应操作按钮", async ({ page }) => {
    await loginAsDemoAccount(page, "林飞", "/account/listings");
    await expect(page.getByRole("heading", { name: "我的房源" })).toBeVisible();
    await expect(page.getByText("待审核")).toBeVisible();
    // 演示房源标题本身含有「已过期」字样，用 exact 精确匹配状态徽章而非标题
    await expect(page.getByText("已过期", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "重新发布" })).toBeVisible();
  });

  test("跨用户编辑房源被拦截返回 404", async ({ page }) => {
    await loginAsDemoAccount(page, "林飞", "/account");
    const response = await page.goto("/account/listings/listing-torino-centro-private-room/edit");
    expect(response?.status()).toBe(404);
  });

  test("获取联系方式返回发帖人联系方式而非查看者本人", async ({ page }) => {
    await loginAsDemoAccount(page, "林飞", "/listings/listing-torino-centro-private-room");
    await page.getByRole("button", { name: "获取联系方式" }).click();
    await expect(page.getByText("giulia.bianchi.demo@example.com")).toBeVisible();
  });

  test("收藏按钮可切换状态", async ({ page }) => {
    await loginAsDemoAccount(page, "林飞", "/listings/listing-torino-centro-private-room");
    await page.getByRole("button", { name: "收藏", exact: true }).click();
    await expect(page.getByRole("button", { name: "已收藏" })).toBeVisible();
  });

  test("评论提交后乐观展示在列表末尾", async ({ page }) => {
    await loginAsDemoAccount(page, "林飞", "/listings/listing-torino-centro-private-room");
    await page.getByLabel("发表评论").fill("E2E 测试评论内容");
    await page.getByRole("button", { name: "发表评论" }).click();
    await expect(page.getByText("E2E 测试评论内容")).toBeVisible();
  });

  test("未登录访问房源详情页展示登录引导而非交互按钮", async ({ page }) => {
    await page.goto("/listings/listing-torino-centro-private-room");
    await expect(page.getByRole("link", { name: "登录后获取联系方式" })).toBeVisible();
    await expect(page.getByRole("link", { name: "登录后收藏" })).toBeVisible();
    await expect(page.getByRole("link", { name: "登录后发表评论" })).toBeVisible();
  });
});
