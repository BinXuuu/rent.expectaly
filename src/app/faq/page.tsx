import type { Metadata } from "next";
import { PageContainer } from "@/components/shared/PageContainer";
import { FaqAccordion, type FaqItem } from "@/components/shared/FaqAccordion";

export const metadata: Metadata = {
  title: "常见问题",
  description: "关于房源发布、联系方式获取、举报处理与平台定位的常见问题解答。",
  alternates: { canonical: "/faq" },
};

const FAQ_GROUPS: { category: string; items: FaqItem[] }[] = [
  {
    category: "平台定位",
    items: [
      {
        question: "这个平台可以在线支付租金或房款、签约吗？",
        answer:
          "不可以。无论出租还是出售房源，本平台都是纯挂资源的房源信息展示网站，不提供任何形式的平台内交易、支付或签约功能，看房、签约、付款均需在线下自行完成。",
      },
      {
        question: "可以和房东/业主私信聊天吗？",
        answer:
          "本平台不提供 1 对 1 私信/实时聊天功能。你可以在房源详情页发表公开评论，或登录后点击「获取联系方式」按钮查看房东/业主预留的联系方式，之后的沟通在平台之外进行。",
      },
    ],
  },
  {
    category: "发布房源",
    items: [
      {
        question: "既可以发布出租房源，也可以发布出售房源吗？",
        answer:
          "可以。发布时先选择「类别：出租 / 出售」，出租房源展示月租，出售房源展示总价，其余标签（中介费、合同、装修状况等）两种类别通用。",
      },
      {
        question: "发布房源需要付费吗？",
        answer:
          "发布房源本身免费。房源信息中「是否需要中介费」标签用于说明房东/中介是否会另行收取中介费用，与平台无关。",
      },
      {
        question: "房源发布后会一直显示吗？",
        answer:
          "不会。发帖时需要自选一个有效期（如 7/15/30 天），到期后房源会自动从公开列表下架，你可以随时重新发布延长展示时间。",
      },
    ],
  },
  {
    category: "举报与内容审核",
    items: [
      {
        question: "发现虚假或重复房源怎么办？",
        answer:
          "可以在房源详情页点击「举报」，选择举报类型并描述情况，内容审核团队会尽快核实处理。",
      },
      {
        question: "评论区出现辱骂或广告内容怎么办？",
        answer: "同样可以举报该评论，审核通过后会被隐藏，情节严重的账号可能会受到限制。",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <PageContainer className="max-w-3xl py-12">
      <h1 className="text-ink font-serif text-3xl font-semibold">常见问题</h1>
      <div className="mt-8 flex flex-col gap-10">
        {FAQ_GROUPS.map((group) => (
          <section key={group.category}>
            <h2 className="text-brand-700 text-sm font-semibold">{group.category}</h2>
            <div className="mt-2">
              <FaqAccordion items={group.items} />
            </div>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
