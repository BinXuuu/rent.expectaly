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
