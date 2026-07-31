# 角色与权限文档（ROLES_AND_PERMISSIONS）

> 状态：Stage 01 更新为实际实现文档，对应 `src/lib/permissions/`。

## 角色（4 种）

1. **游客**：浏览房源列表/详情/城市页、搜索。不可发帖、评论、收藏、获取联系方式。
2. **普通用户**：游客权限 + 发布/编辑/下架自己的房源、评论、收藏、获取联系方式、举报房源与评论。
3. **内容审核员**：处理举报队列、下架违规房源、隐藏违规评论。不具备用户管理、系统设置权限。
4. **管理员**：全部权限，包括用户管理、城市管理、系统设置、角色权限查看、审计日志。

## 实现说明

- 权限资源（`PermissionResource`）：`listing`、`comment`、`favorite`、`contact_reveal`、`report`、`city`、`user`、`role`、`system_setting`、`audit_log`。
- 权限动作（`PermissionAction`）：`view`、`view_own`、`create`、`update_own`、`delete_own`、`moderate`、`manage`。
- `ROLE_PERMISSIONS`（`src/lib/permissions/matrix.ts`）：四个角色权限逐级累加（`guest` ⊂ `user` ⊂ `content_reviewer` ⊂ `admin`），`admin` 直接拥有全部权限，**不使用**「意购」项目中 `super_admin` 那种特殊绕过逻辑，因为本项目角色体系更简单，无需区分「管理员」与「超级管理员」两级。
- 守卫函数（`src/lib/permissions/guards.ts`）：`can()`、`assertPermission()`、`assertAuthenticated()`、`assertOwnsResource()`，与「意购」项目的设计原则一致——权限判断不能只在前端隐藏按钮，`src/lib/repositories/` 与 `src/lib/services/` 数据访问层必须同时校验归属与权限。

## 与「意购」项目的差异

- 无商家/商品审核相关角色与权限（本项目无商家体系）。
- 无支付/订单相关权限资源。
- `admin` 角色不做「管理员 / 超级管理员」二级拆分。

## 待补充

- 后台导航按权限动态过滤规则：Stage 08（平台管理后台阶段）
