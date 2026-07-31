-- ============================================================================
-- 0001_extensions_and_core.sql
-- 扩展、公共约定与核心账号/城市实体（profiles、user_roles、cities）。
--
-- 通用约定（后续迁移文件均遵循）：
--   - 全部业务表位于独立的 `rent` schema 下，与「意购」「主站」共用同一个
--     Supabase 项目时互不冲突（仅共享 auth schema 下的 auth.users 表）。
--     见 docs/MAIN_SITE_INTEGRATION.md。
--   - 主键统一为 uuid，默认 gen_random_uuid()
--   - created_at / updated_at：timestamptz not null default now()
--   - deleted_at：timestamptz，软删除标记，null 表示未删除
--   - created_by / updated_by：references rent.profiles(id)，可为 null（系统/种子数据）
--   - RLS（行级安全策略）将在后续阶段随认证接入正式编写，本阶段仅建表结构。
--   - 本项目角色体系为简化四角色（游客/普通用户/内容审核员/管理员），
--     不存在商家/商品审核等「意购」项目特有角色。
-- ============================================================================

create extension if not exists "pgcrypto";

create schema if not exists rent;

create table if not exists rent.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  display_name text not null,
  avatar_url text,
  email text,
  phone text,
  primary_provider text not null default 'email'
    check (primary_provider in ('email', 'phone', 'main_site_sso')),
  main_site_user_id uuid, -- 主站账号互通映射，见 docs/MAIN_SITE_INTEGRATION.md
  locale text not null default 'zh-CN' check (locale in ('zh-CN', 'it-IT', 'en-US')),
  status text not null default 'active' check (status in ('active', 'suspended', 'banned')),
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid references rent.profiles(id),
  updated_by uuid references rent.profiles(id)
);

create unique index if not exists profiles_email_unique on rent.profiles (email) where deleted_at is null and email is not null;
create index if not exists profiles_main_site_user_id_idx on rent.profiles (main_site_user_id) where deleted_at is null;

create table if not exists rent.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references rent.profiles(id) on delete cascade,
  role text not null check (role in ('guest', 'user', 'content_reviewer', 'admin')),
  granted_at timestamptz not null default now(),
  granted_by uuid references rent.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid references rent.profiles(id),
  updated_by uuid references rent.profiles(id),
  unique (user_id, role)
);

create index if not exists user_roles_user_id_idx on rent.user_roles (user_id) where deleted_at is null;

create table if not exists rent.cities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name jsonb not null, -- LocalizedText，至少包含 "zh-CN" 键
  country text not null default 'Italia',
  hero_image_url text,
  introduction jsonb,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid references rent.profiles(id),
  updated_by uuid references rent.profiles(id)
);

create index if not exists cities_sort_order_idx on rent.cities (sort_order) where deleted_at is null;
-- ============================================================================
-- 0002_listings.sql
-- 房源核心实体（listings、listing_images）。
--
-- 明确不包含任何交易/支付/交付相关字段或表，详见 docs/NO_TRANSACTION_POLICY.md。
-- ============================================================================

create table if not exists rent.listings (
  id uuid primary key default gen_random_uuid(),
  publisher_id uuid not null references rent.profiles(id) on delete cascade,
  purpose text not null default 'rent' check (purpose in ('rent', 'sale')),
  title text not null,
  description text not null,
  city_id uuid not null references rent.cities(id),
  address text not null,
  room_type text not null check (room_type in ('entire_place', 'shared_room', 'private_room', 'bed_space')),
  area_sqm numeric(6, 2) not null check (area_sqm > 0),
  floor text,
  orientation text check (orientation in ('north', 'south', 'east', 'west', 'southeast', 'southwest')),
  renovation_condition text not null check (renovation_condition in ('luxury', 'standard', 'basic')),

  -- price_amount：出租为月租，出售为总价
  price_amount numeric(10, 2) not null check (price_amount > 0),
  price_currency text not null default 'EUR' check (price_currency in ('EUR', 'CNY')),
  cny_reference_price numeric(12, 2),
  deposit_terms text, -- 仅出租房源使用，出售房源恒为 null

  requires_agency_fee boolean not null default false,
  agency_fee_note text,
  has_contract boolean not null default false,
  contract_note text,

  min_lease_term_months integer check (min_lease_term_months > 0), -- 仅出租房源使用，出售房源恒为 null
  available_from date not null,
  pets_allowed boolean not null default false,
  furnished boolean not null default false,
  move_in_ready boolean not null default false,
  transit_note text,

  validity_days integer not null check (validity_days > 0),
  published_at timestamptz,
  expires_at timestamptz,

  status text not null default 'draft'
    check (status in ('draft', 'pending_review', 'published', 'expired', 'removed')),
  requires_manual_review boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid references rent.profiles(id),
  updated_by uuid references rent.profiles(id)
);

