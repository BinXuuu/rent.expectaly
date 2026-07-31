import { expect, test } from "@playwright/test";

test.describe("房源列表与详情", () => {
  test("列表页展示公开可见房源并支持筛选", async ({ page }) => {
    await page.goto("/listings");
    // 页脚导航列标题也叫「找房源」，用 level:1 限定为页面主标题避免重复匹配
    await expect(page.getByRole("heading", { name: "找房源", level: 1 })).toBeVisible();
    await expect(page.getByText(/共 \d+ 套房源/)).toBeVisible();

    // 按免中介费筛选
    await page.goto("/listings?agency_fee=no");
    const cards = page.locator("article");
    await expect(cards.first()).toBeVisible();
  });

  test("详情页展示完整字段与免责声明", async ({ page }) => {
    await page.goto("/listings/listing-milano-navigli-1br");
    await expect(page.getByRole("heading", { name: "米兰纳维利运河区精装一室公寓" })).toBeVisible();
    await expect(page.getByText("€1,200.00")).toBeVisible();
    await expect(page.getByText("需中介费")).toBeVisible();
    await expect(page.getByText("有合同")).toBeVisible();
    await expect(page.getByRole("heading", { name: "免责声明" })).toBeVisible();
  });

  test("已下架房源返回 404", async ({ page }) => {
    const response = await page.goto("/listings/listing-napoli-removed");
    expect(response?.status()).toBe(404);
  });

  test("已过期房源返回 404", async ({ page }) => {
    const response = await page.goto("/listings/listing-venezia-expired");
    expect(response?.status()).toBe(404);
  });

  test("草稿房源返回 404", async ({ page }) => {
    const response = await page.goto("/listings/listing-modena-draft");
    expect(response?.status()).toBe(404);
  });
});
