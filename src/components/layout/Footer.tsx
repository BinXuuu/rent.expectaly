import Link from "next/link";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "找房源",
    links: [
      { label: "房源列表", href: "/listings" },
      { label: "城市", href: "/cities" },
      { label: "发布房源", href: "/listings/new" },
    ],
  },
  {
    title: "服务",
    links: [
      { label: "平台说明", href: "/about" },
      { label: "常见问题", href: "/faq" },
    ],
  },
  {
    title: "帮助与支持",
    links: [
      { label: "举报中心", href: "/legal/report-handling-policy" },
      { label: "内容发布规范", href: "/legal/content-guidelines" },
    ],
  },
  {
    title: "法律与政策",
    links: [
      { label: "用户协议", href: "/legal/user-agreement" },
      { label: "隐私政策", href: "/legal/privacy-policy" },
      { label: "免责声明", href: "/legal/disclaimer" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-line bg-surface border-t">
      <div className="mx-auto max-w-(--container-page) px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-3 lg:col-span-1">
            <Logo />
            <p className="text-ink-muted max-w-xs text-sm leading-6">
              意大利个人房源租赁信息平台。纯挂资源展示，不做平台内交易与撮合交付，
              仅提供信息展示、评论与举报机制。
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3">
              <h2 className="text-ink text-sm font-semibold">{column.title}</h2>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="focus-ring text-ink-muted hover:text-ink rounded-xs text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-line mt-10 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-faint text-xs">
            © {new Date().getFullYear()} 意料之中～意租（Expectaly
            Rent）。房源信息由用户自主发布，平台不对线下交易结果承担责任。
          </p>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <a
              href="https://expectaly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring text-ink-muted hover:text-ink rounded-xs text-xs underline underline-offset-2"
            >
              前往主站 expectaly.com（意大利生活资源 Wiki）
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
