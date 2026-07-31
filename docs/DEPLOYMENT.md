# 部署文档（DEPLOYMENT）

> 状态：Stage 10 已完成。本文档为部署指导说明，**不代表任何已执行的真实部署、DNS 变更或 Supabase 项目创建**——本项目全程仅在本地文件系统内开发，未连接任何真实生产资源。以下步骤需由具备相应权限的人员在真实环境中手动执行并自行核实。

## 1. 本地开发

```bash
npm install
npm run dev            # 默认端口 3000；本地联调建议 npm run dev -- -p 3200 -H 0.0.0.0，与「意购」项目的 3100 区分
```

## 2. 常用命令

```bash
npm run lint            # ESLint 检查
npm run typecheck       # TypeScript 类型检查
npm run format           # Prettier 格式化（写入）
npm run format:check     # Prettier 检查（不写入）
npm run test             # Vitest 单元测试
npm run test:watch       # Vitest 监听模式
npm run test:e2e         # Playwright 端到端测试（chromium + firefox + mobile-chrome）
npm run test:e2e:ui      # Playwright 交互式 UI 模式
npm run build            # 生产构建
npm run start            # 生产模式本地启动（需先 build）
```

## 3. 托管平台建议

推荐 **Vercel**（Next.js 官方托管平台，对 App Router / Server Actions / Turbopack 构建支持最完整，零额外配置即可获得边缘缓存与图片优化）。若选择自托管（如 Node.js 服务器 + `next start`，或容器化部署），需自行处理：

- Node.js ≥ 20（与 `package.json` 的 `@types/node ^20` 保持一致）
- 反向代理（Nginx/Caddy）配置 HTTPS 终止与 `X-Forwarded-*` 头透传
- 进程守护（PM2/systemd）与零停机发布策略

本项目未内置对特定托管平台的绑定代码，两种路径均可行。

## 4. 域名与 DNS（说明，非已执行操作）

目标域名：`rent.expectaly.com`（`expectaly.com` 主站的子域名，与「意购」项目的 `shop.expectaly.com` 属同一品牌家族）。

1. 在托管平台绑定自定义域名 `rent.expectaly.com`。
2. 在 `expectaly.com` 的 DNS 服务商处新增一条 CNAME（或平台要求的 A/ALIAS）记录，指向托管平台提供的目标地址。
3. 确认 HTTPS 证书自动签发成功（Vercel/多数平台通过 Let's Encrypt 自动完成）。
4. 若后续接入跨子域账号互通（见 `docs/MAIN_SITE_INTEGRATION.md`），登录态 Cookie 需设置 `Domain=.expectaly.com`，需与主站及「意购」团队协调统一的 Cookie 签发/校验密钥（注意本项目会话 Cookie 名为 `expectaly_rent_session`，与「意购」的 `expectaly_session` 不同，避免同一浏览器下两站会话互相覆盖）。

**此步骤涉及主站 `expectaly.com` 的真实 DNS 记录变更，必须由拥有该域名管理权限的人员执行，本项目/本会话不会也不能代为操作。**

## 5. 环境变量清单

按"上线是否必需"分级；完整字段定义见 `.env.example`（不含任何真实密钥）。

### 5.1 必需（缺失将导致构建或运行异常）

| 变量                         | 说明                                                                                    |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_NAME`      | 站点中文名，缺省回退 `"意料之中～意租"`                                                 |
| `NEXT_PUBLIC_SITE_URL`       | 生产环境应设为 `https://rent.expectaly.com`，用于 `metadataBase`、sitemap 绝对 URL 拼接 |
| `NEXT_PUBLIC_MAIN_SITE_URL`  | 主站地址，用于页脚"前往主站"链接，缺省 `https://expectaly.com`                          |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | 默认语言，第一期固定 `zh-CN`                                                            |

### 5.2 接入真实 Supabase 后必需

| 变量                            | 说明                                                                                                        |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase 项目 URL                                                                                           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 客户端匿名密钥（受 RLS 保护，可暴露给浏览器）                                                               |
| `SUPABASE_SERVICE_ROLE_KEY`     | 服务端专用密钥，**绝不可**加 `NEXT_PUBLIC_` 前缀暴露给客户端，仅限服务端 Route Handler / Server Action 使用 |

**当前代码尚未读取以上三个变量**（`src/lib/repositories/` 仍基于 `src/data/mock/` 内存数据）。接入真实 Supabase 属于超出 Stage 00-10 范围的后续工程，见第 8 节。

### 5.3 联系方式限流与主站互通（可调整，非必须）

| 变量                                                       | 说明                                                                        |
| ---------------------------------------------------------- | --------------------------------------------------------------------------- |
| `CONTACT_REVEAL_RATE_LIMIT_WINDOW_SECONDS`                 | 「获取联系方式」限流窗口（秒），当前由 `system_settings` 演示数据提供默认值 |
| `CONTACT_REVEAL_RATE_LIMIT_MAX_REQUESTS`                   | 限流窗口内允许的最大次数                                                    |
| `MAIN_SITE_SSO_ENABLED` / `MAIN_SITE_SHARED_COOKIE_DOMAIN` | 主站账号互通开关，详见 `docs/MAIN_SITE_INTEGRATION.md`                      |

