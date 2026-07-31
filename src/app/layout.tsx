import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/config/site";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-serif-override",
  subsets: ["latin"],
  display: "swap",
});

const siteTitle = "意料之中～意租 | Expectaly Rent";
const siteDescription =
  "意大利个人房源租赁与买卖信息平台 · 发帖展示出租/出售房源 · 评论与收藏 · 不做平台内交易";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteTitle, template: `%s | ${siteConfig.name}` },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: siteConfig.name,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${sourceSerif.variable} h-full antialiased`}>
      <body className="bg-paper text-ink flex min-h-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
