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
