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
