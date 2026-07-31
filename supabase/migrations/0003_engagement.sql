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
