/**
 * 种子数据 SQL 生成器。
 *
 * 用途：将 src/data/mock/ 中的 TypeScript 演示数据转换为可在真实 Supabase 项目执行的
 * INSERT 语句，用于搭建测试/演示环境，帮助验证 supabase/migrations/ 建立的表结构与 RLS 策略。
 *
 * 覆盖范围：本项目仅 12 张表（远少于「意购」项目的约 45 张），因此本生成器覆盖**全部**表，
 * 而非「意购」项目 `generate-seed-sql.ts` 那样的部分参考实现。
 *
 * 运行方式：`npm run db:seed:sql`（内部调用 `tsx scripts/generate-seed-sql.ts`），
 * 生成结果写入 `supabase/seed/generated-seed.sql`（不会自动执行、不会连接任何真实数据库）。
 *
 * 重要提醒：
 *   - 生成的 UUID 由原始 mock 字符串 ID 通过确定性 UUID v5 派生，同一 ID 每次生成结果一致，
 *     便于跨表外键引用对齐；但这些 UUID 与真实业务无关，仅用于演示/测试环境。
 *   - 不建议在真实生产 Supabase 项目导入这些虚构的房源/账号数据。
 */

import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  mockAuditLogs,
  mockCities,
  mockComments,
  mockContactRevealEvents,
  mockExchangeRates,
  mockFavorites,
  mockListingImages,
  mockListings,
  mockProfiles,
  mockReports,
  mockSystemSettings,
  mockUserRoleAssignments,
} from "../src/data/mock/index";

const __dirname = dirname(fileURLToPath(import.meta.url));

// RFC 4122 UUID v5，命名空间任取一个固定 UUID 常量（不必与官方保留命名空间一致，
// 只需在本项目内保持稳定，使同一输入始终映射到同一输出）。
const SEED_NAMESPACE = "2c9a6b1e-6b4a-4b8e-9b7a-1f7c9d4e5a3b";

