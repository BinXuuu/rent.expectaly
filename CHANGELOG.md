# 更新日志（CHANGELOG）

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 约定。

## [0.11.0] — 新增「出租 / 出售」房源类别

### 新增

- `Listing` 类型新增 `purpose: "rent" | "sale"` 字段，房源现分「出租」「出售」两种类别，共用同一套页面与标签体系
- 发布/编辑表单新增「类别」选择器，按类别条件渲染押金条款、最短租期、可养宠物等仅出租适用的字段，房型选择器在出售类别下锁定为「整租」
- `/listings` 筛选页新增「类别」筛选下拉，价格区间与排序文案泛化为出租/出售通用表述
- 首页新增「出售房源」精选分区；hero 文案、`/about`、`/faq`、根布局 SEO 描述同步覆盖出租与出售两种表述
- 演示数据新增 3 条出售房源（米兰精装两室、佛罗伦萨独栋别墅、博洛尼亚待审核房源）
- `docs/NO_TRANSACTION_POLICY.md` 新增第 4 节，明确无交易政策同等且更严格适用于出售类别（不做定金/房款支付、过户代办等）

### 变更

- `monthlyRent`/`cnyReferenceRent` 字段重命名为 `price`/`cnyReferencePrice`（出租为月租、出售为总价）；`minLeaseTermMonths` 由必填改为可空
- `RentPrice.tsx` 重命名为 `ListingPrice.tsx`，按类别区分价格展示
- `supabase/migrations/0002_listings.sql` 新增 `purpose` 列，价格相关列同步重命名，`min_lease_term_months` 改为可空列
- `scripts/generate-seed-sql.ts` 同步更新列名映射

## [0.10.0] — Stage 10 发布准备

### 新增

- `docs/DEPLOYMENT.md` 全量重写：本地开发、托管平台建议、域名与 DNS 说明、环境变量分级清单（无支付/微信相关配置）、构建发布流程、发布后冒烟测试清单、接入真实 Supabase 的后续工程步骤
- `scripts/generate-seed-sql.ts`：覆盖全部 12 张表的种子 SQL 生成器，基于 `node:crypto` SHA-1 的确定性 UUID v5 映射，`npm run db:seed:sql` 运行
- `docs/SEED_DATA_IMPORT.md`：种子数据导入说明与已知限制
- `docs/RELEASE_CHECKLIST.md`：10 节发布检查清单（代码质量/环境变量/权限/RLS/合规/域名/SEO/监控/冒烟测试/回滚）
- `CHANGELOG.md`：本文件

### 验证

- `npm run db:seed:sql` 成功生成 `supabase/seed/generated-seed.sql` 并人工核对无误

## [0.9.0] — Stage 09 测试

### 新增

- `playwright.config.ts`：chromium / firefox / mobile-chrome 三项目配置，端口 3201，`expect.timeout` 提升至 10s 以吸收 Turbopack 首次编译延迟
- `tests/e2e/utils/auth.ts` 及 8 个端到端用例文件：`homepage` / `listings` / `auth-login` / `account-journey` / `admin-portal` / `navigation-drawer` / `accessibility` / `seo`，共 36 个用例 × 3 浏览器 = 108 个用例
- `@axe-core/playwright` 无障碍自动化检查接入
- `docs/TEST_CHECKLIST.md` 全量重写

### 修复

- 4 处 Playwright 选择器歧义（`listings.spec.ts` 标题选择器加 `level: 1`；`auth-login.spec.ts`/`admin-portal.spec.ts` 改用 `getByRole("link")`；`account-journey.spec.ts` 加 `exact: true`），均为测试代码自身问题，非应用缺陷

## [0.8.0] — Stage 08 管理员后台

### 新增

- `/admin/users`、`/admin/cities`、`/admin/settings`、`/admin/roles`、`/admin/audit-logs` 五个管理员专属页面
- 每个页面均具备独立的 `can(profile.roles, "xxx:manage")` 页面级权限二次校验，而非仅依赖布局层的角色族校验——因 `content_reviewer` 角色不持有任何管理员专属权限
- `docs/ROUTES.md` 更新

## [0.7.0] — Stage 07 内容审核后台

### 新增

- `src/lib/services/compliance-service.ts` 合规服务及单元测试
- `src/components/admin/{AdminNav,ReviewDialog}.tsx`
- `/admin`、`/admin/reports`、`/admin/listings`、`/admin/comments` 审核相关页面
- `supabase/migrations/0005_row_level_security.sql`：RLS 策略草案，`listings` 同时校验发布状态与到期时间，`comments` 仅暴露可见状态

