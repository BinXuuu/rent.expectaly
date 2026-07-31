import type { Metadata } from "next";
import { PageContainer } from "@/components/shared/PageContainer";

export const metadata: Metadata = {
  title: "关于平台",
  description: "意料之中～意租的平台定位与使用说明。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PageContainer className="max-w-3xl py-12">
      <h1 className="text-ink font-serif text-3xl font-semibold">关于「意料之中～意租」</h1>
      <div className="text-ink-muted mt-6 flex flex-col gap-6 text-base leading-8">
        <p>
          「意料之中～意租」是面向意大利境内的个人房源信息分类平台，覆盖出租与出售两种类别。
          个人房东/二房东/业主可以自主发布房源，租客与购房者可以浏览、搜索、收藏、评论感兴趣的房源。
        </p>
        <p>
          <strong className="text-ink">本平台不做什么：</strong>
          我们不提供 1 对 1 私信/实时聊天功能，用户之间只能通过房源下的公开评论互动；
          我们不做任何形式的平台内交易、支付或交付流程——这是一个纯挂资源信息展示的平台，
          不允许在平台内进行交易撮合。看房、签约、付款等环节均需租客与发帖人自行在线下完成。
        </p>
        <p>
          <strong className="text-ink">联系方式获取：</strong>
          由于不提供即时通讯功能，租客/购房者在房源详情页登录后可点击「获取联系方式」按钮，
          查看发帖人预留的联系方式（电话/微信/邮箱）。为防止滥用，该功能会有合理的使用频率限制。
        </p>
        <p>
          <strong className="text-ink">内容审核：</strong>
          我们无法逐一核实每条房源信息的真实性，因此提供举报机制——如果你发现虚假、重复或违规的房源
          与评论，欢迎点击举报，平台的内容审核团队会尽快核实处理。
        </p>
        <p>
          「意料之中～意租」与「意料之中」品牌旗下商城子站「意料之中～意购」是两个完全独立的平台，
          仅共享品牌视觉语言，代码与数据互不关联。
        </p>
      </div>
    </PageContainer>
  );
}
