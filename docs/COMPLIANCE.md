# 合规文档（COMPLIANCE）

> 状态：Stage 07 更新为完整实现文档。本项目的合规重点是**内容审核与法律免责声明**，与「意购」项目「受限制商品（年龄/地区限制）」的合规重点不同——本项目不涉及实体商品，因此不存在年龄确认、地区配送限制等机制。

## 1. 内容真实性与举报闭环

- 房源信息由个人自主发布，平台无法逐一核实真实性，通过 **举报机制**（`/listings/[id]` 详情页 `ReportDialog` 组件）与 **风险关键词自动预警**（`src/lib/services/compliance-service.ts`）降低虚假/欺诈房源风险。
- 举报对象：房源（`reportedType: "listing"`）与评论（`reportedType: "comment"`），举报分类见 `docs/DATABASE_SCHEMA.md`。
- 举报处理闭环：内容审核员在 `/admin/reports` 查看待处理/已处理列表，通过 `ReviewDialog` 组件提交处理决定（标记已处理/驳回/下架-隐藏内容），第一期为界面交互演示，未接入真实状态写入。

## 2. 风险关键词自动预警（已实现）

- 关键词来源：`system_settings.risk_keywords`（`valueType: "json"`，字符串数组），演示数据见 `src/data/mock/system-settings.ts`（如「内部渠道」「免中介急租」「低价急租」「无需看房」）。
- `parseRiskKeywords()` / `findRiskKeywordMatches()` / `containsRiskKeyword()`：`src/lib/services/compliance-service.ts`，6 个单元测试覆盖。
- 接入位置：`/admin/reports`（举报描述命中时高亮）、`/admin/listings`（房源标题+描述命中时高亮）。本身不构成自动下架决定，最终处置仍需内容审核员人工判断。

## 3. 联系方式滥用防范（已实现，见 Stage 01/06）

- 「获取联系方式」按钮需登录 + 限流（`src/lib/services/contact-reveal-service.ts`，阈值从 `system_settings` 读取）。
- 联系方式解析的是**房源发帖人**（`listing.publisherId` 对应 profile 的 phone/email），而非查看者本人，浏览器实测已验证（见 `docs/PROGRESS.md` Stage 06）。
- 记录点击事件供审核排查使用（`contact_reveal_events`），第一期只做限流的只读判断，暂不写入新事件记录。

## 4. 平台责任边界声明

平台仅提供信息展示与撮合入口，不参与看房、签约、付款、履约，不对房源真实性、房东身份、合同条款、线下交易结果承担责任（详见 [NO_TRANSACTION_POLICY.md](./NO_TRANSACTION_POLICY.md)），并在房源详情页、首页、法律文本页面均有对应免责声明文案。

## 5. 合同/中介费提示

房源「有无合同」标签附带说明——在意大利，正式登记合同对外国租客的居留许可申请/续签具有法律意义，但页面提示仅为一般性信息，不构成法律意见，具体以租客自行核实的合同条款与当地法规为准（见房源详情页 `contractNote` 字段展示）。

## 6. 法律文本页面（`/legal/[slug]`，已实现，见 Stage 03）

- 用户协议（`user-agreement`）
- 隐私政策（`privacy-policy`）
- 免责声明（`disclaimer`）
- 内容发布规范（`content-guidelines`）
- 举报处理规则（`report-handling-policy`）

5 篇均通过 `generateStaticParams` 静态生成，含「待法律顾问审核」提示横幅。

## 7. RLS 策略草案（已实现，Stage 07）

`supabase/migrations/0005_row_level_security.sql`：覆盖 `profiles`/`user_roles`/`cities`/`listings`/`listing_images`/`comments`/`favorites`/`contact_reveal_events`/`reports`/`audit_logs`/`system_settings`/`exchange_rates` 全部 12 张表，包含角色判断辅助函数（`app_current_profile_id`/`app_has_role`/`app_is_staff`/`app_is_admin`）与逐表 select/insert/update 策略，语义与 `src/lib/permissions/matrix.ts` 保持一致。关键设计：

- `listings` 的 select 策略同时判断 `status = 'published'` 与 `expires_at > now()`，落地房源有效期到期自动不可见的语义。
- `comments` 的 select 策略仅公开 `status = 'visible'` 的评论，隐藏/已删除评论仅作者本人与 staff 可见。
- 不存在任何交易类表，因此没有订单/支付相关的 RLS 策略。

## 8. 待补充

- 正式上线前需法务顾问审核全部法律文本
- RLS 策略为草案，尚未在真实 Supabase 项目上执行验证
- 账号封禁、内容强制下架的后果仍为界面交互演示，未接入真实数据写入