create index if not exists listings_publisher_id_idx on rent.listings (publisher_id) where deleted_at is null;
create index if not exists listings_city_id_idx on rent.listings (city_id) where deleted_at is null;
create index if not exists listings_purpose_idx on rent.listings (purpose) where deleted_at is null;
create index if not exists listings_status_idx on rent.listings (status) where deleted_at is null;
create index if not exists listings_expires_at_idx on rent.listings (expires_at) where deleted_at is null and status = 'published';

create table if not exists rent.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references rent.listings(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  alt_text jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid references rent.profiles(id),
  updated_by uuid references rent.profiles(id)
);

create index if not exists listing_images_listing_id_idx on rent.listing_images (listing_id) where deleted_at is null;
-- ============================================================================
-- 0003_engagement.sql
-- 用户互动实体（comments、favorites、contact_reveal_events）。
--
-- 明确不包含私信/会话类表，评论是用户之间唯一的公开互动渠道，
-- 详见 docs/PROJECT_REQUIREMENTS.md 第 7/8 节。
-- ============================================================================

create table if not exists rent.comments (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references rent.listings(id) on delete cascade,
  author_id uuid not null references rent.profiles(id) on delete cascade,
  body text not null,
  status text not null default 'visible' check (status in ('visible', 'hidden', 'removed')),
  hidden_by uuid references rent.profiles(id),
  hidden_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid references rent.profiles(id),
  updated_by uuid references rent.profiles(id)
);

create index if not exists comments_listing_id_idx on rent.comments (listing_id) where deleted_at is null;
create index if not exists comments_author_id_idx on rent.comments (author_id) where deleted_at is null;

create table if not exists rent.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references rent.profiles(id) on delete cascade,
  listing_id uuid not null references rent.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);

create index if not exists favorites_user_id_idx on rent.favorites (user_id);
create index if not exists favorites_listing_id_idx on rent.favorites (listing_id);

-- 「获取联系方式」点击事件，用于限流与滥用排查（见 docs/COMPLIANCE.md）
create table if not exists rent.contact_reveal_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references rent.profiles(id) on delete cascade,
  listing_id uuid not null references rent.listings(id) on delete cascade,
  occurred_at timestamptz not null default now()
);

create index if not exists contact_reveal_events_user_id_occurred_at_idx
  on rent.contact_reveal_events (user_id, occurred_at desc);
-- ============================================================================
-- 0004_trust_safety_and_settings.sql
-- 举报、审计日志、系统设置、汇率（reports、audit_logs、system_settings、exchange_rates）。
-- ============================================================================

create table if not exists rent.reports (
  id uuid primary key default gen_random_uuid(),
  reported_type text not null check (reported_type in ('listing', 'comment')),
  reported_id uuid not null,
  reporter_id uuid not null references rent.profiles(id) on delete cascade,
  category text not null check (category in (
    'false_information', 'fraud_suspicion', 'duplicate', 'already_rented',
    'abusive_content', 'spam', 'other'
  )),
  description text not null,
  status text not null default 'pending'
    check (status in ('pending', 'investigating', 'resolved', 'dismissed', 'removed')),
  handled_by uuid references rent.profiles(id),
  handled_at timestamptz,
  resolution_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid references rent.profiles(id),
  updated_by uuid references rent.profiles(id)
);

create index if not exists reports_status_idx on rent.reports (status) where deleted_at is null;
create index if not exists reports_reported_idx on rent.reports (reported_type, reported_id) where deleted_at is null;

