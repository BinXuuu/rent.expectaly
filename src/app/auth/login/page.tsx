import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentProfile } from "@/lib/auth/session";
import { safeRedirectPath } from "@/lib/auth/types";

export const metadata: Metadata = {
  title: "登录",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectTo } = await searchParams;

  const currentProfile = await getCurrentProfile();
  if (currentProfile) {
    redirect(safeRedirectPath(redirectTo));
  }

  return (
    <PageContainer className="max-w-md py-16">
      <h1 className="text-ink font-serif text-2xl font-semibold">登录</h1>
      <p className="text-ink-muted mt-2 text-sm">
        与 expectaly.com 主站账号互通，可直接使用主站的邮箱和密码登录。
      </p>
      <div className="mt-8">
        <LoginForm redirectTo={redirectTo} />
      </div>
    </PageContainer>
  );
}
