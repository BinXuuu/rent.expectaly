import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 必须与 src/lib/supabase/{server,client}.ts 里 cookieOptions.name 保持一致。
 * 体积较大时 Supabase 会把会话拆分为 `sb-auth-token.0` / `.1` 等分片 Cookie，
 * 因此这里用前缀匹配而非精确匹配。
 */
const SUPABASE_COOKIE_NAME_PREFIX = "sb-auth-token";

/**
 * 路由保护（Next.js 16：middleware 已重命名为 proxy）。
 * 仅做「是否存在会话 Cookie」的轻量校验，具体角色/权限判断在页面层
 * 通过 getCurrentProfile() + lib/permissions 完成，避免在 Proxy 中引入数据访问逻辑。
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies
    .getAll()
    .some((c) => c.name.startsWith(SUPABASE_COOKIE_NAME_PREFIX));

  if (!hasSession) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/listings/new", "/admin/:path*"],
};
