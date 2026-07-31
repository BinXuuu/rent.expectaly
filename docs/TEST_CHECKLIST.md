# 测试检查清单（TEST_CHECKLIST）

> 状态：Stage 09 更新为实际执行记录。

## 每阶段通用验证项（Stage 00-09 全部执行）

- [x] `npm run lint` 通过，无警告或错误
- [x] `npm run typecheck` 通过
- [x] `npm run build` 通过
- [x] `npm run format:check` 通过
- [x] `npm run test`（Vitest）全部用例通过（6 个测试文件，33 个用例）
- [x] `npm run test:e2e`（Playwright）全部用例通过（8 个测试文件，108 个用例 × 3 浏览器项目）
- [x] 浏览器手动验证本阶段新增功能，控制台无报错

## Stage 09 端到端测试覆盖（`tests/e2e/`，108 个用例，chromium + firefox + mobile-chrome）

- [x] **首页**（`homepage.spec.ts`）：核心分区渲染、无横向溢出、浏览房源入口可达
- [x] **房源列表与详情**（`listings.spec.ts`）：筛选、详情字段与免责声明、草稿/已过期/已下架房源均返回 404
- [x] **登录与路由保护**（`auth-login.spec.ts`）：未登录重定向携带 `redirect` 参数、登录后正确跳转、退出登录后重新要求登录
- [x] **核心用户旅程**（`account-journey.spec.ts`）：发布房源表单提交、我的房源状态徽章、跨用户编辑越权拦截（404）、获取联系方式返回发帖人而非查看者、收藏切换、评论乐观展示、未登录时的登录引导文案
- [x] **平台后台**（`admin-portal.spec.ts`）：普通用户拒绝访问、内容审核员导航过滤、内容审核员直接访问 `/admin/roles` 被拦截且不泄露权限矩阵、管理员完整访问、举报处理弹层、房源审核队列
- [x] **移动端导航抽屉**（`navigation-drawer.spec.ts`）：主菜单抽屉、房源列表筛选抽屉
- [x] **可访问性扫描**（`accessibility.spec.ts`，axe-core）：首页/列表/详情/登录页/用户中心/后台仪表盘/法律文本页，均无 serious/critical 级别问题
- [x] **SEO**（`seo.spec.ts`）：`sitemap.xml` 仅收录公开可见房源、`robots.txt` 禁止后台路径、详情页 canonical 与标题正确

## 已知限制

- 未安装 WebKit 浏览器引擎（跳过 Safari 兼容性验证），移动端视口通过 Chromium 的 "Pixel 5" 设备预设覆盖
- E2E 测试运行时序偶发受 Turbopack 首次编译耗时影响，已将 `expect` 默认超时从 5s 放宽至 10s 缓解
