# 架构文档（ARCHITECTURE）

> 状态：Stage 00 建立，仅记录技术选型与路径隔离规则，具体架构细节将随 Stage 01 类型/数据层设计逐步补充。

## 1. 技术栈

- **框架**：Next.js 16（App Router，`src/` 目录，Turbopack）。**本版本相对训练数据存在破坏性变更**，涉及框架新特性（路由、`middleware` → `proxy` 重命名等）时须先查阅 `node_modules/next/dist/docs/`。
- **语言**：TypeScript（strict）
- **UI**：React 19 + Tailwind CSS v4
- **代码规范**：ESLint 9 + `eslint-config-next` + `eslint-config-prettier`；Prettier + `prettier-plugin-tailwindcss`
- **数据库（规划）**：Supabase（Postgres + Auth + Storage + RLS），第一期以本地演示数据（`src/data/mock/`）+ Repository/Service 抽象层实现，迁移 SQL 草案先行编写（`supabase/migrations/`）
- **测试**：Vitest（单元测试）、Playwright（端到端测试，Stage 09 引入）

## 2. 路径隔离规则（严格执行）

- **项目目录**：`C:\网站\意料之中-意租`（唯一允许的代码写入位置）
- **备份目录**：`D:\网页备份\意料之中-意租`（唯一允许的备份写入位置）
- 任何脚本执行前应通过 `scripts/safety-check.ps1` 校验目标路径。
- **禁止触碰**：`C:\网站\意料之中-shop`（姊妹项目「意购」）、`C:\网站\意料之中`（主站 expectaly.com）、`C:\网站\` 下的任何其他兄弟项目。

## 3. 分层架构（与「意购」项目一致的模式）

- `src/types/`：唯一类型来源
- `src/lib/permissions/`：角色与权限矩阵、守卫函数
- `src/lib/repositories/`：只读数据访问接口（第一期基于内存演示数据）
- `src/lib/services/`：业务逻辑（如汇率换算、房源有效期到期判断、限流判断）
- `src/data/mock/`：演示数据
- `src/lib/config/feature-flags.ts`：功能开关（本项目预期功能开关远少于「意购」，因为不存在支付/微信登录等预留能力；如需要会在 Stage 01 明确列出）
- `src/app/`：页面与路由
- `src/components/`：UI 组件（Stage 02 起大量复用「意购」已验证的设计系统模式，但代码独立维护，不做跨项目 import）

## 4. 与「意购」的关系

两个项目是**完全独立**的代码库，不共享 `node_modules`、不共享构建产物、不做跨项目 import。视觉设计语言、部分工程规范（ESLint/Prettier 配置、备份脚本模式）会参考「意购」的既有实现重新编写一份适配本项目的版本，但不建立代码依赖关系。账号体系互通规划见 [MAIN_SITE_INTEGRATION.md](./MAIN_SITE_INTEGRATION.md)。

## 5. 待补充

- 数据库详细设计：见 [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)（Stage 01 起补充实体设计）
- 功能开关清单：Stage 01 补充