create table if not exists rent.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references rent.profiles(id),
  actor_role text check (actor_role in ('guest', 'user', 'content_reviewer', 'admin')),
  action text not null,
  target_type text not null,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid references rent.profiles(id),
  updated_by uuid references rent.profiles(id)
);

create index if not exists audit_logs_occurred_at_idx on rent.audit_logs (occurred_at desc);

create table if not exists rent.system_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null,
  value_type text not null check (value_type in ('boolean', 'number', 'string', 'json')),
  description text,
  updated_by uuid references rent.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid references rent.profiles(id)
);

create table if not exists rent.exchange_rates (
  id uuid primary key default gen_random_uuid(),
  base_currency text not null check (base_currency in ('EUR', 'CNY')),
  quote_currency text not null check (quote_currency in ('EUR', 'CNY')),
  rate numeric(12, 6) not null check (rate > 0),
  source text not null default 'manual' check (source in ('manual', 'external_api')),
  effective_at timestamptz not null default now(),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid references rent.profiles(id),
  updated_by uuid references rent.profiles(id)
);

create index if not exists exchange_rates_pair_idx on rent.exchange_rates (base_currency, quote_currency) where deleted_at is null and is_active;
-- ============================================================================
-- 0005_row_level_security.sql
-- 行级安全策略（RLS）草案 —— Stage 07（举报与内容审核后台）。
--
-- 重要说明：
--   - 本文件为策略草案，尚未在真实 Supabase 项目上执行，随真实 Supabase Auth 接入时
--     需结合实际 auth.uid() 语义与压力测试重新验证，不构成已生效的安全边界。
--   - 角色判断逻辑对应 src/lib/permissions/matrix.ts 的权限矩阵（4 角色：
--     guest / user / content_reviewer / admin），两侧变更需同步维护。
--   - 所有策略遵循「默认拒绝」原则：先 enable row level security，
--     再逐条显式授权，未列出的操作（如 delete）默认不可执行。
--   - 软删除记录（deleted_at 非空）不在本文件重复过滤，读策略中按需叠加。
--   - 辅助函数建在 rent schema 下（而非 public），与「意购」「主站」共用同一个
--     Supabase 项目时不会与同名函数冲突。
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 辅助函数：角色与归属判断
-- ----------------------------------------------------------------------------

create or replace function rent.app_current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = rent
as $$
  select id from rent.profiles where auth_user_id = auth.uid() and deleted_at is null limit 1;
$$;

create or replace function rent.app_has_role(check_role text)
returns boolean
language sql
stable
security definer
set search_path = rent
as $$
  select exists (
    select 1 from rent.user_roles
    where user_id = rent.app_current_profile_id()
      and role = check_role
      and deleted_at is null
  );
$$;

-- 平台后台角色（对应 AdminNav / admin/layout.tsx 中的 ADMIN_FAMILY_ROLES）
create or replace function rent.app_is_staff()
returns boolean
language sql
stable
security definer
set search_path = rent
as $$
  select exists (
    select 1 from rent.user_roles
    where user_id = rent.app_current_profile_id()
      and role in ('content_reviewer', 'admin')
      and deleted_at is null
  );
$$;

create or replace function rent.app_is_admin()
returns boolean
language sql
stable
security definer
set search_path = rent
as $$
  select rent.app_has_role('admin');
$$;

-- ----------------------------------------------------------------------------
-- profiles / user_roles（0001）
-- ----------------------------------------------------------------------------

alter table rent.profiles enable row level security;

create policy profiles_select_own_or_staff on rent.profiles
  for select using (id = rent.app_current_profile_id() or rent.app_is_staff());

create policy profiles_update_own on rent.profiles
  for update using (id = rent.app_current_profile_id());

alter table rent.user_roles enable row level security;

create policy user_roles_select_own_or_staff on rent.user_roles
  for select using (user_id = rent.app_current_profile_id() or rent.app_is_staff());

create policy user_roles_manage_admin on rent.user_roles
  for all using (rent.app_is_admin()) with check (rent.app_is_admin());

-- ----------------------------------------------------------------------------
-- cities（0001）
-- ----------------------------------------------------------------------------