function uuidV5(name: string, namespace: string = SEED_NAMESPACE): string {
  const namespaceBytes = Buffer.from(namespace.replace(/-/g, ""), "hex");
  const nameBytes = Buffer.from(name, "utf8");
  const hash = createHash("sha1")
    .update(Buffer.concat([namespaceBytes, nameBytes]))
    .digest();
  const bytes = hash.subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50; // version 5
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant RFC4122
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** 记录「原始 mock 字符串 ID -> 生成的 uuid」，供后续表的外键引用复用同一映射。 */
const idMap = new Map<string, string>();
function resolveId(rawId: string | null | undefined): string | null {
  if (!rawId) return null;
  if (!idMap.has(rawId)) {
    idMap.set(rawId, uuidV5(rawId));
  }
  return idMap.get(rawId)!;
}

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlJsonb(value: unknown): string {
  return `${sqlString(JSON.stringify(value))}::jsonb`;
}

function toSnakeCase(key: string): string {
  return key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
}

type FieldMap = Record<string, "id" | "fk" | "string" | "number" | "boolean" | "json" | "raw">;

/**
 * 通用扁平实体序列化：按 `fieldTypes` 声明的字段类型逐列生成 VALUES。
 * `fk` 字段会通过 `resolveId()` 转换为确定性 UUID。
 */
function serializeEntity(
  table: string,
  rows: Record<string, unknown>[],
  fieldTypes: FieldMap,
): string {
  if (rows.length === 0) return `-- ${table}: 无数据\n`;

  const columns = Object.keys(fieldTypes).map(toSnakeCase);
  const valueLines = rows.map((row) => {
    const values = Object.entries(fieldTypes).map(([field, type]) => {
      const raw = row[field];
      switch (type) {
        case "id":
        case "fk":
          return raw ? sqlString(resolveId(raw as string)!) : "NULL";
        case "boolean":
          return raw === null || raw === undefined ? "NULL" : raw ? "true" : "false";
        case "number":
          return raw === null || raw === undefined ? "NULL" : String(raw);
        case "json":
          return raw === null || raw === undefined ? "NULL" : sqlJsonb(raw);
        case "string":
        default:
          return raw === null || raw === undefined ? "NULL" : sqlString(String(raw));
      }
    });
    return `  (${values.join(", ")})`;
  });

  return (
    `insert into ${table} (${columns.join(", ")}) values\n` +
    `${valueLines.join(",\n")}\n` +
    `on conflict (id) do nothing;\n`
  );
}

function generateProfiles(): string {
  return serializeEntity("profiles", mockProfiles as unknown as Record<string, unknown>[], {
    id: "id",
    authUserId: "string", // 演示数据的 auth_user_id 非真实 Supabase Auth 用户，导入前需替换
    displayName: "string",
    avatarUrl: "string",
    email: "string",
    phone: "string",
    primaryProvider: "string",
    mainSiteUserId: "string",
    locale: "string",
    status: "string",
    lastLoginAt: "string",
    createdAt: "string",
    updatedAt: "string",
  });
}

function generateUserRoles(): string {
  return serializeEntity(
    "user_roles",
    mockUserRoleAssignments as unknown as Record<string, unknown>[],
    {
      id: "id",
      userId: "fk",
      role: "string",
      grantedAt: "string",
      grantedBy: "fk",
      createdAt: "string",
      updatedAt: "string",
    },
  );
}

function generateCities(): string {
  return serializeEntity("cities", mockCities as unknown as Record<string, unknown>[], {
    id: "id",
    slug: "string",
    name: "json",
    country: "string",
    heroImageUrl: "string",
    introduction: "json",
    sortOrder: "number",
    isVisible: "boolean",
    createdAt: "string",
    updatedAt: "string",
  });
}

/** listings 表把嵌套的 price 对象拆成了扁平列，需单独映射（不套用通用序列化）。 */
function generateListings(): string {
  if (mockListings.length === 0) return "-- listings: 无数据\n";

  const columns = [
    "id",
    "publisher_id",
    "purpose",
    "title",
    "description",
    "city_id",
    "address",
    "room_type",
    "area_sqm",
    "floor",
    "orientation",
    "renovation_condition",
    "price_amount",
    "price_currency",
    "cny_reference_price",
    "deposit_terms",
    "requires_agency_fee",
    "agency_fee_note",
    "has_contract",
    "contract_note",
    "min_lease_term_months",
    "available_from",
    "pets_allowed",
    "furnished",
    "move_in_ready",
    "transit_note",
    "validity_days",
    "published_at",
    "expires_at",
    "status",
    "requires_manual_review",
    "created_at",
    "updated_at",
  ];

  const valueLines = mockListings.map((l) => {
    const values = [
      sqlString(resolveId(l.id)!),
      sqlString(resolveId(l.publisherId)!),
      sqlString(l.purpose),
      sqlString(l.title),
      sqlString(l.description),
      sqlString(resolveId(l.cityId)!),
      sqlString(l.address),
      sqlString(l.roomType),
      String(l.areaSqm),
      l.floor ? sqlString(l.floor) : "NULL",
      l.orientation ? sqlString(l.orientation) : "NULL",
      sqlString(l.renovationCondition),
      String(l.price.amount),
      sqlString(l.price.currency),
      l.cnyReferencePrice === null ? "NULL" : String(l.cnyReferencePrice),
      l.depositTerms ? sqlString(l.depositTerms) : "NULL",
      l.requiresAgencyFee ? "true" : "false",
      l.agencyFeeNote ? sqlString(l.agencyFeeNote) : "NULL",
      l.hasContract ? "true" : "false",
      l.contractNote ? sqlString(l.contractNote) : "NULL",
      l.minLeaseTermMonths === null ? "NULL" : String(l.minLeaseTermMonths),
      sqlString(l.availableFrom),
      l.petsAllowed ? "true" : "false",
      l.furnished ? "true" : "false",
      l.moveInReady ? "true" : "false",
      l.transitNote ? sqlString(l.transitNote) : "NULL",
      String(l.validityDays),
      l.publishedAt ? sqlString(l.publishedAt) : "NULL",
      l.expiresAt ? sqlString(l.expiresAt) : "NULL",
      sqlString(l.status),
      l.requiresManualReview ? "true" : "false",
      sqlString(l.createdAt),
      sqlString(l.updatedAt),
    ];
    return `  (${values.join(", ")})`;
  });

  return (
    `insert into listings (${columns.join(", ")}) values\n` +
    `${valueLines.join(",\n")}\n` +
    `on conflict (id) do nothing;\n`
  );
}

function generateListingImages(): string {
  return serializeEntity(
    "listing_images",
    mockListingImages as unknown as Record<string, unknown>[],
    {
      id: "id",
      listingId: "fk",
      url: "string",
      sortOrder: "number",
      altText: "json",
      createdAt: "string",
      updatedAt: "string",
    },
  );
}

function generateComments(): string {
  return serializeEntity("comments", mockComments as unknown as Record<string, unknown>[], {
    id: "id",
    listingId: "fk",
    authorId: "fk",
    body: "string",
    status: "string",
    hiddenBy: "fk",
    hiddenReason: "string",
    createdAt: "string",
    updatedAt: "string",
  });
}

function generateFavorites(): string {
  return serializeEntity("favorites", mockFavorites as unknown as Record<string, unknown>[], {
    id: "id",
    userId: "fk",
    listingId: "fk",
    createdAt: "string",
  });
}

function generateContactRevealEvents(): string {
  return serializeEntity(
    "contact_reveal_events",
    mockContactRevealEvents as unknown as Record<string, unknown>[],
    {
      id: "id",
      userId: "fk",
      listingId: "fk",
      occurredAt: "string",
    },
  );
}

function generateReports(): string {
  return serializeEntity("reports", mockReports as unknown as Record<string, unknown>[], {
    id: "id",
    reportedType: "string",
    reportedId: "fk",
    reporterId: "fk",
    category: "string",
    description: "string",
    status: "string",
    handledBy: "fk",
    handledAt: "string",
    resolutionNote: "string",
    createdAt: "string",
    updatedAt: "string",
  });
}

function generateAuditLogs(): string {
  return serializeEntity("audit_logs", mockAuditLogs as unknown as Record<string, unknown>[], {
    id: "id",
    actorId: "fk",
    actorRole: "string",
    action: "string",
    targetType: "string",
    targetId: "fk",
    metadata: "json",
    occurredAt: "string",
    createdAt: "string",
    updatedAt: "string",
  });
}

function generateSystemSettings(): string {
  return serializeEntity(
    "system_settings",
    mockSystemSettings as unknown as Record<string, unknown>[],
    {
      id: "id",
      key: "string",
      value: "string",
      valueType: "string",
      description: "string",
      updatedBy: "fk",
      createdAt: "string",
      updatedAt: "string",
    },
  );
}

function generateExchangeRates(): string {
  return serializeEntity(
    "exchange_rates",
    mockExchangeRates as unknown as Record<string, unknown>[],
    {
      id: "id",
      baseCurrency: "string",
      quoteCurrency: "string",
      rate: "number",
      source: "string",
      effectiveAt: "string",
      isActive: "boolean",
      createdAt: "string",
      updatedAt: "string",
    },
  );
}

function main() {
  const sections = [
    "-- 自动生成，请勿手动编辑。运行 `npm run db:seed:sql` 重新生成。",
    "-- 仅用于测试/演示环境，导入前请阅读 docs/SEED_DATA_IMPORT.md。",
    "-- 业务表位于 rent schema 下（与「意购」「主站」共用同一个 Supabase 项目时避免表名冲突）。",
    "set search_path = rent;",
    "",
    "-- profiles",
    generateProfiles(),
    "-- user_roles",
    generateUserRoles(),
    "-- cities",
    generateCities(),
    "-- listings",
    generateListings(),
    "-- listing_images",
    generateListingImages(),
    "-- comments",
    generateComments(),
    "-- favorites",
    generateFavorites(),
    "-- contact_reveal_events",
    generateContactRevealEvents(),
    "-- reports",
    generateReports(),
    "-- audit_logs",
    generateAuditLogs(),
    "-- system_settings",
    generateSystemSettings(),
    "-- exchange_rates",
    generateExchangeRates(),
  ];

  const outputPath = resolve(__dirname, "../supabase/seed/generated-seed.sql");
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, sections.join("\n"), "utf8");
  console.log(`已生成种子数据 SQL：${outputPath}`);
}

main();
