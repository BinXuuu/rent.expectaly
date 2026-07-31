import "server-only";
import type { Profile, Role } from "@/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/lib/supabase/types";

function mapRowToProfile(row: ProfileRow, roles: Role[]): Profile {
  return {
    id: row.id,
    authUserId: row.auth_user_id,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    email: row.email,
    phone: row.phone,
    primaryProvider: row.primary_provider,
    mainSiteUserId: row.main_site_user_id,
    locale: row.locale,
    roles,
    status: row.status,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
  };
}

/**
 * 读取当前登录用户的 Profile；未登录、Supabase 未配置或会话失效时返回 null。
 * 真正的身份来自 Supabase Auth（auth.users），业务侧资料存在 rent.profiles，
 * 通过 auth_user_id 关联；角色存在 rent.user_roles（一个用户可有多个角色）。
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", auth.user.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (profileError || !profileRow) {
    if (profileError) console.error("getCurrentProfile", profileError.message);
    return null;
  }

  const { data: roleRows, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", profileRow.id)
    .is("deleted_at", null);

  if (roleError) {
    console.error("getCurrentProfile roles", roleError.message);
  }

  const roles = (roleRows ?? []).map((r) => r.role);

  return mapRowToProfile(profileRow, roles.length > 0 ? roles : ["user"]);
}
