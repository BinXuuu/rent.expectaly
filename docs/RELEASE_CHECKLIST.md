# 发布检查清单（RELEASE_CHECKLIST）

> 状态：Stage 10 完成实现。本清单用于在真正对接生产环境（真实 Supabase 项目 + 真实域名）前逐项核实，**当前项目尚未执行任何真实部署**，以下大部分条目仍处于"代码/文档已就绪，等待具备权限的人员执行"状态。

## 1. 代码质量

- [x] `npm run lint` 通过，无 ESLint 报错
- [x] `npm run typecheck` 通过，无 TypeScript 类型错误
- [x] `npm run format:check` 通过（Prettier + `prettier-plugin-tailwindcss`）
- [x] `npm run test` 通过：6 个 Vitest 单元测试文件，33 个用例（权限矩阵、定价服务、房源生命周期服务、联系方式揭示服务、mock 数据完整性）
- [x] `npm run test:e2e` 通过：8 个 Playwright 用例文件，36 个用例 × 3 个浏览器项目（chromium / firefox / mobile-chrome）= 108 个用例，含 `@axe-core/playwright` 无障碍检查
- [x] `npm run build` 生产构建通过
- [ ] `npm audit`：当前存在 3 个已知漏洞（1 中 2 高，均来自 `next`/`sharp`/`postcss` 传递依赖，修复需要 `next` 主版本降级，暂不处理，上线前应重新评估或等待上游修复版本)
- [ ] 移除或收紧 `src/components/auth/LoginForm.tsx` 中的"开发环境快捷登录"演示面板（`loginAsDemoProfile` Server Action）——**上线前必须处理，绝不能出现在生产环境**

## 2. 环境变量

- [ ] 生产环境 `.env` 中 `NEXT_PUBLIC_SITE_URL` 设为 `https://rent.expectaly.com`
- [ ] `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` 已在真实 Supabase 项目创建后正确配置（当前代码仍读取 `src/data/mock/`，**尚未接入**，见 `docs/DEPLOYMENT.md` 第 8 节）
- [ ] 确认 `SUPABASE_SERVICE_ROLE_KEY` 未加 `NEXT_PUBLIC_` 前缀、未出现在任何客户端可见代码中
- [ ] `.env.example` 与实际读取的环境变量保持同步（详见 `docs/DEPLOYMENT.md` 第 5 节分级清单）

## 3. 身份认证与权限（4 角色）

- [ ] 游客（未登录）无法访问 `/account/*`、`/listings/new`、`/admin/*`，均正确重定向到登录页
- [ ] 普通用户（`user`）可发布/编辑/下架自己的房源，不能编辑他人房源（跨用户编辑应返回 404，见 `src/app/account/listings/[id]/edit/page.tsx` 的 `publisherId !== profile.id` 检查）
- [ ] 普通用户无法通过直接 URL 访问任何 `/admin/*` 页面
- [ ] 内容审核员（`content_reviewer`）可访问举报/房源/评论审核页面，但**不能**访问用户管理、城市管理、系统设置、角色管理、审计日志（`content_reviewer` 在本项目权限矩阵中不持有任何 `*:manage` 类管理员专属权限，与「意购」`customer_service` 的部分只读权限不同）
- [ ] 管理员（`admin`）可访问全部 `/admin/*` 页面
- [ ] 5 个管理员专属页面（`/admin/users`、`/admin/cities`、`/admin/settings`、`/admin/roles`、`/admin/audit-logs`）均具备页面级 `can(profile.roles, "xxx:manage")` 二次校验，不仅依赖 `admin/layout.tsx` 的角色族校验
- [ ] 本项目**无 super_admin 越权后门**概念，确认所有权限检查均基于 `ROLE_PERMISSIONS` 矩阵加法运算，无任何硬编码绕过分支

## 4. 数据库与 RLS

- [ ] `supabase/migrations/0001_extensions_and_core.sql` 至 `0005_row_level_security.sql`（共 5 个文件）已在**非生产** Supabase 项目按顺序完整执行并验证无报错
- [ ] `listings` 表的 select 策略已验证：仅 `status = 'published' AND expires_at > now()` 的房源对匿名/普通用户可见（编码了"到期自动下架"语义）
- [ ] `comments` 表的 select 策略已验证：仅 `status = 'visible'` 的评论对普通用户可见
- [ ] 已分别以匿名、普通用户、内容审核员、管理员身份发起最小化验证查询，确认策略行为与 `src/lib/permissions/matrix.ts` 一致（`0005_row_level_security.sql` 目前仍为草案，未在真实项目验证过）
- [ ] 若使用 `docs/SEED_DATA_IMPORT.md` / `scripts/generate-seed-sql.ts` 导入种子数据，确认仅用于测试/演示环境，**未混入生产项目**
- [ ] 房源到期的定时下架任务（`pg_cron` 或边缘函数轮询）已设计并验证（当前 `listing-lifecycle-service.ts` 仅为只读判断函数，无真实定时任务）