**本项目不存在支付/微信登录等功能开关**（见 `docs/NO_TRANSACTION_POLICY.md`），因此环境变量清单显著短于「意购」项目。

### 5.4 预留（第一期未接入真实服务，暂不影响运行）

`EXCHANGE_RATE_API_URL` / `EXCHANGE_RATE_API_KEY`（汇率服务，当前用后台可配置的手动汇率）、`EMAIL_PROVIDER` / `EMAIL_FROM`（当前为开发环境控制台占位）、`STORAGE_PROVIDER` / `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`（图片当前为 `PlaceholderImage` 占位，未接入真实存储）。

## 6. 构建与发布流程

```bash
npm ci                 # 使用 lockfile 精确安装依赖（CI/生产环境优先于 npm install）
npm run lint
npm run typecheck
npm run test
npm run build
```

全部通过后再执行平台的部署命令（如 Vercel 的 `vercel deploy --prod`，或自托管场景的容器构建/发布流程）。**不建议跳过以上任一验证步骤直接发布。**

## 7. 发布后冒烟测试（人工核实清单）

部署完成后，建议人工核实（也可参考 `tests/e2e/` 中已有的 Playwright 用例，将 `baseURL` 指向生产地址后有选择地重跑只读、无副作用的用例）：

- [ ] 首页、`/listings`、任一房源详情页可正常访问，标题/描述正确渲染
- [ ] `sitemap.xml`、`robots.txt` 返回 200 且内容正确
- [ ] 登录页可访问，演示账号快捷登录（**上线前应移除或权限收紧，见第 8 节**）
- [ ] `/admin`、`/account`、`/listings/new` 在未登录时正确重定向到登录页
- [ ] 已过期/已下架/草稿房源在公开页面均正确返回 404
- [ ] 「获取联系方式」按钮正确返回发帖人（而非查看者）的联系方式
- [ ] 确认代码库中不存在任何购物车/订单/支付相关的路由或文案（见 `docs/NO_TRANSACTION_POLICY.md` 自查清单）

## 8. 接入真实 Supabase 项目（后续工程，超出本阶段范围）

1. 创建 Supabase 项目，记录 `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`。
2. 按顺序执行 `supabase/migrations/0001_extensions_and_core.sql` 至 `0005_row_level_security.sql`（依赖顺序编号，见 `docs/DATABASE_SCHEMA.md` 的迁移文件清单）。
3. 核实 RLS 策略：以匿名/普通用户/内容审核员/管理员分别发起最小化验证查询，确认策略行为与 `src/lib/permissions/matrix.ts` 一致（`0005_row_level_security.sql` 为草案，尚未在真实项目验证，务必先在非生产项目完整测试）。
4. 参考 `docs/SEED_DATA_IMPORT.md` 与 `scripts/generate-seed-sql.ts` 生成初始种子数据（可选，仅用于演示/测试环境）。
5. 将 `src/lib/repositories/*.ts` 中基于 `src/data/mock/` 的实现逐个替换为读取 Supabase 的实现，保持 `ReadRepository<T>` 接口不变（见 `src/lib/repositories/base.ts` 注释）。
6. 将 `src/lib/auth/session.ts` 替换为读取 Supabase Auth Session 的适配层，保持 `getCurrentProfile()` 签名不变。
7. 设计房源到期的定时下架任务（Supabase `pg_cron` 或边缘函数轮询，将 `status = 'published' and expires_at <= now()` 的房源批量置为 `expired`）。
8. **移除或严格限制** `src/components/auth/LoginForm.tsx` 中的「开发环境快捷登录」面板与 `loginAsDemoProfile` Server Action——这是第一期开发/演示专用功能，绝不能出现在真实生产环境。
9. 实现「获取联系方式」限流的真实事件写入（当前 `contact-reveal-service.ts` 只做只读判断，未写入新的 `contact_reveal_events` 记录）。

## 9. 已知限制（务必在发布前重新确认）

- 主站账号互通为功能开关关闭状态，且底层无真实第三方接入；本项目无微信登录/支付等其他功能开关。
- 房源图片为 CSS 占位块，无真实图片资源。
- 全部法律文本为「待法律顾问审核」的模板，正式发布前必须经法务团队审阅替换。
- 房源到期后的定时下架目前只是服务层的只读判断函数，真实的数据库定时任务将在接入真实 Supabase 项目时设计。
- 审计日志、举报处理、房源/评论下架-隐藏等后台操作仍为界面演示，未接入真实数据库写入。
- 再次确认：本项目代码库中不存在任何购物车/订单/支付相关实现，符合「不允许在平台内交易」的核心需求（见 `docs/NO_TRANSACTION_POLICY.md`）。
