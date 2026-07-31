"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buttonClasses } from "@/components/ui/Button";
import { revealContact, type RevealContactResult } from "@/lib/actions/contact-reveal-actions";

export interface ContactRevealButtonProps {
  listingId: string;
  isLoggedIn: boolean;
}

/** 「获取联系方式」按钮：未登录跳转登录页；登录后调用服务端动作，受限流保护。 */
export function ContactRevealButton({ listingId, isLoggedIn }: ContactRevealButtonProps) {
  const [result, setResult] = useState<RevealContactResult | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <Link href="/auth/login" className={buttonClasses("primary", "md")}>
        登录后获取联系方式
      </Link>
    );
  }

  if (result?.ok) {
    return (
      <div className="border-line bg-surface-muted flex flex-col gap-1.5 rounded-xs border p-3 text-sm">
        {result.phone && (
          <span className="text-ink flex items-center gap-2">
            <Phone aria-hidden="true" className="h-4 w-4" />
            {result.phone}
          </span>
        )}
        {result.email && (
          <span className="text-ink flex items-center gap-2">
            <Mail aria-hidden="true" className="h-4 w-4" />
            {result.email}
          </span>
        )}
        {!result.phone && !result.email && (
          <span className="text-ink-muted">发帖人暂未留下联系方式。</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Button
        variant="primary"
        isLoading={isPending}
        onClick={() => {
          startTransition(async () => {
            const r = await revealContact(listingId);
            setResult(r);
          });
        }}
      >
        获取联系方式
      </Button>
      {result?.ok === false && <p className="text-danger-900 text-xs">{result.error}</p>}
    </div>
  );
}
