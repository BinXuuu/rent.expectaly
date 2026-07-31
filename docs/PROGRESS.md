# 项目进度文档（PROGRESS）

本文件记录各阶段的完成情况、验证结果与备份位置。严格按以下阶段顺序执行，每阶段完成、验证通过并成功备份后才进入下一阶段。

## 阶段列表

- [x] Stage 00：环境检查与项目初始化
- [x] Stage 01：架构、类型与模拟数据层
- [x] Stage 02：设计系统
- [x] Stage 03：公开页面
- [x] Stage 04：登录与用户中心
- [x] Stage 05：发布房源与我的房源管理
- [x] Stage 06：评论与收藏
- [x] Stage 07：举报与内容审核后台
- [x] Stage 08：平台管理后台
- [x] Stage 09：完整测试与优化
- [x] Stage 10：发布准备
- [x] 功能增补 01：新增「出租 / 出售」房源类别（Stage 10 完成后，第一期发布前追加）

---

## 备份记录汇总

> 由 `scripts/backup-stage.ps1` 自动追加，最新记录在最上方。请勿手动改变 `BACKUP_LOG_START` / `BACKUP_LOG_END` 标记。

<!-- BACKUP_LOG_START -->

- [20260726-062336] 阶段 "fix-01-homepage-left-align" 已备份至: D:\网页备份\意料之中-意租\fix-01-homepage-left-align-20260726-062336

- [20260724-050916] 阶段 "feature-01-rent-sale-category" 已备份至: D:\网页备份\意料之中-意租\feature-01-rent-sale-category-20260724-050916

- [20260723-231005] 阶段 "stage-10-release-prep" 已备份至: D:\网页备份\意料之中-意租\stage-10-release-prep-20260723-231005

- [20260723-225705] 阶段 "stage-09-testing" 已备份至: D:\网页备份\意料之中-意租\stage-09-testing-20260723-225705

- [20260723-224333] 阶段 "stage-08-admin-backend" 已备份至: D:\网页备份\意料之中-意租\stage-08-admin-backend-20260723-224333

- [20260723-223430] 阶段 "stage-07-moderation" 已备份至: D:\网页备份\意料之中-意租\stage-07-moderation-20260723-223430

- [20260723-204300] 阶段 "stage-06-comments-favorites" 已备份至: D:\网页备份\意料之中-意租\stage-06-comments-favorites-20260723-204300

- [20260723-203240] 阶段 "stage-05-listing-management" 已备份至: D:\网页备份\意料之中-意租\stage-05-listing-management-20260723-203240

- [20260723-202416] 阶段 "stage-04-auth-users" 已备份至: D:\网页备份\意料之中-意租\stage-04-auth-users-20260723-202416

- [20260723-201224] 阶段 "stage-03-public-pages" 已备份至: D:\网页备份\意料之中-意租\stage-03-public-pages-20260723-201224

- [20260723-195335] 阶段 "stage-02-design-system" 已备份至: D:\网页备份\意料之中-意租\stage-02-design-system-20260723-195335

- [20260723-194141] 阶段 "stage-01-foundation" 已备份至: D:\网页备份\意料之中-意租\stage-01-foundation-20260723-194141

- [20260723-192725] 阶段 "stage-00-initial" 已备份至: D:\网页备份\意料之中-意租\stage-00-initial-20260723-192725

<!-- BACKUP_LOG_END -->

---

## Stage 00：环境检查与项目初始化

**目标**：搭建可运行的 Next.js + TypeScript + Tailwind 项目骨架，完成基础工具链配置、目录结构、文档骨架与备份机制。项目视觉与工程规范参考「意料之中～意购」项目，但代码库完全独立、路径严格隔离。

### 已完成功能

- 使用 `create-next-app`（App Router + TypeScript + Tailwind + ESLint + Turbopack）生成项目骨架，`package.json` name 为 `expectaly-rent`
- 集成 Prettier（含 `prettier-plugin-tailwindcss`）与 `eslint-config-prettier`，`lint`/`format`/`format:check`/`typecheck` 脚本就绪
- 建立基础目录结构（`components`、`lib`（data/services/repositories/auth/permissions/validation/utils/config）、`types`、`data/mock`、`hooks`、`styles`、`supabase/migrations`、`scripts`、`tests/unit`、`docs`）
- 创建全部 11 份 docs 骨架文档（`PROJECT_REQUIREMENTS`、`NO_TRANSACTION_POLICY`、`ARCHITECTURE`、`DATABASE_SCHEMA`、`ROLES_AND_PERMISSIONS`、`ROUTES`、`COMPLIANCE`、`MAIN_SITE_INTEGRATION`、`DEPLOYMENT`、`TEST_CHECKLIST`、`PROGRESS`）
- 创建 `.env.example`（无真实密钥）
- 创建安全检查脚本 `scripts/safety-check.ps1` 与备份脚本 `scripts/backup-stage.ps1`（严格限定项目目录为 `C:\网站\意料之中-意租`、备份目录为 `D:\网页备份\意料之中-意租`）
- 编写项目 README

### 主要文件

- `package.json`、`tsconfig.json`、`eslint.config.mjs`、`.prettierrc.json`、`.prettierignore`
- `src/app/layout.tsx`、`src/app/page.tsx`
- `docs/*.md`（11 份）
- `.env.example`
- `scripts/backup-stage.ps1`、`scripts/safety-check.ps1`
- `README.md`

### 测试结果

- `npm run lint`：通过，无警告或错误
- `npm run typecheck`：通过
- `npm run build`：通过（Next.js 16.2.11 + Turbopack，`/` 与 `/_not-found` 均预渲染为静态页面）
- `npm run format:check`：首次运行发现 `create-next-app` 生成的 4 个文件未按本项目 Prettier 规则格式化，已执行 `npm run format` 统一修复，复检通过
- 开发服务器手动验证：尚未执行（按计划将在 Stage 02+ 有实际页面内容后进行浏览器验证）

### 已知问题

