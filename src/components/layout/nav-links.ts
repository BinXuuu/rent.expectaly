export interface NavLink {
  label: string;
  href: string;
}

/** 顶部导航与移动端菜单共用的主导航结构。对应页面将在 Stage 03 起逐步实现。 */
export const PRIMARY_NAV_LINKS: NavLink[] = [
  { label: "找房源", href: "/listings" },
  { label: "城市", href: "/cities" },
  { label: "关于平台", href: "/about" },
];

export const SECONDARY_NAV_LINKS: NavLink[] = [
  { label: "平台说明", href: "/about" },
  { label: "常见问题", href: "/faq" },
];
