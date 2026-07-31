"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginWithEmail } from "@/lib/auth/actions";
import type { AuthActionState } from "@/lib/auth/types";

const INITIAL_STATE: AuthActionState = {};

export interface LoginFormProps {
  redirectTo?: string;
  errorMessage?: string;
}

export function LoginForm({ redirectTo, errorMessage }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(loginWithEmail, INITIAL_STATE);

  return (
    <div className="flex flex-col gap-6">
      {errorMessage && (
        <p className="border-warning-200 bg-warning-50 text-ink-muted rounded-xs border px-3 py-2 text-xs">
          {errorMessage}
        </p>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="redirect" value={redirectTo ?? ""} />
        <Input label="邮箱" name="email" type="email" required placeholder="you@example.com" />
        <Input
          label="密码"
          name="password"
          type="password"
          required
          error={state.error}
        />
        <Button type="submit" variant="primary" isLoading={pending}>
          登录
        </Button>
      </form>

      <p className="text-ink-muted text-center text-sm">
        还没有账号？
        <Link href="/auth/register" className="text-brand-700 underline">
          立即注册
        </Link>
      </p>
    </div>
  );
}