alter table rent.cities enable row level security;

create policy cities_select_visible_or_staff on rent.cities
  for select using (is_visible or rent.app_is_staff());

create policy cities_manage_admin on rent.cities
  for all using (rent.app_is_admin()) with check (rent.app_is_admin());

-- ----------------------------------------------------------------------------
-- listings / listing_images（0002）
-- ----------------------------------------------------------------------------

alter table rent.listings enable row level security;

-- 公开可见：已发布且未过期；发帖人可查看自己的全部状态；staff 可查看全部
create policy listings_select_public_own_or_staff on rent.listings
  for select using (
    (status = 'published' and (expires_at is null or expires_at > now()))
    or publisher_id = rent.app_current_profile_id()
    or rent.app_is_staff()
  );

create policy listings_insert_own on rent.listings
  for insert with check (publisher_id = rent.app_current_profile_id());

create policy listings_update_own_or_staff on rent.listings
  for update using (publisher_id = rent.app_current_profile_id() or rent.app_is_staff());

alter table rent.listing_images enable row level security;

create policy listing_images_select_via_listing on rent.listing_images
  for select using (
    exists (
      select 1 from rent.listings l
      where l.id = listing_images.listing_id
        and (
          (l.status = 'published' and (l.expires_at is null or l.expires_at > now()))
          or l.publisher_id = rent.app_current_profile_id()
          or rent.app_is_staff()
        )
    )
  );

create policy listing_images_manage_own on rent.listing_images
  for all using (
    exists (
      select 1 from rent.listings l
      where l.id = listing_images.listing_id and l.publisher_id = rent.app_current_profile_id()
    )
  );

-- ----------------------------------------------------------------------------
-- comments / favorites / contact_reveal_events（0003）
-- ----------------------------------------------------------------------------

alter table rent.comments enable row level security;

create policy comments_select_visible_own_or_staff on rent.comments
  for select using (
    status = 'visible' or author_id = rent.app_current_profile_id() or rent.app_is_staff()
  );

create policy comments_insert_own on rent.comments
  for insert with check (author_id = rent.app_current_profile_id());

create policy comments_update_own_or_staff on rent.comments
  for update using (author_id = rent.app_current_profile_id() or rent.app_is_staff());

alter table rent.favorites enable row level security;

create policy favorites_manage_own on rent.favorites
  for all using (user_id = rent.app_current_profile_id())
  with check (user_id = rent.app_current_profile_id());

alter table rent.contact_reveal_events enable row level security;

create policy contact_reveal_events_select_own_or_staff on rent.contact_reveal_events
  for select using (user_id = rent.app_current_profile_id() or rent.app_is_staff());

create policy contact_reveal_events_insert_own on rent.contact_reveal_events
  for insert with check (user_id = rent.app_current_profile_id());

-- ----------------------------------------------------------------------------
-- reports / audit_logs / system_settings / exchange_rates（0004）
-- ----------------------------------------------------------------------------

alter table rent.reports enable row level security;

create policy reports_select_own_or_staff on rent.reports
  for select using (reporter_id = rent.app_current_profile_id() or rent.app_is_staff());

create policy reports_insert_own on rent.reports
  for insert with check (reporter_id = rent.app_current_profile_id());

create policy reports_update_staff on rent.reports
  for update using (rent.app_is_staff());

alter table rent.audit_logs enable row level security;

create policy audit_logs_select_staff on rent.audit_logs
  for select using (rent.app_is_staff());

create policy audit_logs_insert_staff on rent.audit_logs
  for insert with check (rent.app_is_staff());

alter table rent.system_settings enable row level security;

create policy system_settings_select_all on rent.system_settings
  for select using (true);

create policy system_settings_manage_admin on rent.system_settings
  for all using (rent.app_is_admin()) with check (rent.app_is_admin());

alter table rent.exchange_rates enable row level security;

create policy exchange_rates_select_active on rent.exchange_rates
  for select using (is_active or rent.app_is_staff());

create policy exchange_rates_manage_admin on rent.exchange_rates
  for all using (rent.app_is_admin()) with check (rent.app_is_admin());
