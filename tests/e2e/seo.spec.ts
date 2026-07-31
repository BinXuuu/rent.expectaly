import { expect, test } from "@playwright/test";

test.describe("SEO", () => {
  test("sitemap.xml 可访问且仅收录公开可见房源", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("/listings/listing-milano-navigli-1br");
    expect(body).not.toContain("/listings/listing-napoli-removed");
    expect(body).not.toContain("/listings/listing-modena-draft");
  });

  test("robots.txt 可访问且禁止后台路径", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("Disallow: /admin");
    expect(body).toContain("Disallow: /account");
  });

  test("房源详情页 canonical 与标题正确", async ({ page }) => {
    await page.goto("/listings/listing-milano-navigli-1br");
    await expect(page).toHaveTitle(/米兰纳维利运河区精装一室公寓/);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toContain("/listings/listing-milano-navigli-1br");
  });
});
