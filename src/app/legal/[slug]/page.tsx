import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";

interface LegalDocument {
  slug: string;
  title: string;
  version: string;
  effectiveAt: string;
  body: string;
}

/**
 * 第一期法律文本模板，均为初始草稿，正式上线前需法务顾问审核（见 docs/COMPLIANCE.md）。
 * 未接入独立的 legal_documents 数据层，因内容为纯静态文本，暂不建立完整仓库/服务层。
 */
const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    slug: "user-agreement",
    title: "用户协议",
    version: "0.1",
    effectiveAt: "2026-07-01",
    body:
      "本协议规范你使用「意料之中～意租」平台的行为。平台仅提供房源信息展示、评论、收藏与举报等功能，" +
      "不参与任何形式的平台内交易。你在使用本平台时应遵守相关法律法规，不得发布虚假、欺诈或违法内容。",
  },
  {
    slug: "privacy-policy",
    title: "隐私政策",
    version: "0.1",
    effectiveAt: "2026-07-01",
    body:
      "本平台仅收集运营所必需的账号信息（邮箱/手机号）与你自愿填写的房源联系方式。联系方式仅在你" +
      "同意展示后，向登录用户点击「获取联系方式」按钮后展示，并会记录点击事件用于滥用防范。",
  },
  {
    slug: "disclaimer",
    title: "免责声明",
    version: "0.1",
    effectiveAt: "2026-07-01",
    body:
      "房源信息由用户自主发布，平台不核实房源真实性、房东身份、合同条款及标价的准确性，也不对线下" +
      "看房、签约、付款、履约过程中产生的任何纠纷或损失承担责任。请租客自行核实相关信息并审慎决策。",
  },
  {
    slug: "content-guidelines",
    title: "内容发布规范",
    version: "0.1",
    effectiveAt: "2026-07-01",
    body:
      "禁止发布虚假房源、重复发布已下架房源、含歧视性或辱骂性语言的描述、以及任何形式的广告垃圾信息。" +
      "违反规范的房源或评论将被内容审核团队下架或隐藏，情节严重的账号可能被限制发帖或评论权限。",
  },
  {
    slug: "report-handling-policy",
    title: "举报处理规则",
    version: "0.1",
    effectiveAt: "2026-07-01",
    body:
      "举报提交后由内容审核员核实处理，处理结果分为「已处理」「已驳回」「已下架」三种。恶意举报或" +
      "虚假举报同样可能受到账号层面的限制。",
  },
];

interface LegalPageProps {
  params: Promise<{ slug: string }>;
}

function findDocument(slug: string): LegalDocument | undefined {
  return LEGAL_DOCUMENTS.find((doc) => doc.slug === slug);
}

export async function generateStaticParams() {
  return LEGAL_DOCUMENTS.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const document = findDocument(slug);
  if (!document) {
    return { title: "页面不存在" };
  }
  return {
    title: document.title,
    robots: { index: false, follow: true },
    alternates: { canonical: `/legal/${slug}` },
  };
}

export default async function LegalDocumentPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const document = findDocument(slug);

  if (!document) {
    notFound();
  }

  return (
    <PageContainer className="max-w-3xl py-12">
      <div className="border-warning-200 bg-warning-50 mb-8 flex items-start gap-3 rounded-xs border p-4">
        <AlertTriangle aria-hidden="true" className="text-warning-900 mt-0.5 h-4 w-4 shrink-0" />
        <p className="text-ink-muted text-xs leading-5">
          本文档为初始模板，尚未经过法律顾问审核，不构成正式法律意见。正式发布前将由法务团队审阅并替换为最终文本。
        </p>
      </div>
      <h1 className="text-ink font-serif text-3xl font-semibold">{document.title}</h1>
      <p className="text-ink-faint mt-2 text-xs">
        版本 {document.version} · 生效日期 {document.effectiveAt}
      </p>
      <p className="text-ink-muted mt-8 text-sm leading-8 whitespace-pre-line">{document.body}</p>
    </PageContainer>
  );
}
