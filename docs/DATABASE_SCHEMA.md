# 数据库架构文档（DATABASE_SCHEMA）

> 状态：Stage 07 更新，对应 `supabase/migrations/0001~0005`（`0005` 为 RLS 策略草案）。

## 通用约定

- 主键统一为 `uuid`，默认 `gen_random_uuid()`
- `created_at` / `updated_at`：`timestamptz not null default now()`
- `deleted_at`：`timestamptz`，软删除标记，`null` 表示未删除
- `created_by` / `updated_by`：`references profiles(id)`，可为 `null`（系统/种子数据）
- 多语言字段（`LocalizedText`）以 `jsonb` 存储，至少包含 `"zh-CN"` 键
- RLS（行级安全策略）草案见 `supabase/migrations/0005_row_level_security.sql`（详见本文档「RLS 策略草案」一节与 [COMPLIANCE.md](./COMPLIANCE.md) 第 7 节）

## 核心实体（10 张表，对应 `src/types/`）

| 表                      | 迁移文件 | 对应类型             | 说明                                                                  |
| ----------------------- | -------- | -------------------- | --------------------------------------------------------------------- |
| `profiles`              | `0001`   | `Profile`            | 账号资料，真实认证信息由 Supabase Auth 管理                           |
| `user_roles`            | `0001`   | `UserRoleAssignment` | 角色分配（`guest`/`user`/`content_reviewer`/`admin`）                 |
| `cities`                | `0001`   | `City`               | 复用「意购」项目已建立的 10 个意大利城市集合（独立维护）              |
| `listings`              | `0002`   | `Listing`            | 房源核心实体，字段覆盖 `docs/PROJECT_REQUIREMENTS.md` 第 5 节全部标签 |
| `listing_images`        | `0002`   | `ListingImage`       | 房源图片，第一期为占位图                                              |
| `comments`              | `0003`   | `Comment`            | 房源下的公开评论，替代 1 对 1 私信                                    |
| `favorites`             | `0003`   | `Favorite`           | 收藏（用户 × 房源，唯一约束防重复收藏）                               |
| `contact_reveal_events` | `0003`   | `ContactRevealEvent` | 「获取联系方式」点击事件，用于限流判断                                |
| `reports`               | `0004`   | `Report`             | 举报（房源/评论）                                                     |
| `audit_logs`            | `0004`   | `AuditLog`           | 平台后台操作审计轨迹                                                  |
| `system_settings`       | `0004`   | `SystemSetting`      | 后台可配置键值项（有效期选项、限流阈值、风险关键词）                  |
| `exchange_rates`        | `0004`   | `ExchangeRate`       | 汇率（仅 EUR ↔ CNY，用于月租参考价换算）                              |

## 明确不存在的表

- 无 `orders`、`payments`、`cart_items` 等任何交易类表（见 [NO_TRANSACTION_POLICY.md](./NO_TRANSACTION_POLICY.md)）
- 无 `merchants`、`merchant_members` 等商家体系表
- 无 `conversations`、`messages` 等私信/会话类表
- 无 `addresses`（房源交易发生在线下，平台不承担收货地址职责）

## `listings` 关键字段说明

- `purpose`：`rent`（出租）/ `sale`（出售）。两种类别共用同一张表与同一套标签体系，仅价格语义与部分字段的可空性不同（见下）
- `price_amount` / `price_currency` / `cny_reference_price`：出租为月租、出售为总价，字段名不含 `rent` 字样以适配两种类别
- `min_lease_term_months` / `deposit_terms`：仅出租类别使用，出售类别恒为 `null`（`min_lease_term_months` 已从 `not null` 改为可空列以适配此语义）
- `pets_allowed`：仅出租类别在页面展示，出售类别的列值恒为 `false` 但不作为业务判断依据
- `requires_agency_fee` / `agency_fee_note`：是否需要中介费标签，出租/出售通用
- `has_contract` / `contract_note`：是否有正式合同标签（出租指正式登记合同，对居留许可有法律意义；出售指正式购房预约合同 compromesso），见 [COMPLIANCE.md](./COMPLIANCE.md)
- `validity_days` + `published_at` → `expires_at`：发帖时自选有效期，到期后由 `src/lib/services/listing-lifecycle-service.ts` 判断并在页面层过滤下架，实际的数据库定时任务（如 Supabase 的 `pg_cron` 或边缘函数轮询）将在接入真实 Supabase 项目时设计
- `status`：`draft` → `pending_review`（可选，命中风险关键词触发）→ `published` → `expired` / `removed`

## RLS 策略草案（已实现）

`supabase/migrations/0005_row_level_security.sql` 覆盖以上全部 12 张表，包含角色判断辅助函数（`app_current_profile_id`/`app_has_role`/`app_is_staff`/`app_is_admin`）与逐表 select/insert/update 策略。关键设计：`listings` 的 select 策略同时判断 `status = 'published'` 与 `expires_at > now()`，落地房源有效期到期自动不可见的语义；`comments` 的 select 策略仅公开 `status = 'visible'` 的评论。详见 [COMPLIANCE.md](./COMPLIANCE.md) 第 7 节。

## 待补充

- 房源到期的定时任务实现方案：Stage 10（发布准备）确定 Supabase 项目后设计
- RLS 策略为草案，尚未在真实 Supabase 项目上执行验证
