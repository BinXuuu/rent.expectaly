# 主站账号互通文档（MAIN_SITE_INTEGRATION）

> 状态：Stage 04 更新，记录第一期本地开发替代方案的实际实现；正式接入方案待定，本次不得直接修改 expectaly.com 主站或「意购」项目。

## 1. 目标架构（三种方案，第一期不实施，仅记录方向）

1. **共享 Supabase 项目**（推荐）：与主站/「意购」共用同一个 Supabase 项目的 `auth.users`，`profiles` 表增加 `site_origin` 或角色区分字段。
2. **共享用户库，独立认证服务**：各站点通过内部 API 校验/同步用户身份。
3. **统一认证服务 / 跨子域 SSO**：独立的 SSO 服务签发跨子域 Cookie（`.expectaly.com` 域），各子站验证 Token。

## 2. 子域与品牌关系

- 主站：`expectaly.com`
- 商城：`shop.expectaly.com`（「意购」项目）
- 租房：`rent.expectaly.com`（本项目）
- 三者共享「意料之中」品牌视觉语言，但账号体系、数据库、代码库第一期均为独立。

## 3. 第一期本地开发替代方案（已实现）

- **会话层**（`src/lib/auth/session.ts`）：单个 Cookie（`expectaly_rent_session`，与「意购」项目的 `expectaly_session` 使用不同名称，避免同一浏览器下两个子站会话互相覆盖）承载会话标识，未加密签名，仅限开发环境使用。`getCurrentProfile()` 是唯一读取入口，签名与「意购」项目保持一致，便于未来无缝切换为 Supabase Auth。
- **登录方式**（`src/lib/auth/actions.ts`）：邮箱/手机号模拟登录（手机号验证码为开发环境固定值 `123456`，明确提示未接入真实短信网关）、覆盖 3 种登录角色（普通用户/内容审核员/管理员）的演示账号快捷登录、开发环境临时账号注册（不落库，仅写入会话 Cookie）。
- **路由保护**（`src/proxy.ts`）：拦截 `/account/**`、`/listings/new`、`/admin/**`，未登录重定向到 `/auth/login?redirect=<原路径>`，登录后通过共享的 `safeRedirectPath()` 校验防止开放重定向。
- **本项目不做**：微信登录 provider（`AuthProvider` 类型中不含 `wechat`，因业务侧未规划微信登录）；`/auth/callback` OAuth 回调路由骨架（因当前无任何第三方 OAuth provider 需要占位，待未来接入主站 SSO 时再补充）。

## 4. 待补充

- 跨子域安全细节、用户 ID 映射方案、角色同步机制、退出登录同步：待确定共享 Supabase 项目方案后设计
- 主站 SSO 回调路由：待方案确定后补充 `/auth/callback`