- 无（`create-next-app` 自动生成了 `AGENTS.md`/`CLAUDE.md`，提示 Next.js 16 相对训练数据存在破坏性变更，后续阶段涉及路由/服务端新特性时会先查阅 `node_modules/next/dist/docs/` 确认最新用法）
- 发现并修复一处真实缺陷：`scripts/backup-stage.ps1` 与 `scripts/safety-check.ps1` 最初以不带 BOM 的 UTF-8 保存，Windows PowerShell 5.1 在没有 BOM 时会按系统默认代码页而非 UTF-8 解析 `.ps1` 文件，导致文件中的中文字符与相邻的反引号转义引号（`` `" ``）被错误解析，报「字符串缺少终止符」的语法错误（与此前「意购」项目 `restart-dev.bat` 因编码问题损坏是同一类根因）。已通过 `Set-Content -Encoding UTF8` 重新保存两个脚本（补齐 BOM），复测 `backup-stage.ps1` 执行成功

### 备份记录

见文首「备份记录汇总」。本阶段最终备份路径：`D:\网页备份\意料之中-意租\stage-00-initial-20260723-192725`

### 下一阶段

Stage 01：架构、类型与模拟数据层 —— 建立核心 TypeScript 类型（房源/用户/评论/收藏/举报等）、角色与权限模型（4 角色）、Repository/Service 数据访问层、演示数据、数据库架构文档细化、Vitest 单元测试基础设施。

---

## Stage 01：架构、类型与模拟数据层

**目标**：建立唯一类型来源、4 角色权限矩阵、Repository/Service 数据访问层、覆盖完整房源生命周期的演示数据、Supabase 迁移 SQL 草案，并引入 Vitest 单元测试基础设施。

### 已完成功能

- **类型层**（`src/types/`，13 个文件 + `index.ts` 统一导出）：覆盖 `docs/DATABASE_SCHEMA.md` 规划的全部实体（`profiles`、`user_roles`、`cities`、`listings`、`listing_images`、`comments`、`favorites`、`contact_reveal_events`、`reports`、`audit_logs`、`system_settings`、`exchange_rates`），统一 `BaseEntity`（id / 时间戳 / 软删除 / 审计字段）基础形状、`LocalizedText`、`Money`/`Currency`（仅 `EUR`/`CNY`）、`Result<T>` 统一返回类型；`Listing` 类型完整覆盖 `docs/PROJECT_REQUIREMENTS.md` 第 5 节全部标签（房型、装修状况、月租双货币、押金条款、中介费、合同、最短租期、入住时间、宠物、家具、交通说明、有效期与过期时间、状态生命周期）
- **角色与权限模型**（`src/lib/permissions/`）：4 个角色的权限矩阵（`matrix.ts`）逐级累加（`guest` ⊂ `user` ⊂ `content_reviewer` ⊂ `admin`），`can()`/`assertPermission()`/`assertOwnsResource()` 等守卫函数（`guards.ts`），`admin` 直接拥有全部权限、不引入「意购」项目中 `super_admin` 那种特殊绕过逻辑；`docs/ROLES_AND_PERMISSIONS.md` 已更新为实际实现文档
- **统一错误格式**（`src/lib/errors/app-error.ts`）：`AppError` 类 + `AppErrorCode` 枚举（含 `RATE_LIMITED`，供联系方式限流场景使用）+ `toAppErrorShape()` 转换函数
- **演示数据**（`src/data/mock/`，10 个文件）：10 个意大利城市（复用「意购」项目已建立的城市集合，独立维护）、5 个演示账号（覆盖 4 种角色）、9 个房源（覆盖草稿/待审核/已发布/已过期/已下架完整生命周期，以及中介费/合同/宠物/家具等标签的多种组合）、评论（含 1 条被隐藏的违规评论示例）、收藏、联系方式获取事件、举报（含房源举报与评论举报两种闭环）、审计日志、系统设置（有效期选项、限流阈值、风险关键词词库）、汇率
- **Repository / Service 数据访问层**（`src/lib/repositories/`、`src/lib/services/`）：通用只读接口 `ReadRepository<T>` + `createInMemoryRepository<T>()` 工厂（`base.ts`），10 个领域 repository；服务层实现汇率换算（`pricing-service.ts`，复用「意购」项目已验证的模式）、房源有效期到期判断（`listing-lifecycle-service.ts`，`computeExpiresAt`/`isListingExpired`/`filterPubliclyVisibleListings`）、「获取联系方式」限流判断（`contact-reveal-service.ts`，阈值从 `system_settings` 读取，未配置时回退到保守默认值）
- **Supabase 迁移 SQL 草案**（`supabase/migrations/0001~0004`）：按依赖顺序建表，覆盖全部规划实体，统一软删除/审计字段约定；`docs/DATABASE_SCHEMA.md` 已更新为完整字段级设计文档
- **Vitest 单元测试**（`tests/unit/`，5 个文件，26 个用例）：权限矩阵、汇率换算、房源生命周期（到期判断、公开可见性过滤）、联系方式限流、种子数据引用完整性（房源/评论/收藏/举报/审计日志/角色分配的外键一致性）

### 主要文件

- `src/types/*.ts`（13 个文件）
- `src/lib/permissions/`、`src/lib/errors/`
- `src/lib/repositories/*.ts`（11 个文件）、`src/lib/services/*.ts`（4 个文件）
- `src/data/mock/*.ts`（10 个文件）
- `supabase/migrations/0001_extensions_and_core.sql` ~ `0004_trust_safety_and_settings.sql`
- `tests/unit/*.test.ts`（5 个文件）、`vitest.config.ts`
- `docs/DATABASE_SCHEMA.md`、`docs/ROLES_AND_PERMISSIONS.md`（均已更新为实际实现内容）
- `package.json`（新增 `test`/`test:watch` 脚本，新增 `vitest` 依赖）

### 测试结果

- `npm run lint`：通过，无警告或错误
- `npm run typecheck`：通过
- `npm run test`（Vitest）：5 个测试文件、26 个用例全部通过
- `npm run build`：通过（Next.js 16.2.11 + Turbopack）
- `npm run format:check`：新增文件首次运行后发现少量未格式化文件，已执行 `npm run format` 统一修复，复检通过

### 已知问题

- 尚未连接真实 Supabase 项目，`supabase/migrations/` 为 SQL 草案，尚未执行；RLS 策略计划合并进 Stage 07（平台管理后台阶段）编写，因为本项目角色体系比「意购」更简单
- 房源到期后的定时下架目前只是服务层的只读判断函数（`isListingExpired`/`filterPubliclyVisibleListings`），真实的数据库定时任务（如 `pg_cron` 或边缘函数轮询）将在接入真实 Supabase 项目时设计
- 尚无 UI 组件与页面消费这些类型/数据（属于 Stage 02 起的工作范围）

### 备份记录

见文首「备份记录汇总」。

### 下一阶段

Stage 02：设计系统 —— 直接迁移「意购」项目已验证的设计 Token（色彩/字体/圆角/阴影/断点）与 Header/Footer/基础 UI 组件/业务卡片组件，确保两站视觉语言一致但代码独立维护。

---

## Stage 02：设计系统

**目标**：直接迁移「意购」项目已验证的设计 Token 与 Header/Footer/基础 UI 组件，新增本项目专属的房源卡片/城市卡片，搭建内部 UI 展示页并完成响应式验证。

### 已完成功能

- **设计 Token**（`src/app/globals.css`，Tailwind v4 `@theme`）：与「意购」项目完全一致的色彩（暖白背景 `paper`、墨色文字 `ink`、低饱和深青绿强调色 `brand-50/100/700/900`、语义状态色 `success/warning/danger`）、字体（中文系统无衬线字体栈 + 英文衬线字体 `Source Serif 4`）、圆角（`xs/sm/md`，最大 6px）、阴影（仅 `shadow-overlay`）、断点、容器最大宽度，保持「意料之中」品牌体系视觉连贯性
- **字体与根布局**：`next/font/google` 加载 `Source Serif 4`，`layout.tsx` 接入 `Header`/`Footer`，站点元数据（`siteConfig`）改为「意料之中～意租 / Expectaly Rent」
- **基础 UI 组件**（`src/components/ui/`）：`Button`/`Input`/`Textarea`/`Select`/`Badge`/`Dialog`/`Drawer` 直接迁移「意购」项目已验证的实现（含 Stage 09 修复过的 `Drawer` 关闭态 `display` 切换逻辑），代码独立维护不做跨项目 import
- **Header / Footer / 移动端菜单**（`src/components/layout/`）：导航结构改为「找房源 / 城市 / 关于平台」，右侧操作区为搜索/收藏/用户中心图标 + 「发布房源」CTA 按钮（**无购物车图标**，因本项目不做平台内交易，见 `docs/NO_TRANSACTION_POLICY.md`）；移动端抽屉菜单包含账户/发帖入口与平台说明链接；页脚四列内容改为找房源/服务/帮助与支持/法律与政策，法律链接指向本项目规划的 slug（`user-agreement`/`privacy-policy`/`disclaimer`/`content-guidelines`/`report-handling-policy`）
- **业务卡片组件**：`ListingCard`（房型/面积/月租双货币/中介费/合同/宠物标签，收藏按钮悬浮于图片）、`CityCard`（城市名称与简介）、`RentPrice`（月租欧元为主 + 人民币参考价 + 汇率换算免责声明，复用 `pricing-service.ts`）
- **状态与布局组件**：`EmptyState`、`ErrorState`、`Skeleton`/`ListingCardSkeleton`、`PageContainer`、`Grid`、`PlaceholderImage` 均直接迁移「意购」项目实现
- **内部 UI 展示页**（`/internal/ui-kit`，`noindex`）：汇总以上全部组件与真实模拟数据（9 个演示房源、10 个城市）联调展示
- **首页占位**（`/`）：Stage 03 前的最小占位页，用于验证 Header/Footer 正确接入；完整首页内容留待 Stage 03
- 新增依赖：`clsx`、`tailwind-merge`（className 合并）、`lucide-react`（图标）、`vitest`（Stage 01 新增，此处一并确认无冲突）
- **浏览器实测**：真实启动 `next dev -p 3200 -H 0.0.0.0` 后台进程（而非沙箱预览），通过无障碍树读取确认首页 Header/Footer/导航链接渲染正确；`/internal/ui-kit` 页面色彩/字体/按钮/表单控件/徽章/弹层/抽屉/占位图/骨架屏/空状态/错误状态/房源卡片（含月租双货币与标签徽章）/城市卡片全部渲染正确，数据与 mock 一致；移动端视口（375×812）下无横向溢出，点击汉堡菜单正确打开抽屉并展示全部导航项；控制台全程无报错

### 主要文件

- `src/app/globals.css`（设计 Token）、`src/app/layout.tsx`、`src/app/page.tsx`
- `src/components/ui/{Button,Input,Textarea,Select,Badge,Dialog,Drawer}.tsx`
- `src/components/layout/{Header,Footer,Logo,LanguageSwitcher,MobileMenu,nav-links}.tsx`
- `src/components/listing/{ListingCard,RentPrice}.tsx`、`src/components/city/CityCard.tsx`
- `src/components/shared/{PlaceholderImage,EmptyState,ErrorState,Skeleton,PageContainer,Grid}.tsx`
- `src/app/internal/{layout.tsx,ui-kit/page.tsx}`
- `src/lib/utils/cn.ts`、`src/lib/config/site.ts`
- `.claude/launch.json`（本地预览用 dev server 配置，端口 3200，与「意购」项目的 3100 区分）

### 测试结果

- `npm run lint`：通过，无警告或错误
- `npm run typecheck`：通过
- `npm run test`（Vitest）：5 个测试文件、26 个用例全部通过（未受设计系统改动影响）
- `npm run build`：通过（Next.js 16.2.11 + Turbopack，新增 `/internal/ui-kit` 静态路由）
- `npm run format` / `format:check`：通过
- 浏览器实测：见上「已完成功能」末尾

### 已知问题

- 房源/城市图片资源使用渐变占位块，尚未接入真实图片或 Supabase Storage（按计划留待后续阶段）
- 搜索入口、语言切换器目前均为纯 UI 占位，尚未接入实际路由页面（Stage 03 起补齐）
- 首页仅为占位页，完整编辑式首页内容（精选房源/城市入口等）属于 Stage 03 范围

### 备份记录

见文首「备份记录汇总」。

### 下一阶段

Stage 03：公开页面 —— 首页、房源列表/搜索页、房源详情页、城市列表/详情页、平台说明与法律页面，接入 SEO 元数据、sitemap/robots。

---

## Stage 03：公开页面

**目标**：基于 Stage 01 数据层与 Stage 02 设计系统，实现全部公开用户页面，接入 SEO 元数据、sitemap/robots。

### 已完成功能

- **首页**（`/`）：编辑式分区（Hero + 浏览房源/发布房源 CTA、最新房源、免中介费房源、热门城市、平台说明引导），每区仅展示少量精选内容
- **房源列表/搜索页**（`/listings`）：城市/房型/中介费/合同/宠物/租金区间筛选、3 种排序方式、网格/列表视图切换、移动端筛选抽屉（复用 Stage 02 Drawer）、无结果空状态、清除全部筛选
- **房源详情页**（`/listings/[id]`）：图库占位、面包屑、月租双货币展示（含汇率免责声明）、完整字段展示（房型/面积/楼层/装修/押金/最短租期/入住时间/交通）、中介费/合同/宠物/家具/拎包入住标签、有效期倒计时（「N 天后自动下架」）、评论只读列表（含作者名解析）、举报入口、免责声明；未发布/待审核/已过期/已下架房源统一返回 404
- **城市列表/详情页**（`/cities`、`/cities/[slug]`）：详情页聚合该城市下的公开可见（已发布且未过期）房源
- **平台说明与法律页面**：`/about`（平台定位、无交易机制、联系方式获取机制、内容审核说明）、`/faq`（按分类分组的手风琴交互，基于原生 `<details>`）、`/legal/[slug]`（5 篇法律文本模板，均通过 `generateStaticParams` 静态生成，含「待法律顾问审核」提示横幅）
- **SEO**：各页面 `generateMetadata`/`alternates.canonical`；`app/sitemap.ts`（静态路由 + 公开可见房源 + 城市 + 法律文本，房源仅收录已发布且未过期条目）、`app/robots.ts`
- **共享组件新增**：`ListingCard`/`ListingListRow`/`RentPrice`/`MobileFilterDrawer`（`src/components/listing/`）、`CityCard`（`src/components/city/`）、`SectionHeading`/`ReportDialog`/`FaqAccordion`（`src/components/shared/`）
- **服务层扩展**：`listing-lifecycle-service.ts` 新增 `daysUntilExpiry()`（供详情页倒计时展示），补充 2 个单元测试
- **真实缺陷修复**：首页最初将「热门城市」展示用的 6 个城市切片与「房源卡片城市名」查找用的 Map 共用同一份已切片数组，导致排在第 6 位之后的城市（如帕尔马）对应的房源卡片无法显示城市名。修复为先用完整城市列表构建查找 Map，再对展示用列表做切片，浏览器实测确认帕尔马房源卡片城市名正确显示
- **浏览器实测**：真实启动 `next dev -p 3200 -H 0.0.0.0` 后台进程，通过无障碍树读取、`fetch()` 链接完整性检查、`sitemap.xml`/`robots.txt` 内容核实完成全部验证——首页各分区、房源列表（含筛选/排序/视图切换/空状态）、房源详情（含已下架房源 404 校验）、城市详情、FAQ、法律文本页面均渲染正确；抓取首页全部内部链接逐一请求验证，公开页面均返回 200（`/account`、`/account/favorites`、`/listings/new` 返回 404 为预期行为，属 Stage 04/05 范围）；移动端视口（375px）下 `/listings` 无横向溢出，筛选抽屉可正常打开/关闭；控制台全程无报错
- **工具限制说明**：移动端视口下 `computer` 工具的合成点击未能触发筛选抽屉按钮的 React 事件（直接 `element.click()` 验证功能本身正常），判断为浏览器自动化工具在移动视口下的已知限制（与「意购」项目 Stage 02 记录的截图工具超时问题同属一类环境限制），已改用 JS 直接触发点击 + 状态核查完成验证，未发现实际渲染缺陷

### 主要文件

- `src/app/{page.tsx,listings/page.tsx,listings/[id]/page.tsx,cities/page.tsx,cities/[slug]/page.tsx,about/page.tsx,faq/page.tsx,legal/[slug]/page.tsx}`
- `src/app/{sitemap.ts,robots.ts}`
- `src/components/listing/{ListingCard,ListingListRow,RentPrice,MobileFilterDrawer}.tsx`
- `src/components/city/CityCard.tsx`
- `src/components/shared/{SectionHeading,ReportDialog,FaqAccordion}.tsx`
- `src/lib/services/listing-lifecycle-service.ts`（新增 `daysUntilExpiry()`）
- `tests/unit/listing-lifecycle-service.test.ts`（新增 2 个用例）
- `docs/ROUTES.md`（更新为实际实现状态）

### 测试结果

- `npm run lint`：通过，无警告或错误
- `npm run typecheck`：通过
- `npm run test`（Vitest）：5 个测试文件、28 个用例全部通过
- `npm run build`：通过（Next.js 16.2.11 + Turbopack；`/legal/[slug]` 静态预渲染 5 篇文本，`/listings`、`/listings/[id]`、`/cities/[slug]` 按需动态渲染，`/`、`/about`、`/cities`、`/faq`、`/internal/ui-kit` 静态预渲染）
- `npm run format` / `format:check`：通过
- 浏览器实测：见上「已完成功能」末尾

### 已知问题

- 购物车/收藏/用户中心/发布房源相关导航入口已存在但对应页面尚未实现（按计划属于 Stage 04/05 范围），直接访问会 404，属预期行为
- 图片仍为占位渐变块，尚未接入真实图片资源
- 法律文本内容为初始模板，尚未经法律顾问审核
- 「获取联系方式」「收藏」「评论」按钮目前均跳转至 `/auth/login`（该页面尚未实现，会 404），Stage 04 起接入真实登录门槛与交互逻辑

### 备份记录

见文首「备份记录汇总」。

### 下一阶段

Stage 04：登录与用户中心 —— 开发环境模拟登录体系（邮箱/手机号/演示账号）、`proxy.ts` 路由保护、用户中心布局与概览、我的收藏/我的评论等子页面骨架。

---

## Stage 04：登录与用户中心

**目标**：搭建开发环境模拟登录体系（邮箱/手机号/演示账号）、`proxy.ts` 路由保护、用户中心布局与概览、我的收藏/我的评论/账号设置子页面。

### 已完成功能

- **Auth 会话层**（`src/lib/auth/`）：`session.ts` 提供唯一的 `getCurrentProfile()` 读取入口（Cookie `expectaly_rent_session`，未加密签名，仅限开发环境；命名与「意购」项目的 `expectaly_session` 区分，避免同一浏览器下两站会话互相覆盖）；`actions.ts`（`"use server"`）提供 `loginWithEmail`/`loginWithPhone`/`loginAsDemoProfile`/`registerDevAccount`/`logout` 五个 Server Actions；`types.ts` 独立存放 `AuthActionState`/`DEV_SMS_CODE`/`safeRedirectPath()`（从一开始就采用「意购」项目 Stage 08 修复开放重定向漏洞后的单一共享校验实现，未重蹈覆辙）
- **登录页**（`/auth/login`）：邮箱/手机号双 Tab、手机号验证码为开发环境固定值（`123456`，明确提示未接入真实短信网关）、覆盖全部 3 种登录角色（普通用户/内容审核员/管理员）的演示账号快捷登录（`<details>` 折叠面板）、已登录时自动重定向
- **注册页**（`/auth/register`）：开发环境临时账号注册，仅写入会话 Cookie，不落库
- **路由保护**（`src/proxy.ts`）：拦截 `/account/**`、`/listings/new`、`/admin/**`，未登录重定向到 `/auth/login?redirect=<原路径>`，浏览器实测验证（访问 `/account` → 重定向到 `/auth/login?redirect=%2Faccount`）
- **用户中心布局**（`/account/layout.tsx`）：服务端二次校验登录态、侧边导航（`AccountNav`：概览/我的房源/我的收藏/我的评论/账号设置，高亮当前路由）、退出登录（Server Action 表单）
- **用户中心概览**（`/account`）：我的房源/我的收藏/我的评论统计卡片（真实读取 `listingRepository.findByPublisher`/`favoriteRepository.findByUser`/`commentRepository.findByAuthor`）
- **我的收藏**（`/account/favorites`）：读取真实收藏记录并渲染 `ListingCard` 网格，空状态引导
- **我的评论**（`/account/comments`）：读取真实评论记录，展示所属房源标题（含已下架房源标题正常解析）、隐藏状态徽章
- **账号设置**（`/account/settings`）：资料/语言编辑表单，界面演示，未接入持久化
- **主站账号互通文档**（`docs/MAIN_SITE_INTEGRATION.md`）：更新记录第一期本地开发替代方案的实际实现，说明本项目不做微信登录 provider 与 `/auth/callback` 回调路由骨架（因当前无第三方 OAuth provider 需要占位）
- **浏览器实测**：真实启动 `next dev -p 3200 -H 0.0.0.0` 后台进程完整走通登录闭环——未登录访问 `/account` 正确重定向并携带 `redirect` 参数 → 展开「开发环境快捷登录」面板，以「林飞」（普通用户）身份登录 → 正确重定向回 `/account`，统计卡片显示「3 我的房源 / 0 我的收藏 / 2 我的评论」（与种子数据完全一致：`profile-user-linfei` 发布 3 个房源、0 条收藏、2 条评论）→ `/account/comments` 正确展示 2 条评论（含 1 条隐藏评论及其所属的已下架房源标题）→ `/account/favorites` 正确展示空状态 → `/account/settings` 表单渲染正确 → 点击「退出登录」正确清除会话并跳转首页 → 复测 `/account` 再次要求登录；控制台全程无报错

### 主要文件

- `src/lib/auth/{session,actions,types}.ts`
- `src/proxy.ts`
- `src/app/auth/{login,register}/page.tsx`
- `src/components/auth/{LoginForm,RegisterForm}.tsx`
- `src/app/account/{layout,page}.tsx`、`src/app/account/{favorites,comments,settings}/page.tsx`
- `src/components/account/{AccountNav,SettingsForm}.tsx`
- `docs/MAIN_SITE_INTEGRATION.md`（更新为实际实现状态）
- 新增依赖：`server-only`

### 测试结果

- `npm run lint`：通过，无警告或错误
- `npm run typecheck`：通过
- `npm run test`（Vitest）：5 个测试文件、28 个用例全部通过（未受本阶段改动影响）
- `npm run build`：通过（Next.js 16.2.11 + Turbopack；构建输出确认 `ƒ Proxy (Middleware)` 已生效，`/account/**` 全部为按需动态渲染）
- `npm run format` / `format:check`：通过
- 浏览器实测：见上「已完成功能」末尾

### 已知问题

- 当前会话方案（Cookie 未签名）仅适用于开发环境，正式上线前必须替换为 Supabase Auth，`getCurrentProfile()` 签名保持稳定以便无缝切换
- 「我的房源」导航入口已存在但对应管理页面（`/account/listings`）尚未实现，直接访问会 404，属预期行为（按计划属于 Stage 05「发布房源与我的房源管理」范围）
- 账号设置保存为界面交互演示，尚未接入真实持久化
- 房源详情页的「获取联系方式」「收藏」「评论」交互仍跳转至 `/auth/login`，尚未接入真实的登录后交互逻辑（限流判断、收藏切换、评论提交），属 Stage 05/06 范围

### 备份记录

见文首「备份记录汇总」。

### 下一阶段

Stage 05：发布房源与我的房源管理 —— 发布房源表单（`/listings/new`）、我的房源管理页（`/account/listings`，编辑/下架/续期）、房源有效期到期后的状态流转在页面层的实际应用。

---

## Stage 05：发布房源与我的房源管理

**目标**：补全发布房源表单与「我的房源」管理页，完成登录用户发帖闭环的界面演示，并验证跨用户越权访问防护。

### 已完成功能

- **发布房源表单**（`/listings/new`，`src/components/listing/ListingForm.tsx`）：完整字段（标题/描述/城市/地址/房型/面积/楼层/朝向/装修状况/月租/押金条款/中介费/合同/最短租期/入住时间/宠物/家具/拎包入住/交通说明/有效期时长选择），提交为界面演示确认（不接入真实持久化写入，与「意购」项目商品表单同一模式）；页面本身受 `proxy.ts` 保护，未登录访问会重定向到登录页
- **我的房源管理页**（`/account/listings`）：列出当前用户发布的全部房源（含草稿/待审核/已过期/已下架），状态徽章、剩余有效期天数（仅已发布状态展示）、月租展示；`ListingRowActions` 组件提供「编辑」（跳转真实编辑页）与「下架/重新发布」（根据当前状态动态切换文案，弹层确认后本地展示结果，界面演示）
- **房源编辑页**（`/account/listings/[id]/edit`）：复用 `ListingForm`（`mode="edit"`）并预填全部字段；**服务端校验房源 `publisherId` 归属，非本人房源统一返回 404**（不泄露房源是否存在），浏览器实测确认「林飞」账号编辑自己的房源正常预填、尝试编辑「都灵单间」（属于 Giulia）被正确拦截并返回 404
- **浏览器实测**：以「林飞」身份登录 → `/account/listings` 正确展示其 3 个房源（米兰-已发布-剩余 21 天/博洛尼亚-待审核/威尼斯-已过期，且「已过期」条目正确显示「重新发布」而非「下架」）→ 编辑米兰房源确认字段全部正确预填（标题/地址/月租/城市）→ 尝试编辑都灵房源被正确 404 拦截 → `/listings/new` 填写并提交测试数据，确认提交成功页正常渲染；控制台全程无报错

### 主要文件

- `src/components/listing/{ListingForm,ListingRowActions}.tsx`
- `src/app/listings/new/page.tsx`
- `src/app/account/listings/{page.tsx,[id]/edit/page.tsx}`
- `docs/ROUTES.md`（更新为实际实现状态）

### 测试结果

- `npm run lint`：通过，无警告或错误
- `npm run typecheck`：通过
- `npm run test`（Vitest）：5 个测试文件、28 个用例全部通过（未受本阶段改动影响）
- `npm run build`：通过（Next.js 16.2.11 + Turbopack；`/listings/new`、`/account/listings`、`/account/listings/[id]/edit` 均按需动态渲染）
- `npm run format` / `format:check`：通过
- 浏览器实测：见上「已完成功能」末尾

### 已知问题

- 发布/编辑/下架/重新发布均为界面交互演示，尚未接入 `listings` 表的真实写入，与项目全程「repositories 第一期只读」的原则一致，将在真实 Supabase 项目接入后统一补齐
- 提交房源时的风险关键词自动预警（对应 `system_settings.risk_keywords`）尚未在表单提交流程中实际触发校验，仅在确认文案中说明该机制，实际自动预警逻辑属 Stage 07（举报与内容审核后台）范围

### 备份记录

见文首「备份记录汇总」。

### 下一阶段

Stage 06：评论与收藏 —— 房源详情页评论提交表单与收藏切换按钮接入真实登录态交互（仍为界面演示，暂不持久化），「获取联系方式」按钮接入登录门槛与限流提示。

---

## Stage 06：评论与收藏

**目标**：房源详情页的「获取联系方式」「收藏」「评论」从纯静态占位升级为接入真实登录态的交互组件。

### 已完成功能

- **获取联系方式**（`src/lib/actions/contact-reveal-actions.ts` + `ContactRevealButton`）：新增服务端动作 `revealContact()`——校验登录态与 Stage 01 已实现的限流判断（`assertContactRevealNotRateLimited`），通过后返回**房源发帖人**（而非当前查看者）的电话/邮箱；未登录时按钮显示「登录后获取联系方式」并跳转登录页；第一期只做限流的只读判断，不写入新的 `contact_reveal_events` 记录（与项目全程「repositories 第一期只读」原则一致）
- **收藏切换**（`FavoriteButton`）：登录用户可切换收藏态（本地状态演示，不持久化），初始态从 `favoriteRepository.exists()` 真实读取；未登录显示「登录后收藏」
- **评论提交**（`CommentsSection`）：登录用户可在只读评论列表下方提交新评论，乐观展示在列表末尾（本地状态演示，不持久化，刷新后消失）；未登录显示「登录后发表评论」链接
- **浏览器实测**：以「林飞」身份登录后访问自己发布的米兰房源，「获取联系方式」正确返回林飞本人的电话/邮箱（因林飞是该房源发帖人）；访问 Giulia 发布的都灵房源，「获取联系方式」正确返回 **Giulia** 的电话/邮箱（`+39 340 555 1003` / `giulia.bianchi.demo@example.com`），证实联系方式解析的是发帖人而非查看者；提交测试评论后乐观显示在列表末尾并清空输入框；点击收藏按钮正确切换为「已收藏」；退出登录后重新访问都灵房源，三处交互全部正确降级为「登录后……」提示；控制台全程无报错

### 主要文件

- `src/lib/actions/contact-reveal-actions.ts`
- `src/components/listing/{ContactRevealButton,FavoriteButton,CommentsSection}.tsx`
- `src/app/listings/[id]/page.tsx`（接入以上三个交互组件，替换原静态占位）

### 测试结果

- `npm run lint`：通过，无警告或错误
- `npm run typecheck`：通过
- `npm run test`（Vitest）：5 个测试文件、28 个用例全部通过（未受本阶段改动影响，限流逻辑已在 Stage 01 覆盖单元测试）
- `npm run build`：通过（Next.js 16.2.11 + Turbopack）
- `npm run format` / `format:check`：通过
- 浏览器实测：见上「已完成功能」末尾

### 已知问题

- 评论提交、收藏切换均为本地状态演示，刷新页面后不保留，尚未接入 `comments`/`favorites` 表的真实写入
- 「获取联系方式」的限流判断只读取已有的种子事件数据，未写入新事件记录，因此实际点击次数不会累积到限流阈值中；真实的事件写入将在接入 Supabase 项目后补齐
- 举报提交（`ReportDialog`）仍为纯本地演示，尚未接入 `reports` 表写入，属 Stage 07 范围

### 备份记录

见文首「备份记录汇总」。

### 下一阶段

Stage 07：举报与内容审核后台 —— 举报处理后台（`/admin/reports`）、房源/评论内容审核（下架/隐藏）、风险关键词自动预警接入发帖流程、审计日志记录、RLS 策略草案。

---

## Stage 07：举报与内容审核后台

**目标**：搭建覆盖内容审核员/管理员两种后台角色的平台管理后台，实现按角色权限动态过滤的导航与仪表盘，接入风险关键词自动预警，并补齐 RLS 策略草案与合规文档。

### 已完成功能

- **平台后台布局与导航**（`/admin/layout.tsx`、`src/components/admin/AdminNav.tsx`）：服务端校验账号是否拥有内容审核员或管理员角色，否则展示「无权访问平台后台」引导页而非报错；`AdminNav` 按每个导航项声明的 `anyOf: PermissionKey[]` 与 `can()` 动态过滤（浏览器实测：内容审核员仅见「仪表盘/房源管理/举报处理/评论管理」4 项，管理员额外可见「用户管理/城市管理/系统设置/角色权限/审计日志」5 项）；`proxy.ts` 已有 `/admin/:path*` 匹配
- **仪表盘**（`/admin`）：数据卡片按 `can()` 权限动态展示（待处理举报/待审核房源/平台用户总数），浏览器实测内容审核员看到 2 张卡片、管理员看到 3 张卡片，数值与种子数据完全一致
- **举报处理**（`/admin/reports`）：待处理/已处理分组，`ReviewDialog` 通用处理决定弹层（标记已处理/驳回/下架-隐藏，界面交互演示），命中风险关键词的举报描述高亮显示
- **房源管理**（`/admin/listings`）：待审核房源分组置顶（含风险关键词高亮）+ 全部房源列表（状态徽章、发帖人、所在城市），已下架房源不再提供「下架」操作按钮
- **评论管理**（`/admin/comments`）：全平台评论列表，隐藏/已删除状态徽章与隐藏原因展示，可见评论提供「隐藏」操作入口
- **风险关键词自动预警**（`src/lib/services/compliance-service.ts`）：`parseRiskKeywords()`（解析 `system_settings.risk_keywords` 的 JSON 数组值）/`findRiskKeywordMatches()`/`containsRiskKeyword()`，5 个单元测试；接入 `/admin/reports` 与 `/admin/listings`，浏览器实测「博洛尼亚免中介内部渠道急租一室」房源与对应举报均正确高亮「命中风险关键词：内部渠道」
- **RLS 策略草案**：新增 `supabase/migrations/0005_row_level_security.sql`，覆盖全部 12 张表，包含角色判断辅助函数（`app_current_profile_id`/`app_has_role`/`app_is_staff`/`app_is_admin`）与逐表 select/insert/update 策略，语义与 `src/lib/permissions/matrix.ts` 保持一致；关键设计：`listings` 的 select 策略同时判断 `status = 'published'` 与 `expires_at > now()`，`comments` 的 select 策略仅公开 `visible` 状态评论
- **COMPLIANCE.md 合规文档**：从 Stage 00 骨架改写为完整实现文档，涵盖内容真实性与举报闭环、风险关键词预警、联系方式滥用防范、平台责任边界、合同/中介费提示、法律文本页面、RLS 要点
- **浏览器实测**：以「若曦」（内容审核员）身份登录，`/admin` 导航正确限制为 4 项，`/admin/reports` 正确展示 3 条举报（1 待处理，2 已处理，待处理项正确高亮风险关键词）、`/admin/listings` 正确展示全部 9 条房源（1 条待审核并高亮风险关键词）、`/admin/comments` 正确展示 3 条评论（含 1 条隐藏及原因）；切换为「林飞」（普通用户）访问 `/admin` 被正确拦截并展示「无权访问平台后台」；切换为「志远」（管理员）访问 `/admin` 展示完整 9 项导航与 3 张仪表盘统计卡片（含仅管理员可见的「平台用户总数：5」）；控制台全程无报错

### 主要文件

- `src/lib/services/compliance-service.ts`、`tests/unit/compliance-service.test.ts`
- `src/components/admin/{AdminNav,ReviewDialog}.tsx`
- `src/app/admin/layout.tsx`
- `src/app/admin/{page,reports,listings,comments}/page.tsx`
- `supabase/migrations/0005_row_level_security.sql`
- `docs/COMPLIANCE.md`（完整重写）、`docs/DATABASE_SCHEMA.md`（更新 RLS 相关说明）、`docs/ROUTES.md`（更新为实际实现状态）

### 测试结果

- `npm run lint`：通过，无警告或错误
- `npm run typecheck`：通过
- `npm run test`（Vitest）：6 个测试文件、33 个用例全部通过
- `npm run build`：通过（Next.js 16.2.11 + Turbopack；`/admin`、`/admin/reports`、`/admin/listings`、`/admin/comments` 均按需动态渲染，构建输出确认 `ƒ Proxy (Middleware)` 已生效）
- `npm run format` / `format:check`：通过
- 浏览器实测：见上「已完成功能」末尾

### 已知问题

- 全部审核类操作（举报处理、房源下架、评论隐藏）均为界面交互演示，尚未接入真实数据库写入，与此前各阶段建立的模式一致，将在真实 Supabase 项目接入后统一补齐
- 用户管理、城市管理、系统设置、角色权限、审计日志导航项已存在但对应页面尚未实现（按计划属于 Stage 08 范围），管理员点击会 404，属预期行为
- RLS 策略为草案，尚未在真实 Supabase 项目上执行验证

### 备份记录

见文首「备份记录汇总」。

### 下一阶段

Stage 08：平台管理后台 —— 用户管理（`/admin/users`）、城市管理（`/admin/cities`）、系统设置（`/admin/settings`）、角色权限查看（`/admin/roles`）、审计日志（`/admin/audit-logs`），补齐管理员专属后台模块。

---

## Stage 08：平台管理后台

**目标**：补齐管理员专属的 5 个后台模块，并为每个页面加入服务端二次权限校验，确保内容审核员无法通过直接访问 URL 绕过导航过滤查看管理员专属数据。

### 已完成功能

- **用户管理**（`/admin/users`）：全平台账号列表（角色徽章、账号状态、最近登录时间），页面级二次校验 `can(roles, "user:manage")`
- **城市管理**（`/admin/cities`）：城市列表（可见性状态），页面级二次校验 `can(roles, "city:manage")`
- **系统设置**（`/admin/settings`）：配置项只读展示，页面级二次校验 `can(roles, "system_setting:manage")`；本项目不存在支付/微信登录等功能开关，页面明确说明
- **角色权限**（`/admin/roles`）：4 角色权限矩阵只读展示（去重后渲染，避免权限交集导致 React key 重复），页面级二次校验 `can(roles, "role:manage")`，**非管理员直接访问返回「无权访问」而非泄露权限矩阵**
- **审计日志**（`/admin/audit-logs`）：最近 100 条操作记录，页面级二次校验 `can(roles, "audit_log:view")`
- **安全设计说明**：5 个页面均在 `AdminNav` 导航过滤之外**额外**做了服务端权限二次校验（而非仅依赖导航项隐藏），因为 `admin/layout.tsx` 仅校验「是否属于内容审核员/管理员大类」，不校验具体页面所需的细粒度权限——若不加二次校验，内容审核员理论上可通过直接访问 URL 绕过导航过滤查看管理员专属数据
- **浏览器实测**：以「志远」（管理员）身份逐一访问 5 个页面，均正确渲染完整数据（用户列表 5 个账号、角色权限矩阵含 3 种角色的完整权限集合、审计日志等）；切换为「若曦」（内容审核员）后**直接通过 URL** 访问全部 5 个页面，均正确返回「无权访问」提示，未泄露任何数据；控制台全程无报错

### 主要文件

- `src/app/admin/{users,cities,settings,roles,audit-logs}/page.tsx`
- `docs/ROUTES.md`（更新为实际实现状态，平台管理后台全部模块标记为已实现）

### 测试结果

- `npm run lint`：通过，无警告或错误
- `npm run typecheck`：通过
- `npm run test`（Vitest）：6 个测试文件、33 个用例全部通过
- `npm run build`：通过（Next.js 16.2.11 + Turbopack；`/admin/**` 全部 8 个路由均按需动态渲染）
- `npm run format` / `format:check`：通过
- 浏览器实测：见上「已完成功能」末尾

### 已知问题

- 全部管理类操作（用户状态变更、城市可见性切换、系统设置修改、角色分配）仍为只读展示或界面交互演示，尚未接入真实数据库写入，与此前各阶段建立的模式一致
- 本项目角色体系更简单（4 角色，无「管理员/超级管理员」二级拆分），因此角色权限页面不存在「意购」项目中 `SUPER_ADMIN_ONLY` 独占权限的单独展示区块

### 备份记录

见文首「备份记录汇总」。

### 下一阶段

Stage 09：完整测试与优化 —— Playwright 端到端测试基础设施、核心用户旅程/后台权限 E2E 测试、可访问性审查（axe-core）、性能与 SEO 复查。

---

## Stage 09：完整测试与优化

**目标**：搭建 Playwright 端到端测试基础设施，覆盖核心用户旅程、后台权限边界与可访问性，复查 SEO/性能一致性。

### 已完成功能

- **Playwright 端到端测试基础设施**（`playwright.config.ts`）：Chromium + Firefox + Pixel 5（移动端）3 个浏览器项目，独立端口 3201 避免与手动开发服务器（3200）冲突，`workers` 限制为 4（本地）/ 1（CI）避免 Turbopack 首次编译资源争抢，`expect.timeout` 放宽至 10s（复用「意购」项目 Stage 09 已验证的配置模式）；`tests/e2e/utils/auth.ts` 提供演示账号登录/登出辅助函数
- **8 个测试文件、108 个用例**（3 浏览器项目 × 36 用例）：
  - `homepage.spec.ts`：首页核心分区、无横向溢出、入口可达
  - `listings.spec.ts`：列表筛选、详情字段与免责声明、草稿/已过期/已下架房源均返回 404
  - `auth-login.spec.ts`：路由保护重定向（含 `redirect` 参数）、登录跳转、退出登录
  - `account-journey.spec.ts`：发布房源、我的房源状态徽章、跨用户编辑越权拦截、获取联系方式返回发帖人而非查看者、收藏切换、评论乐观展示、未登录降级为登录引导
  - `admin-portal.spec.ts`：普通用户拒绝访问、内容审核员导航过滤与越权拦截（不泄露权限矩阵）、管理员完整访问、举报处理与房源审核队列
  - `navigation-drawer.spec.ts`：移动端主菜单抽屉、房源筛选抽屉
  - `accessibility.spec.ts`（axe-core）：7 个代表性页面模板，均无 serious/critical 级别问题
  - `seo.spec.ts`：sitemap 收录范围、robots 禁止路径、canonical/标题
- **性能与 SEO 复查**：确认全站无重复标题后缀问题（未在任何页面手动拼接站点名后缀）、28 个页面均正确接入 `metadata`/`generateMetadata`，公开页面均设置 `alternates.canonical`，后台/账户页面正确设置 `robots: { index: false }`
- **测试基础设施调试**（过程记录，均为测试选择器问题而非应用缺陷，逐一核实排除）：
  1. `listings.spec.ts` 的 `找房源` 标题选择器最初命中页面 H1 与页脚导航列 H2 两处（页脚「找房源」列标题恰好同名），改用 `level: 1` 精确匹配
  2. `auth-login.spec.ts` 的 `我的房源` 文本选择器命中侧边导航链接与账户概览统计卡片链接两处，改用 `getByRole("link", { exact: true })`
  3. `admin-portal.spec.ts` 的房源标题选择器命中列表项链接与已关闭的 `ReviewDialog` 隐藏 description 两处（Dialog 内容始终在 DOM 中，仅通过 CSS 控制显示，「意购」项目 Stage 09 已记录过同类特性），改用链接角色精确匹配
  4. `account-journey.spec.ts` 的「已过期」文本选择器命中演示房源标题本身（标题含「已过期示例」字样）与状态徽章两处，改用 `exact: true`
     以上 4 处修正均为测试用例自身的选择器歧义，浏览器实测确认应用渲染本身完全正确

### 主要文件

- `playwright.config.ts`
- `tests/e2e/{homepage,listings,auth-login,account-journey,admin-portal,navigation-drawer,accessibility,seo}.spec.ts`
- `tests/e2e/utils/auth.ts`
- `docs/TEST_CHECKLIST.md`（更新为实际执行记录）
- `package.json`（新增 `test:e2e`/`test:e2e:ui` 脚本，新增 `@playwright/test`/`@axe-core/playwright` 依赖）

### 测试结果

- `npm run lint`：通过，无警告或错误
- `npm run typecheck`：通过
- `npm run test`（Vitest）：6 个测试文件、33 个用例全部通过
- `npm run test:e2e`（Playwright）：8 个测试文件、108 个用例（36 × 3 浏览器项目）全部通过
- `npm run build`：通过（Next.js 16.2.11 + Turbopack）
- `npm run format` / `format:check`：通过

### 已知问题

- 未安装 WebKit 浏览器引擎，跳过 Safari 兼容性验证，移动端覆盖依赖 Chromium 的 "Pixel 5" 设备预设（与「意购」项目 Stage 09 的取舍一致）
- E2E 测试的时序对 Turbopack 首次编译耗时敏感，已通过放宽 `expect.timeout` 缓解，但极端资源紧张环境下仍可能偶发超时

### 备份记录

见文首「备份记录汇总」。

### 下一阶段

Stage 10：发布准备 —— DEPLOYMENT.md 完整撰写、种子数据导入方案与生成脚本、发布检查清单、CHANGELOG.md 与版本号确认。

---

## Stage 10：发布准备

**目标**：撰写完整部署文档、种子数据导入方案与生成脚本、10 节发布检查清单、CHANGELOG.md，并确认版本号；完成 Stage 00-10 全部 11 个阶段的最终验证与备份，收尾整个「意料之中～意租」项目第一期开发。

### 已完成功能

- **`docs/DEPLOYMENT.md` 完整重写**：本地开发命令、常用脚本清单、托管平台建议（Vercel 优先）、域名与 DNS 说明（`rent.expectaly.com`，明确注明真实 DNS 变更需由具备权限人员执行）、环境变量按"是否上线必需"分 4 级列出（当前代码仅读取 4 个必需的 `NEXT_PUBLIC_*` 站点配置变量，真实 Supabase 三个密钥变量尚未被任何 repository 读取）、构建发布流程、发布后人工冒烟测试清单、接入真实 Supabase 项目的 9 步后续工程说明
- **种子数据生成脚本**（`scripts/generate-seed-sql.ts`）：基于 `node:crypto` SHA-1 的确定性 UUID v5 映射（`uuidV5`/`resolveId`），覆盖本项目全部 12 张表（因表数量远少于「意购」的约 45 张，采用全量覆盖而非部分参考实现）；`generateListings()` 单独处理 `monthlyRent` 嵌套对象拆分为 `monthly_rent_amount`/`monthly_rent_currency` 两列；`npm run db:seed:sql` 成功生成并人工核对 `supabase/seed/generated-seed.sql` 无误
- **`docs/SEED_DATA_IMPORT.md`**：说明生成脚本用途边界（仅供测试/演示环境验证迁移文件与页面联调，不建议导入生产项目）、使用方式、覆盖范围、设计说明、已知限制（`auth_user_id` 为虚构字符串、`on conflict do nothing` 幂等语义、图片路径不指向真实文件）
- **`docs/RELEASE_CHECKLIST.md`**：10 节发布检查清单（代码质量/环境变量/身份认证与权限/数据库与 RLS/内容合规与法务/域名与基础设施/SEO 与内容/监控与备份/发布前冒烟测试/回滚预案），第 1 节全部自动化验证项已完成并勾选，其余章节标记为待真实环境执行事项；权限章节按本项目 4 角色矩阵与「无 super_admin 越权」设计逐条列出；合规章节包含「确认代码库中不存在任何购物车/订单/支付相关实现」自查项（对应 `docs/NO_TRANSACTION_POLICY.md`）
- **`CHANGELOG.md`**：Keep a Changelog 格式，`[0.0.1]` 至 `[0.10.0]` 共 11 个版本条目，逐阶段总结新增功能、变更与已修复缺陷（含 PowerShell BOM 编码缺陷与首页城市查找表切片顺序缺陷两处真实修复记录）
- **版本号确认**：`package.json` `"version"` 由初始的 `"0.1.0"` 更新为 `"0.10.0"`，与最终 CHANGELOG 条目一致

### 主要文件

- `docs/DEPLOYMENT.md`（完整重写）
- `scripts/generate-seed-sql.ts`
- `docs/SEED_DATA_IMPORT.md`
- `supabase/seed/generated-seed.sql`（生成产物，已人工核对）
- `docs/RELEASE_CHECKLIST.md`
- `CHANGELOG.md`
- `package.json`（`version` 字段更新为 `0.10.0`）

### 测试结果

- `npm run lint`：通过，无警告或错误
- `npm run typecheck`：通过
- `npm run test`（Vitest）：6 个测试文件、33 个用例全部通过
- `npm run test:e2e`（Playwright）：8 个测试文件、108 个用例（36 × 3 浏览器项目：chromium/firefox/mobile-chrome）全部通过
- `npm run build`：通过（Next.js 16.2.11 + Turbopack，33 个静态页面 + `ƒ Proxy (Middleware)` 生效，全部路由渲染模式与 Stage 09 一致）
- `npm run db:seed:sql`：成功生成 `supabase/seed/generated-seed.sql`，人工核对全部 12 张表数据结构与外键映射正确
- `npm audit`：3 个已知漏洞（1 中 2 高），均来自 `next`/`sharp`/`postcss` 传递依赖，修复需 `next` 主版本降级，已记录于 `docs/RELEASE_CHECKLIST.md` 待后续评估，未在本阶段处理（非本项目代码引入的缺陷）

### 已知问题

- 本阶段为纯文档与脚本收尾工作，未修改任何应用运行时代码，因此测试结果与 Stage 09 完全一致
- `docs/RELEASE_CHECKLIST.md` 中第 2-10 节（真实 Supabase 项目创建、真实域名 DNS 变更、法务审阅、真实监控接入等）均为待办事项，需由具备相应权限的人员在真实环境中执行，超出本项目第一期开发范围
- `src/components/auth/LoginForm.tsx` 的「开发环境快捷登录」演示面板与 `loginAsDemoProfile` Server Action 仍存在于代码中，已在 `DEPLOYMENT.md`/`RELEASE_CHECKLIST.md` 中明确标注为「上线前必须移除」事项

### 备份记录

见文首「备份记录汇总」。本阶段为最终阶段，最终备份完成后项目第一期开发（Stage 00-10，共 11 个阶段）全部完成。

### 下一阶段

无——本项目第一期开发（Stage 00 至 Stage 10，共 11 个阶段）已全部完成。后续工作（接入真实 Supabase 项目、真实域名部署、法律文本审阅、移除开发环境演示登录面板等）均已在 `docs/DEPLOYMENT.md` 第 8 节与 `docs/RELEASE_CHECKLIST.md` 中列出，留待具备相应权限的人员在后续工程中执行。

---

## 功能增补 01：新增「出租 / 出售」房源类别

**目标**：在 Stage 10（发布准备）之后、正式对接真实数据库之前，追加「出售」（买房）类别，与既有「出租」类别共用同一套页面与标签体系，同时确保「无交易机制」核心承诺同等适用于出售类别。

### 已完成功能

- **类型层**（`src/types/listing.ts`）：新增 `ListingPurpose`（`rent`/`sale`）与 `LISTING_PURPOSE_LABELS`（出租/出售）；`Listing` 新增 `purpose` 字段；字段 `monthlyRent`/`cnyReferenceRent` 泛化重命名为 `price`/`cnyReferencePrice`（出租为月租、出售为总价）；`minLeaseTermMonths` 由必填改为可空（`number | null`），出售房源恒为 `null`，`depositTerms` 语义同样限定为仅出租使用
- **演示数据**（`src/data/mock/listings.ts`）：既有 9 条房源补充 `purpose: "rent"`；新增 3 条出售房源（米兰精装两室出售、佛罗伦萨郊区独栋别墅出售、博洛尼亚待审核出售房源用于复用风险关键词审核演示），覆盖已发布/待审核两种状态
- **价格展示组件**：`RentPrice.tsx` 重命名为 `ListingPrice.tsx`，按 `purpose` 区分展示——出租展示「/ 月」后缀，出售展示总价（人民币参考价标注「总价」）
- **卡片/列表/详情/我的房源页**：`ListingCard`、`ListingListRow`、`/listings/[id]`、`/account/listings` 均加入出租/出售类别徽章；详情页的押金条款、最短租期改为按 `null` 条件展示，「可入住时间」在出售类别下改为「可交房时间」；宠物标签仅在出租类别展示
- **筛选页**（`/listings`）：筛选面板新增「类别」下拉（全部/出租/出售），价格区间标签泛化为「价格区间（欧元，出租为月租/出售为总价）」，排序选项文案由「租金从低到高/高到低」泛化为「价格从低到高/高到低」
- **发布/编辑表单**（`ListingForm.tsx`）：表单顶部新增「类别」选择器（受控组件），切换类别时：房型选择器（`key={purpose}` 强制重挂载）在出售类别下仅保留「整租」选项；价格输入框标签随类别切换为「月租（欧元）」/「总价（欧元）」；押金条款、最短租期、可养宠物三项仅在出租类别下渲染；可入住/交房日期标签随类别切换
- **数据库迁移**（`supabase/migrations/0002_listings.sql`）：新增 `purpose` 列（`check in ('rent','sale')`，默认 `rent`）及索引；`monthly_rent_amount`/`monthly_rent_currency`/`cny_reference_rent` 重命名为 `price_amount`/`price_currency`/`cny_reference_price`；`min_lease_term_months` 由 `not null default 1` 改为可空列
- **种子数据生成脚本**（`scripts/generate-seed-sql.ts`）：`generateListings()` 同步更新列名映射与新增 `purpose` 列，重新执行 `npm run db:seed:sql` 生成并核对（12 条房源，3 条出售/9 条出租，`purpose`/`price_amount` 等列值正确）
- **文档更新**：`docs/PROJECT_REQUIREMENTS.md` 第 5 节、`docs/DATABASE_SCHEMA.md`「`listings` 关键字段说明」、`docs/ROUTES.md`、`docs/NO_TRANSACTION_POLICY.md`（新增第 4 节，明确出售类别同等甚至更严格适用无交易政策，并在自查清单追加一项）均已更新；首页 hero 文案、`/about`、`/faq`、根布局 SEO 描述均已调整为覆盖出租与出售两种表述，首页新增「出售房源」精选分区

### 主要文件

- `src/types/listing.ts`
- `src/data/mock/listings.ts`
- `src/components/listing/ListingPrice.tsx`（原 `RentPrice.tsx`）、`ListingCard.tsx`、`ListingListRow.tsx`、`ListingForm.tsx`
- `src/app/listings/page.tsx`、`src/app/listings/[id]/page.tsx`
- `src/app/account/listings/page.tsx`、`src/app/account/listings/[id]/edit/page.tsx`
- `src/app/page.tsx`、`src/app/about/page.tsx`、`src/app/faq/page.tsx`、`src/app/layout.tsx`
- `supabase/migrations/0002_listings.sql`
- `scripts/generate-seed-sql.ts`
- `docs/{PROJECT_REQUIREMENTS,DATABASE_SCHEMA,ROUTES,NO_TRANSACTION_POLICY}.md`

### 测试结果

- `npm run lint`：通过，无警告或错误
- `npm run typecheck`：通过
- `npm run test`（Vitest）：6 个测试文件、33 个用例全部通过（未受影响，房源生命周期测试通过 mock 数据引用而非字段字面量，字段重命名未破坏测试）
- `npm run test:e2e`（Playwright）：8 个测试文件、108 个用例全部通过（发布表单默认类别为「出租」，`月租（欧元）`/`最短租期（月）`/`可入住日期` 等标签在出租默认态下保持不变，既有用例无需修改）
- `npm run build`：通过
- `npm run db:seed:sql`：成功重新生成，人工核对 `purpose`/`price_amount` 等列值正确
- 浏览器实测：真实启动 `next dev -p 3200 -H 0.0.0.0` 后台进程完整验证——首页新增「购房精选」分区正确展示 2 条已发布出售房源，各卡片出租/出售徽章、总价+人民币参考价（标注「总价」）渲染正确；`/listings?purpose=sale` 类别筛选正确返回 2 套已发布出售房源（排除待审核的博洛尼亚出售房源）；出售房源详情页（米兰）正确隐藏押金条款/最短租期/可养宠物标签，「可交房时间」标签替代「可入住时间」；发布表单实测切换类别下拉「出租→出售」，房型选择器正确收窄为仅「整租」、价格标签切换为「总价（欧元）」、押金条款/最短租期/可养宠物三项正确消失、日期标签切换为「可交房日期」；切回「出租」后全部字段与选项正确恢复；控制台全程无报错

### 过程中发现并修复的问题

- 新增的 3 条出售房源中，「博洛尼亚待审核出售房源」最初分配给 `profile-user-linfei`（与「米兰」「博洛尼亚（出租，待审核）」「威尼斯」共同构成他的房源组合），导致 `tests/e2e/account-journey.spec.ts` 中「我的房源管理页展示状态徽章」用例的 `getByText("待审核")` 断言从命中 1 个元素变为命中 2 个元素而报「strict mode violation」失败（3 个浏览器项目全部失败）。核实为本次新增数据与既有测试断言的组合冲突，而非测试或应用本身的缺陷，修复方式是将该出售房源的 `publisherId` 改为 `profile-user-giulia`（避免与 linfei 已有的待审核房源产生重复），复测全部 108 个用例通过

### 已知问题

- 出售房源的「可养宠物」概念在表单与详情页均已隐藏，但底层字段仍保留（值恒为 `false`），非真正的 schema 移除，属可接受的最小改动范围
- 出售类别未引入产权年限、税费计算、楼龄等真实房产交易场景常见的复杂字段，按用户要求「只是添加一个类别」的最小化范围执行，如后续需要可在此基础上扩展
- 首页新增的「出售房源」分区在出售房源数量为 0 时会自动隐藏（与「免中介费房源」分区逻辑一致），当前 mock 数据下必然可见

### 备份记录

见文首「备份记录汇总」。

### 下一阶段

无——本次为发布前的功能增补，后续如有新需求将按需追加。
