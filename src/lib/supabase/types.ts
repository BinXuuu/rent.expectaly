/**
 * 与 supabase/migrations/0001~0004 一一对应的表结构类型。
 * 字段增删需同步更新对应的迁移文件与本文件，两者必须保持一致。
 */

export type Database = {
  rent: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          auth_user_id: string;
          display_name: string;
          avatar_url: string | null;
          email: string | null;
          phone: string | null;
          primary_provider: "email" | "phone" | "main_site_sso";
          main_site_user_id: string | null;
          locale: "zh-CN" | "it-IT" | "en-US";
          status: "active" | "suspended" | "banned";
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Partial<Database["rent"]["Tables"]["profiles"]["Row"]> & {
          auth_user_id: string;
          display_name: string;
        };
        Update: Partial<Database["rent"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: "guest" | "user" | "content_reviewer" | "admin";
          granted_at: string;
          granted_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Partial<Database["rent"]["Tables"]["user_roles"]["Row"]> & {
          user_id: string;
          role: "guest" | "user" | "content_reviewer" | "admin";
        };
        Update: Partial<Database["rent"]["Tables"]["user_roles"]["Row"]>;
        Relationships: [];
      };
      cities: {
        Row: {
          id: string;
          slug: string;
          name: Record<string, string>;
          country: string;
          hero_image_url: string | null;
          introduction: Record<string, string> | null;
          sort_order: number;
          is_visible: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Partial<Database["rent"]["Tables"]["cities"]["Row"]> & {
          slug: string;
          name: Record<string, string>;
        };
        Update: Partial<Database["rent"]["Tables"]["cities"]["Row"]>;
        Relationships: [];
      };
      listings: {
        Row: {
          id: string;
          publisher_id: string;
          purpose: "rent" | "sale";
          title: string;
          description: string;
          city_id: string;
          address: string;
          room_type: "entire_place" | "shared_room" | "private_room" | "bed_space";
          area_sqm: number;
          floor: string | null;
          orientation:
            | "north"
            | "south"
            | "east"
            | "west"
            | "southeast"
            | "southwest"
            | null;
          renovation_condition: "luxury" | "standard" | "basic";
          price_amount: number;
          price_currency: "EUR" | "CNY";
          cny_reference_price: number | null;
          deposit_terms: string | null;
          requires_agency_fee: boolean;
          agency_fee_note: string | null;
          has_contract: boolean;
          contract_note: string | null;
          min_lease_term_months: number | null;
          available_from: string;
          pets_allowed: boolean;
          furnished: boolean;
          move_in_ready: boolean;
          transit_note: string | null;
          validity_days: number;
          published_at: string | null;
          expires_at: string | null;
          status: "draft" | "pending_review" | "published" | "expired" | "removed";
          requires_manual_review: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Partial<Database["rent"]["Tables"]["listings"]["Row"]> & {
          publisher_id: string;
          title: string;
          description: string;
          city_id: string;
          address: string;
          room_type: "entire_place" | "shared_room" | "private_room" | "bed_space";
          area_sqm: number;
          renovation_condition: "luxury" | "standard" | "basic";
          price_amount: number;
          available_from: string;
          validity_days: number;
        };
        Update: Partial<Database["rent"]["Tables"]["listings"]["Row"]>;
        Relationships: [];
      };
      listing_images: {
        Row: {
          id: string;
          listing_id: string;
          url: string;
          sort_order: number;
          alt_text: Record<string, string> | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Partial<Database["rent"]["Tables"]["listing_images"]["Row"]> & {
          listing_id: string;
          url: string;
        };
        Update: Partial<Database["rent"]["Tables"]["listing_images"]["Row"]>;
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          listing_id: string;
          author_id: string;
          body: string;
          status: "visible" | "hidden" | "removed";
          hidden_by: string | null;
          hidden_reason: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Partial<Database["rent"]["Tables"]["comments"]["Row"]> & {
          listing_id: string;
          author_id: string;
          body: string;
        };
        Update: Partial<Database["rent"]["Tables"]["comments"]["Row"]>;
        Relationships: [];
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: Partial<Database["rent"]["Tables"]["favorites"]["Row"]> & {
          user_id: string;
          listing_id: string;
        };
        Update: Partial<Database["rent"]["Tables"]["favorites"]["Row"]>;
        Relationships: [];
      };
      contact_reveal_events: {
        Row: {
          id: string;
          user_id: string;
          listing_id: string;
          occurred_at: string;
        };
        Insert: Partial<Database["rent"]["Tables"]["contact_reveal_events"]["Row"]> & {
          user_id: string;
          listing_id: string;
        };
        Update: Partial<Database["rent"]["Tables"]["contact_reveal_events"]["Row"]>;
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          reported_type: "listing" | "comment";
          reported_id: string;
          reporter_id: string;
          category:
            | "false_information"
            | "fraud_suspicion"
            | "duplicate"
            | "already_rented"
            | "abusive_content"
            | "spam"
            | "other";
          description: string;
          status: "pending" | "investigating" | "resolved" | "dismissed" | "removed";
          handled_by: string | null;
          handled_at: string | null;
          resolution_note: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Partial<Database["rent"]["Tables"]["reports"]["Row"]> & {
          reported_type: "listing" | "comment";
          reported_id: string;
          reporter_id: string;
          category:
            | "false_information"
            | "fraud_suspicion"
            | "duplicate"
            | "already_rented"
            | "abusive_content"
            | "spam"
            | "other";
          description: string;
        };
        Update: Partial<Database["rent"]["Tables"]["reports"]["Row"]>;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          actor_role: "guest" | "user" | "content_reviewer" | "admin" | null;
          action: string;
          target_type: string;
          target_id: string | null;
          metadata: Record<string, unknown>;
          occurred_at: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Partial<Database["rent"]["Tables"]["audit_logs"]["Row"]> & {
          action: string;
          target_type: string;
        };
        Update: Partial<Database["rent"]["Tables"]["audit_logs"]["Row"]>;
        Relationships: [];
      };
      system_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          value_type: "boolean" | "number" | "string" | "json";
          description: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          created_by: string | null;
        };
        Insert: Partial<Database["rent"]["Tables"]["system_settings"]["Row"]> & {
          key: string;
          value: string;
          value_type: "boolean" | "number" | "string" | "json";
        };
        Update: Partial<Database["rent"]["Tables"]["system_settings"]["Row"]>;
        Relationships: [];
      };
      exchange_rates: {
        Row: {
          id: string;
          base_currency: "EUR" | "CNY";
          quote_currency: "EUR" | "CNY";
          rate: number;
          source: "manual" | "external_api";
          effective_at: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: Partial<Database["rent"]["Tables"]["exchange_rates"]["Row"]> & {
          base_currency: "EUR" | "CNY";
          quote_currency: "EUR" | "CNY";
          rate: number;
        };
        Update: Partial<Database["rent"]["Tables"]["exchange_rates"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ProfileRow = Database["rent"]["Tables"]["profiles"]["Row"];
export type UserRoleRow = Database["rent"]["Tables"]["user_roles"]["Row"];
export type CityRow = Database["rent"]["Tables"]["cities"]["Row"];
export type ListingRow = Database["rent"]["Tables"]["listings"]["Row"];
export type ListingImageRow = Database["rent"]["Tables"]["listing_images"]["Row"];
export type CommentRow = Database["rent"]["Tables"]["comments"]["Row"];
export type FavoriteRow = Database["rent"]["Tables"]["favorites"]["Row"];
export type ContactRevealEventRow = Database["rent"]["Tables"]["contact_reveal_events"]["Row"];
export type ReportRow = Database["rent"]["Tables"]["reports"]["Row"];
export type AuditLogRow = Database["rent"]["Tables"]["audit_logs"]["Row"];
export type SystemSettingRow = Database["rent"]["Tables"]["system_settings"]["Row"];
export type ExchangeRateRow = Database["rent"]["Tables"]["exchange_rates"]["Row"];