## 5. 内容合规与法务

- [ ] 全部法律文本（`src/app/legal/[slug]/page.tsx` 中的 5 篇文档：服务条款、隐私政策、社区准则、免责声明、举报处理规范）已交由法务团队审阅并替换为正式文本
- [ ] 已再次确认代码库中**不存在**任何购物车/订单/支付/交易相关的路由、组件或文案（对照 `docs/NO_TRANSACTION_POLICY.md` 自查清单逐条勾选）
- [ ] 举报（`reports`）处理流程、审计日志（`audit_logs`）记录已从界面演示对接为真实数据库写入
- [ ] 「获取联系方式」限流（`contact-reveal-service.ts`）已从只读判断对接为真实事件写入（当前不会真正写入新的 `contact_reveal_events` 记录）

## 6. 域名与基础设施

- [ ] 托管平台（建议 Vercel）已绑定自定义域名 `rent.expectaly.com`
- [ ] `expectaly.com` DNS 服务商已新增 CNAME/A 记录指向托管平台（**需由拥有该域名管理权限的人员执行**）
- [ ] HTTPS 证书已自动签发成功
- [ ] 若启用跨子域账号互通（`MAIN_SITE_SSO_ENABLED`），已与主站及「意购」团队协调统一的 Cookie 签发/校验密钥，并确认会话 Cookie 名 `expectaly_rent_session` 与「意购」的 `expectaly_session`、主站会话互不冲突

## 7. SEO 与内容

- [x] `src/app/sitemap.ts` / `src/app/robots.ts` 已实现
- [ ] 生产环境下 `sitemap.xml` / `robots.txt` 返回 200 且内容正确（使用真实 `NEXT_PUBLIC_SITE_URL`）
- [ ] 首页、`/listings`、任一房源详情页的 `<title>` / `<meta description>` 已人工核实无占位符残留
- [ ] 房源图片当前为 `PlaceholderImage` CSS 占位块，正式上线前应替换为真实图片存储方案（`STORAGE_PROVIDER` / `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` 尚未接入）

## 8. 监控与备份

- [ ] 已配置生产环境错误监控/日志采集（当前项目未内置任何 APM/日志上报代码）
- [ ] 数据库自动备份策略已在 Supabase 项目侧配置（项目管理范畴，非本代码库范围）
- [ ] 本地开发阶段的 11 次阶段性备份（`stage-00` 至 `stage-10`）均已确认存在于 `D:\网页备份\意料之中-意租`

## 9. 发布前冒烟测试（人工核实）

- [ ] 首页、`/listings`、任一房源详情页可正常访问，标题/描述正确渲染
- [ ] `sitemap.xml`、`robots.txt` 返回 200
- [ ] 登录页可访问，演示账号快捷登录面板已移除或权限收紧
- [ ] `/admin`、`/account`、`/listings/new` 在未登录时正确重定向到登录页
- [ ] 已过期/已下架/草稿房源在公开页面均正确返回 404
- [ ] 「获取联系方式」按钮正确返回发帖人（而非查看者）的联系方式
- [ ] 确认代码库中不存在任何购物车/订单/支付相关的路由或文案

## 10. 回滚预案

- [ ] 托管平台支持一键回滚到上一个正常部署版本（Vercel 默认支持，自托管需确认 CI/CD 流程具备回滚能力）
- [ ] 数据库迁移变更均为向前追加（`0001`~`0005` 顺序编号），如需回滚数据库结构需人工评估是否需要编写对应的 `down` 迁移
- [ ] 已记录本次发布对应的 Git commit / 版本号（`package.json` `"version": "0.10.0"`），便于回滚定位

---

**当前状态总结**：本清单第 1 节（代码质量）中的自动化验证项已全部完成并通过；第 2-10 节涉及真实 Supabase 项目创建、真实域名 DNS 变更、法务审阅、真实监控接入等超出 Stage 00-10 开发范围的事项，均标记为待办，需由具备相应权限的人员在真实环境中执行。