### 变更

- `docs/COMPLIANCE.md`、`docs/DATABASE_SCHEMA.md`（RLS 章节）全量重写

## [0.6.0] — Stage 06 评论与收藏互动

### 新增

- `src/lib/actions/contact-reveal-actions.ts`：「获取联系方式」Server Action，返回发帖人（而非查看者）的联系方式，登录门槛 + 限流
- `src/components/listing/{ContactRevealButton,FavoriteButton,CommentsSection}.tsx`
- 房源详情页接入以上三个交互组件

## [0.5.0] — Stage 05 发布与我的房源管理

### 新增

- `src/components/listing/{ListingForm,ListingRowActions}.tsx`
- `/listings/new`（发布房源）、`/account/listings`（我的房源列表）、`/account/listings/[id]/edit`（编辑房源，含跨用户编辑的所有权校验）

## [0.4.0] — Stage 04 登录与用户中心

### 新增

- `src/lib/auth/{types,session,actions}.ts`：会话管理，Cookie 名 `expectaly_rent_session`
- `src/components/auth/{LoginForm,RegisterForm}.tsx`、`/auth/login`、`/auth/register`
- `/account` 用户中心：概览、收藏、评论、设置四个子页面
- `docs/MAIN_SITE_INTEGRATION.md` 重写

## [0.3.0] — Stage 03 公开页面

### 新增

- `/listings`（房源列表，含移动端筛选抽屉）、`/listings/[id]`（房源详情）
- `/cities`、`/cities/[slug]`（10 个意大利城市）
- `/about`、`/faq`、`/legal/[slug]`（5 篇法律文档占位）
- `sitemap.ts`、`robots.ts`
- 首页全量重写

### 修复

- 首页城市名称查找表 `cityNameById` 此前基于已截断为前 6 个的热门城市列表构建，导致排名 6 名以外的城市（如帕尔马）在房源卡片上无法显示城市标签；修复为先从完整城市列表构建映射，再截断用于展示

## [0.2.0] — Stage 02 设计系统

### 新增

- 设计令牌（`globals.css`，与「意购」保持视觉一致）
- 基础 UI 组件库：`Button`/`Input`/`Textarea`/`Select`/`Badge`/`Dialog`/`Drawer`
- 布局组件：`Header`/`Footer`/`MobileMenu`/`LanguageSwitcher`
- 房源卡片、城市卡片等共享组件
- `/internal/ui-kit` 组件预览页

### 修复

- `scripts/backup-stage.ps1` / `scripts/safety-check.ps1` 缺失 UTF-8 BOM 导致 Windows PowerShell 5.1 在系统默认代码页下误解析中文字符与转义引号，报"字符串缺少终止符"等错误；重新以 `Set-Content -Encoding UTF8` 保存修复（与「意购」项目 `restart-dev.bat` 问题同根因）

## [0.1.0] — Stage 01 架构、类型与数据层

### 新增

- 完整类型层（`src/types/`，13 个文件）
- 权限矩阵与守卫（`src/lib/permissions/`）：4 角色（`guest`/`user`/`content_reviewer`/`admin`）加法式权限矩阵，无 super_admin 越权概念
- Mock 数据层（`src/data/mock/`，10 个文件）与仓储层（`src/lib/repositories/`，11 个文件）
- 定价、房源生命周期、联系方式揭示三个领域服务
- `supabase/migrations/0001`~`0004`：核心表结构、信任与安全、系统设置迁移
- Vitest 单元测试基础设施

## [0.0.1] — Stage 00 项目初始化

### 新增

- 项目脚手架：Next.js 16 + React 19 + TypeScript strict + Tailwind CSS v4 + ESLint 9 + Prettier
- `docs/` 全套文档骨架：`PROJECT_REQUIREMENTS`/`NO_TRANSACTION_POLICY`/`ARCHITECTURE`/`DATABASE_SCHEMA`/`ROLES_AND_PERMISSIONS`/`ROUTES`/`COMPLIANCE`/`MAIN_SITE_INTEGRATION`/`DEPLOYMENT`/`TEST_CHECKLIST`/`PROGRESS`
- `scripts/safety-check.ps1`、`scripts/backup-stage.ps1`：阶段性备份基础设施，备份目标 `D:\网页备份\意料之中-意租`
- `docs/NO_TRANSACTION_POLICY.md`：将"无交易机制"确立为一等架构原则，附自查清单
