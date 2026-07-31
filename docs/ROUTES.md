# 路由文档（ROUTES）

> 状态：Stage 08 更新为实际实现状态。

## 公开页面（已实现）

- `/`：首页（精选最新房源、免中介费房源、热门城市、平台说明入口）
- `/listings`：房源列表/搜索页（筛选：出租/出售类别、城市、房型、中介费、合同、宠物、价格区间；排序；网格/列表视图切换；移动端筛选抽屉；空状态）
- `/listings/[id]`：房源详情页（图库占位、完整字段展示、评论只读列表、举报入口、有效期倒计时；未发布/已下架/已过期房源返回 404）
- `/cities`、`/cities/[slug]`：城市列表/详情（详情页聚合该城市下的公开可见房源）
- `/about`、`/faq`：平台说明（含无交易机制/联系方式获取机制说明）、常见问题（手风琴交互）
- `/legal/[slug]`：5 篇法律文本模板（`user-agreement`/`privacy-policy`/`disclaimer`/`content-guidelines`/`report-handling-policy`），均通过 `generateStaticParams` 静态生成，含「待法律顾问审核」提示
- `/sitemap.xml`、`/robots.ts`：已接入，房源仅收录公开可见（已发布且未过期）的条目

## 认证（已实现）

- `/auth/login`：邮箱/手机号登录 + 3 种角色演示账号快捷登录
- `/auth/register`：开发环境临时账号注册

## 需要登录（已实现）

- `/account`：用户中心概览（我的房源/收藏/评论统计卡片）
- `/account/listings`：我的房源管理（状态徽章、编辑、下架/重新发布交互）
- `/account/listings/[id]/edit`：编辑房源（服务端校验 `publisherId` 归属，非本人房源返回 404）
- `/account/favorites`：我的收藏
- `/account/comments`：我的评论
- `/account/settings`：账号设置
- `/listings/new`：发布房源

## 平台管理后台（`/admin/**`，仅内容审核员/管理员可访问，全部已实现）

- `/admin`：仪表盘（数据卡片按角色权限动态展示：待处理举报/待审核房源/平台用户总数）
- `/admin/reports`：举报处理（待处理/已处理分组，命中风险关键词高亮，`ReviewDialog` 处理决定演示）
- `/admin/listings`：房源管理（待审核分组置顶，命中风险关键词高亮）
- `/admin/comments`：评论管理（隐藏/删除状态徽章，`ReviewDialog` 隐藏交互演示）
- `/admin/users`：用户管理（页面级二次校验仅管理员，全平台账号列表 + 角色徽章）
- `/admin/cities`：城市管理（页面级二次校验仅管理员，城市可见性状态）
- `/admin/settings`：系统设置（页面级二次校验仅管理员，配置项只读展示）
- `/admin/roles`：角色权限查看（页面级二次校验仅管理员，权限矩阵只读展示，不泄露给内容审核员）
- `/admin/audit-logs`：审计日志（页面级二次校验仅管理员，最近操作记录）

## 明确不存在的路由

- 无 `/cart`、`/checkout`、`/account/orders` 等交易类路由
- 无私信/会话类路由（如 `/messages`）
- 无商家入驻/商家后台路由
- 无 `/auth/callback`（当前无第三方 OAuth provider 需要占位，见 `docs/MAIN_SITE_INTEGRATION.md`）

## 内部页面

- `/internal/ui-kit`：设计系统组件展示页（`noindex`）
