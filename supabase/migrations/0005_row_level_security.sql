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
