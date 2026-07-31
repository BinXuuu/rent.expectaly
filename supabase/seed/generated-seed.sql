-- 自动生成，请勿手动编辑。运行 `npm run db:seed:sql` 重新生成。
-- 仅用于测试/演示环境，导入前请阅读 docs/SEED_DATA_IMPORT.md。
-- 业务表位于 rent schema 下（与「意购」「主站」共用同一个 Supabase 项目时避免表名冲突）。
set search_path = rent;

-- profiles
insert into profiles (id, auth_user_id, display_name, avatar_url, email, phone, primary_provider, main_site_user_id, locale, status, last_login_at, created_at, updated_at) values
  ('48934d37-8ece-591c-822c-1fb6e526adf4', 'auth-user-linfei', '林飞', NULL, 'linfei.demo@example.com', '+39 340 555 1001', 'email', NULL, 'zh-CN', 'active', '2026-07-22T20:00:00+02:00', '2026-04-01T09:00:00+02:00', '2026-07-22T20:00:00+02:00'),
  ('d420be07-d092-5f1c-9911-8d564327abba', 'auth-user-wangqiang', '王强', NULL, 'wangqiang.demo@example.com', '+39 340 555 1002', 'email', NULL, 'zh-CN', 'active', '2026-07-21T18:30:00+02:00', '2026-05-10T09:00:00+02:00', '2026-07-21T18:30:00+02:00'),
  ('c8e1c39f-6bdf-59ef-a05d-8f29f341faaa', 'auth-user-giulia', 'Giulia Bianchi', NULL, 'giulia.bianchi.demo@example.com', '+39 340 555 1003', 'email', NULL, 'zh-CN', 'active', '2026-07-20T11:00:00+02:00', '2026-05-15T09:00:00+02:00', '2026-07-20T11:00:00+02:00'),
  ('fac22214-cca1-5d35-8b0e-137c42d5329f', 'auth-content-reviewer', '内容审核员 · 若曦', NULL, 'reviewer.demo@example.com', NULL, 'email', NULL, 'zh-CN', 'active', '2026-07-23T09:00:00+02:00', '2026-03-01T09:00:00+02:00', '2026-07-23T09:00:00+02:00'),
  ('ab7b2626-5d0b-5c43-827e-04427ba3b7bb', 'auth-admin', '管理员 · 志远', NULL, 'admin.demo@example.com', NULL, 'email', NULL, 'zh-CN', 'active', '2026-07-23T09:30:00+02:00', '2026-03-01T09:00:00+02:00', '2026-07-23T09:30:00+02:00')
on conflict (id) do nothing;

-- user_roles
insert into user_roles (id, user_id, role, granted_at, granted_by, created_at, updated_at) values
  ('f7e902f6-a8be-5c87-931b-7fdd5ef17a21', '48934d37-8ece-591c-822c-1fb6e526adf4', 'user', '2026-04-01T09:00:00+02:00', NULL, '2026-04-01T09:00:00+02:00', '2026-04-01T09:00:00+02:00'),
  ('8ad71901-fd2f-52c4-8203-57d7ade13a56', 'd420be07-d092-5f1c-9911-8d564327abba', 'user', '2026-05-10T09:00:00+02:00', NULL, '2026-05-10T09:00:00+02:00', '2026-05-10T09:00:00+02:00'),
  ('96f1c103-4c7b-56b7-9708-6180e6f82722', 'c8e1c39f-6bdf-59ef-a05d-8f29f341faaa', 'user', '2026-05-15T09:00:00+02:00', NULL, '2026-05-15T09:00:00+02:00', '2026-05-15T09:00:00+02:00'),
  ('fe75da11-97a2-5331-881c-193e746a0d5b', 'fac22214-cca1-5d35-8b0e-137c42d5329f', 'content_reviewer', '2026-03-01T09:00:00+02:00', 'ab7b2626-5d0b-5c43-827e-04427ba3b7bb', '2026-03-01T09:00:00+02:00', '2026-03-01T09:00:00+02:00'),
  ('b149d7de-2dc9-56b5-8cb7-5ce1589732fa', 'ab7b2626-5d0b-5c43-827e-04427ba3b7bb', 'admin', '2026-03-01T09:00:00+02:00', NULL, '2026-03-01T09:00:00+02:00', '2026-03-01T09:00:00+02:00')
on conflict (id) do nothing;

-- cities
insert into cities (id, slug, name, country, hero_image_url, introduction, sort_order, is_visible, created_at, updated_at) values
  ('ae1a30ed-bcf1-501f-88eb-9400efe3cdf1', 'milano', '{"zh-CN":"米兰","en-US":"Milano"}'::jsonb, 'Italia', '/images/placeholder/cities/milano-hero.svg', '{"zh-CN":"时尚与设计之都，租赁需求旺盛，房源以精装公寓为主。"}'::jsonb, 1, true, '2026-07-01T09:00:00+02:00', '2026-07-01T09:00:00+02:00'),
  ('e38d42dc-4848-52ae-97a3-b27b7a8bd0d0', 'firenze', '{"zh-CN":"佛罗伦萨","en-US":"Firenze"}'::jsonb, 'Italia', '/images/placeholder/cities/firenze-hero.svg', '{"zh-CN":"留学生与游学人群集中，合租房源较多。"}'::jsonb, 2, true, '2026-07-01T09:00:00+02:00', '2026-07-01T09:00:00+02:00'),
  ('e27897aa-9f3e-5e50-a535-893a5c667a3a', 'roma', '{"zh-CN":"罗马","en-US":"Roma"}'::jsonb, 'Italia', '/images/placeholder/cities/roma-hero.svg', '{"zh-CN":"首都城市，房源类型多样，交通便利性差异较大。"}'::jsonb, 3, true, '2026-07-01T09:00:00+02:00', '2026-07-01T09:00:00+02:00'),
  ('f72bd6b8-e90c-59a8-9bae-4cbef40a7055', 'torino', '{"zh-CN":"都灵","en-US":"Torino"}'::jsonb, 'Italia', '/images/placeholder/cities/torino-hero.svg', '{"zh-CN":"相对性价比较高的城市，长租房源较常见。"}'::jsonb, 4, true, '2026-07-01T09:00:00+02:00', '2026-07-01T09:00:00+02:00'),
  ('00d44ad9-0d78-594e-830c-57ec3076ae48', 'bologna', '{"zh-CN":"博洛尼亚","en-US":"Bologna"}'::jsonb, 'Italia', '/images/placeholder/cities/bologna-hero.svg', '{"zh-CN":"大学城，学生床位与单间房源需求集中。"}'::jsonb, 5, true, '2026-07-01T09:00:00+02:00', '2026-07-01T09:00:00+02:00'),
  ('ff7155b3-33eb-52ee-befd-d6e94a286692', 'venezia', '{"zh-CN":"威尼斯","en-US":"Venezia"}'::jsonb, 'Italia', '/images/placeholder/cities/venezia-hero.svg', '{"zh-CN":"旅游城市，租赁市场受季节性影响明显。"}'::jsonb, 6, true, '2026-07-01T09:00:00+02:00', '2026-07-01T09:00:00+02:00'),
  ('a1affe94-e148-5e32-9fb3-27f3c0149a78', 'napoli', '{"zh-CN":"那不勒斯","en-US":"Napoli"}'::jsonb, 'Italia', '/images/placeholder/cities/napoli-hero.svg', '{"zh-CN":"南意城市，租金相对较低。"}'::jsonb, 7, true, '2026-07-01T09:00:00+02:00', '2026-07-01T09:00:00+02:00'),
  ('0ddb7816-c795-55ee-97d0-41116525f552', 'modena', '{"zh-CN":"摩德纳","en-US":"Modena"}'::jsonb, 'Italia', '/images/placeholder/cities/modena-hero.svg', '{"zh-CN":"中小型城市，独立单间较多。"}'::jsonb, 8, true, '2026-07-01T09:00:00+02:00', '2026-07-01T09:00:00+02:00'),
  ('1672c0ca-4e68-5ec1-9d87-b3cec9a7e8f5', 'parma', '{"zh-CN":"帕尔马","en-US":"Parma"}'::jsonb, 'Italia', '/images/placeholder/cities/parma-hero.svg', '{"zh-CN":"生活节奏较慢的城市，合租房源性价比较高。"}'::jsonb, 9, true, '2026-07-01T09:00:00+02:00', '2026-07-01T09:00:00+02:00'),
  ('f593b2a1-05df-5a29-a2d4-4c294079467c', 'other', '{"zh-CN":"其他城市","en-US":"Other Cities"}'::jsonb, 'Italia', '/images/placeholder/cities/other-hero.svg', '{"zh-CN":"尚未单独开设城市页的意大利地区房源。"}'::jsonb, 10, true, '2026-07-01T09:00:00+02:00', '2026-07-01T09:00:00+02:00')
on conflict (id) do nothing;

-- listings
insert into listings (id, publisher_id, purpose, title, description, city_id, address, room_type, area_sqm, floor, orientation, renovation_condition, price_amount, price_currency, cny_reference_price, deposit_terms, requires_agency_fee, agency_fee_note, has_contract, contract_note, min_lease_term_months, available_from, pets_allowed, furnished, move_in_ready, transit_note, validity_days, published_at, expires_at, status, requires_manual_review, created_at, updated_at) values
  ('993d7118-4a84-5576-bbc7-69d25bc4e0d1', '48934d37-8ece-591c-822c-1fb6e526adf4', 'rent', '米兰纳维利运河区精装一室公寓', '位于纳维利运河区，步行 5 分钟至地铁站，精装修，家电齐全，适合单人或情侣居住。', 'ae1a30ed-bcf1-501f-88eb-9400efe3cdf1', 'Via Navigli 12, Milano', 'entire_place', 45, '3', 'south', 'luxury', 1200, 'EUR', 9420, '押二付一', true, '中介费为一个月租金，签约时一次性支付。', true, '提供正式登记合同（contratto registrato），可用于居留许可续签材料。', 12, '2026-08-01', false, true, true, '距 Porta Genova 地铁站步行约 5 分钟。', 30, '2026-07-15T10:00:00+02:00', '2026-08-14T10:00:00+02:00', 'published', false, '2026-07-15T09:30:00+02:00', '2026-07-15T10:00:00+02:00'),
  ('afb81c3b-2cd8-50e8-a9c1-73a447ecce85', 'c8e1c39f-6bdf-59ef-a05d-8f29f341faaa', 'rent', '都灵市中心单间出租', '都灵市中心公寓内的一个单间，与房东共用厨房和卫生间，安静适合工作。', 'f72bd6b8-e90c-59a8-9bae-4cbef40a7055', 'Via Roma 45, Torino', 'private_room', 16, '2', 'east', 'standard', 450, 'EUR', 3532.5, '押一付一', false, NULL, true, '提供正式登记合同。', 6, '2026-08-10', false, true, true, '距市中心公交枢纽步行约 8 分钟。', 15, '2026-07-18T09:00:00+02:00', '2026-08-02T09:00:00+02:00', 'published', false, '2026-07-18T08:30:00+02:00', '2026-07-18T09:00:00+02:00'),
  ('a970391a-20c5-508e-9956-26899cfe88bf', 'd420be07-d092-5f1c-9911-8d564327abba', 'rent', '佛罗伦萨大学城合租床位', '留学生合租公寓，提供床位，适合短期游学或语言课程学生，接受宠物。', 'e38d42dc-4848-52ae-97a3-b27b7a8bd0d0', 'Via San Gallo 30, Firenze', 'shared_room', 12, '1', 'north', 'basic', 380, 'EUR', 2983, '押一付一', true, '中介费半个月租金。', false, '房东暂不提供正式登记合同，仅口头约定，请租客自行评估居留许可相关风险。', 3, '2026-08-05', true, true, true, '距火车站步行约 15 分钟，附近有公交站。', 7, '2026-07-20T14:00:00+02:00', '2026-07-27T14:00:00+02:00', 'published', false, '2026-07-20T13:30:00+02:00', '2026-07-20T14:00:00+02:00'),
  ('54a3e597-40a8-5a79-b8e1-2922011bb1ac', '48934d37-8ece-591c-822c-1fb6e526adf4', 'rent', '博洛尼亚免中介内部渠道急租一室', '内部渠道免中介费急租，价格低于市场，先到先得。', '00d44ad9-0d78-594e-830c-57ec3076ae48', 'Via Zamboni 10, Bologna', 'entire_place', 38, '4', 'west', 'standard', 900, 'EUR', 7065, '押一付三', false, NULL, true, '声称提供合同，待审核核实。', 6, '2026-08-01', false, true, true, '距大学区步行约 10 分钟。', 15, NULL, NULL, 'pending_review', true, '2026-07-22T16:00:00+02:00', '2026-07-22T16:00:00+02:00'),
  ('23a178aa-e319-5ef7-87ea-f426abae57ab', 'c8e1c39f-6bdf-59ef-a05d-8f29f341faaa', 'rent', '摩德纳独立单间（草稿，尚未发布）', '摩德纳市郊独立单间，草稿状态，发帖人尚未完善图片与联系方式后提交。', '0ddb7816-c795-55ee-97d0-41116525f552', 'Via Emilia 88, Modena', 'private_room', 20, '1', NULL, 'standard', 420, 'EUR', 3297, NULL, false, NULL, true, NULL, 6, '2026-09-01', false, false, false, NULL, 30, NULL, NULL, 'draft', false, '2026-07-21T11:00:00+02:00', '2026-07-21T11:00:00+02:00'),
  ('6b71ba9c-565a-5208-ac9b-ac6bdc040c47', 'd420be07-d092-5f1c-9911-8d564327abba', 'rent', '罗马市中心床位出租', '多人间床位，短期灵活，适合刚到罗马过渡的租客。', 'e27897aa-9f3e-5e50-a535-893a5c667a3a', 'Via Nazionale 5, Roma', 'bed_space', 8, '2', 'south', 'basic', 280, 'EUR', 2198, '押一付一', false, NULL, false, '短期床位不提供正式登记合同。', 1, '2026-07-25', false, true, true, '步行可达特米尼火车站。', 7, '2026-07-19T08:00:00+02:00', '2026-07-26T08:00:00+02:00', 'published', false, '2026-07-19T07:30:00+02:00', '2026-07-19T08:00:00+02:00'),
  ('89c3228f-3b81-5058-80ed-213d656efd76', '48934d37-8ece-591c-822c-1fb6e526adf4', 'rent', '威尼斯本岛公寓（已过期示例）', '威尼斯本岛整租公寓，用于演示有效期到期自动下架的生命周期。', 'ff7155b3-33eb-52ee-befd-d6e94a286692', 'Calle Larga 22, Venezia', 'entire_place', 55, '2', 'east', 'luxury', 1500, 'EUR', 11775, '押二付一', true, '中介费一个月租金。', true, '提供正式登记合同。', 12, '2026-06-15', false, true, true, '步行至圣马可广场约 10 分钟（无地铁，以步行/水上巴士为主）。', 30, '2026-06-01T10:00:00+02:00', '2026-07-01T10:00:00+02:00', 'expired', false, '2026-06-01T09:30:00+02:00', '2026-07-01T10:00:01+02:00'),
  ('055b088b-b97b-56d1-ae41-13aa56b3e128', 'c8e1c39f-6bdf-59ef-a05d-8f29f341faaa', 'rent', '那不勒斯单间（已下架，虚假信息示例）', '此房源经举报核实为虚假信息（房源已出租但未下架），已被内容审核员下架。', 'a1affe94-e148-5e32-9fb3-27f3c0149a78', 'Via Toledo 100, Napoli', 'private_room', 18, '1', 'north', 'standard', 350, 'EUR', 2747.5, '押一付一', false, NULL, false, NULL, 3, '2026-07-01', false, true, false, NULL, 15, '2026-06-15T10:00:00+02:00', '2026-06-30T10:00:00+02:00', 'removed', false, '2026-06-15T09:30:00+02:00', '2026-06-20T15:00:00+02:00'),
  ('a71d7e02-fcce-51f4-b4a8-c3fd8357d8aa', 'd420be07-d092-5f1c-9911-8d564327abba', 'rent', '帕尔马合租房间（可养宠物）', '生活节奏较慢的帕尔马合租房间，允许养宠物，拎包入住。', '1672c0ca-4e68-5ec1-9d87-b3cec9a7e8f5', 'Strada della Repubblica 20, Parma', 'shared_room', 14, '1', 'southeast', 'standard', 330, 'EUR', 2590.5, '押一付一', false, NULL, true, '提供正式登记合同。', 6, '2026-08-01', true, true, true, '距市中心步行约 12 分钟。', 30, '2026-07-22T10:00:00+02:00', '2026-08-21T10:00:00+02:00', 'published', false, '2026-07-22T09:30:00+02:00', '2026-07-22T10:00:00+02:00'),
  ('db7b65a6-2833-5750-ae92-9a22df3f6589', 'c8e1c39f-6bdf-59ef-a05d-8f29f341faaa', 'sale', '米兰中央车站附近精装两室公寓（出售）', '米兰中央车站步行可达，精装修，产权清晰，适合自住或长期出租投资。', 'ae1a30ed-bcf1-501f-88eb-9400efe3cdf1', 'Via Napo Torriani 8, Milano', 'entire_place', 68, '5', 'south', 'luxury', 285000, 'EUR', 2237250, NULL, true, '中介费为成交价的 3%，买卖双方各自承担。', true, '提供正式购房预约合同（compromesso），过户手续需公证处协助完成。', NULL, '2026-09-15', false, false, false, '距米兰中央车站步行约 6 分钟，地铁 2/3 号线可达。', 30, '2026-07-21T11:00:00+02:00', '2026-08-20T11:00:00+02:00', 'published', false, '2026-07-21T10:30:00+02:00', '2026-07-21T11:00:00+02:00'),
  ('2eb8e0ce-77e0-5951-a22a-efb63ba00f52', 'd420be07-d092-5f1c-9911-8d564327abba', 'sale', '佛罗伦萨郊区独栋别墅（出售，带花园）', '佛罗伦萨近郊独栋别墅，带私人花园与车库，安静的居民区，适合家庭长期居住。', 'e38d42dc-4848-52ae-97a3-b27b7a8bd0d0', 'Via delle Colline 21, Firenze', 'entire_place', 145, '地面层+1', 'southwest', 'standard', 620000, 'EUR', 4867000, NULL, false, NULL, true, '业主直售，提供正式购房预约合同，过户手续需公证处协助完成。', NULL, '2026-10-01', false, false, false, '距市中心自驾约 20 分钟，附近有公交站。', 30, '2026-07-19T09:00:00+02:00', '2026-08-18T09:00:00+02:00', 'published', false, '2026-07-19T08:30:00+02:00', '2026-07-19T09:00:00+02:00'),
  ('dd41eb61-4e41-5c62-be2e-8fbc90dde42e', 'c8e1c39f-6bdf-59ef-a05d-8f29f341faaa', 'sale', '博洛尼亚内部渠道低价急售一室公寓', '内部渠道低于市场价急售，价格可议，先到先得。', '00d44ad9-0d78-594e-830c-57ec3076ae48', 'Via Irnerio 5, Bologna', 'entire_place', 42, '3', 'east', 'basic', 118000, 'EUR', 926300, NULL, false, NULL, true, '声称提供正式购房合同，待审核核实。', NULL, '2026-09-01', false, false, false, '距大学区步行约 8 分钟。', 15, NULL, NULL, 'pending_review', true, '2026-07-22T17:00:00+02:00', '2026-07-22T17:00:00+02:00')
on conflict (id) do nothing;

-- listing_images
insert into listing_images (id, listing_id, url, sort_order, alt_text, created_at, updated_at) values
  ('8ff0c3d1-988f-5fd9-92fc-47f389429dc6', '993d7118-4a84-5576-bbc7-69d25bc4e0d1', '/images/placeholder/listings/milano-1.svg', 1, NULL, '2026-07-15T09:30:00+02:00', '2026-07-15T10:00:00+02:00'),
  ('1610f8d5-23c5-5adc-a1cf-7ae2e75063cd', 'afb81c3b-2cd8-50e8-a9c1-73a447ecce85', '/images/placeholder/listings/torino-2.svg', 1, NULL, '2026-07-18T08:30:00+02:00', '2026-07-18T09:00:00+02:00'),
  ('ba6cf3f7-21c5-5f2e-ba67-11f3e9ca1ebf', 'a970391a-20c5-508e-9956-26899cfe88bf', '/images/placeholder/listings/firenze-3.svg', 1, NULL, '2026-07-20T13:30:00+02:00', '2026-07-20T14:00:00+02:00'),
  ('6a259003-62d4-5f6b-a75a-ebb45834f10a', '54a3e597-40a8-5a79-b8e1-2922011bb1ac', '/images/placeholder/listings/bologna-4.svg', 1, NULL, '2026-07-22T16:00:00+02:00', '2026-07-22T16:00:00+02:00'),
  ('6a710114-2a8b-5d79-9c13-cf3626b493a9', '23a178aa-e319-5ef7-87ea-f426abae57ab', '/images/placeholder/listings/modena-5.svg', 1, NULL, '2026-07-21T11:00:00+02:00', '2026-07-21T11:00:00+02:00'),
  ('f3797573-04fd-5ea3-8863-8b087da88719', '6b71ba9c-565a-5208-ac9b-ac6bdc040c47', '/images/placeholder/listings/roma-6.svg', 1, NULL, '2026-07-19T07:30:00+02:00', '2026-07-19T08:00:00+02:00'),
  ('7fdc6ee0-86e8-5201-8f2e-d9a3c3a9824a', '89c3228f-3b81-5058-80ed-213d656efd76', '/images/placeholder/listings/venezia-7.svg', 1, NULL, '2026-06-01T09:30:00+02:00', '2026-07-01T10:00:01+02:00'),
  ('1faf7f83-1314-5b5b-9cf3-544e0112a965', '055b088b-b97b-56d1-ae41-13aa56b3e128', '/images/placeholder/listings/napoli-8.svg', 1, NULL, '2026-06-15T09:30:00+02:00', '2026-06-20T15:00:00+02:00'),
  ('52d3d634-f5f6-5d09-9334-ca5e594cdb0b', 'a71d7e02-fcce-51f4-b4a8-c3fd8357d8aa', '/images/placeholder/listings/parma-9.svg', 1, NULL, '2026-07-22T09:30:00+02:00', '2026-07-22T10:00:00+02:00'),
  ('89d534aa-732b-57f1-97a3-856b25e3fef6', 'db7b65a6-2833-5750-ae92-9a22df3f6589', '/images/placeholder/listings/milano-10.svg', 1, NULL, '2026-07-21T10:30:00+02:00', '2026-07-21T11:00:00+02:00'),
  ('3e7f7c14-db75-5605-8241-bafa753a4106', '2eb8e0ce-77e0-5951-a22a-efb63ba00f52', '/images/placeholder/listings/firenze-11.svg', 1, NULL, '2026-07-19T08:30:00+02:00', '2026-07-19T09:00:00+02:00'),
  ('dc52ef98-8d73-556c-9ffc-3de01885f778', 'dd41eb61-4e41-5c62-be2e-8fbc90dde42e', '/images/placeholder/listings/bologna-12.svg', 1, NULL, '2026-07-22T17:00:00+02:00', '2026-07-22T17:00:00+02:00')
on conflict (id) do nothing;

-- comments
insert into comments (id, listing_id, author_id, body, status, hidden_by, hidden_reason, created_at, updated_at) values
  ('b82851eb-580b-51f4-b166-302febfe468e', '993d7118-4a84-5576-bbc7-69d25bc4e0d1', 'd420be07-d092-5f1c-9911-8d564327abba', '请问这个房源现在还有吗？方便告知具体入住时间吗？', 'visible', NULL, NULL, '2026-07-16T10:00:00+02:00', '2026-07-16T10:00:00+02:00'),
  ('6746b57f-7eba-55f8-9658-c4d7fc2b7809', 'afb81c3b-2cd8-50e8-a9c1-73a447ecce85', '48934d37-8ece-591c-822c-1fb6e526adf4', '地理位置很好，请问可以短租看看情况吗？', 'visible', NULL, NULL, '2026-07-19T09:00:00+02:00', '2026-07-19T09:00:00+02:00'),
  ('1f1f4cf0-b202-5a8c-bd9f-4c569de44275', '055b088b-b97b-56d1-ae41-13aa56b3e128', '48934d37-8ece-591c-822c-1fb6e526adf4', '（已隐藏的违规评论示例，原内容含辱骂性语言）', 'hidden', 'fac22214-cca1-5d35-8b0e-137c42d5329f', '违反内容发布规范：辱骂性语言。', '2026-06-16T12:00:00+02:00', '2026-06-20T15:05:00+02:00')
on conflict (id) do nothing;

-- favorites
insert into favorites (id, user_id, listing_id, created_at) values
  ('7b8cd9b5-e6a6-543e-a9d6-50e7ca13cbe3', 'd420be07-d092-5f1c-9911-8d564327abba', '993d7118-4a84-5576-bbc7-69d25bc4e0d1', '2026-07-16T10:05:00+02:00'),
  ('f41719e8-7180-55c0-a548-fea339c090b4', 'd420be07-d092-5f1c-9911-8d564327abba', 'afb81c3b-2cd8-50e8-a9c1-73a447ecce85', '2026-07-19T09:10:00+02:00'),
  ('99e03dea-44f3-5987-9b38-bb2d28c16686', 'c8e1c39f-6bdf-59ef-a05d-8f29f341faaa', 'a71d7e02-fcce-51f4-b4a8-c3fd8357d8aa', '2026-07-22T12:00:00+02:00')
on conflict (id) do nothing;

-- contact_reveal_events
insert into contact_reveal_events (id, user_id, listing_id, occurred_at) values
  ('6b505d6e-456d-5997-a373-4dbf6f47e15b', 'd420be07-d092-5f1c-9911-8d564327abba', '993d7118-4a84-5576-bbc7-69d25bc4e0d1', '2026-07-16T10:06:00+02:00'),
  ('d5a09df6-b079-5565-b7cf-c38e4c14d9c6', '48934d37-8ece-591c-822c-1fb6e526adf4', 'afb81c3b-2cd8-50e8-a9c1-73a447ecce85', '2026-07-19T09:12:00+02:00')
on conflict (id) do nothing;

-- reports
insert into reports (id, reported_type, reported_id, reporter_id, category, description, status, handled_by, handled_at, resolution_note, created_at, updated_at) values
  ('716428d9-2225-5029-8d20-2a469fab1df5', 'listing', '055b088b-b97b-56d1-ae41-13aa56b3e128', 'd420be07-d092-5f1c-9911-8d564327abba', 'already_rented', '联系房东后被告知房子上周已经出租，但信息一直没有下架。', 'removed', 'fac22214-cca1-5d35-8b0e-137c42d5329f', '2026-06-20T15:00:00+02:00', '核实举报属实，已下架该房源并通知发帖人。', '2026-06-18T20:00:00+02:00', '2026-06-20T15:00:00+02:00'),
  ('17f8bc90-ab0f-5196-abcf-84f67957be19', 'comment', '1f1f4cf0-b202-5a8c-bd9f-4c569de44275', 'c8e1c39f-6bdf-59ef-a05d-8f29f341faaa', 'abusive_content', '该评论包含辱骂性语言。', 'resolved', 'fac22214-cca1-5d35-8b0e-137c42d5329f', '2026-06-20T15:05:00+02:00', '已隐藏该评论。', '2026-06-19T08:00:00+02:00', '2026-06-20T15:05:00+02:00'),
  ('bb898028-ace2-5119-b4a2-e878641eb03f', 'listing', '54a3e597-40a8-5a79-b8e1-2922011bb1ac', 'c8e1c39f-6bdf-59ef-a05d-8f29f341faaa', 'fraud_suspicion', '价格明显低于市场行情，且强调「内部渠道」，怀疑是诈骗信息。', 'pending', NULL, NULL, NULL, '2026-07-22T17:00:00+02:00', '2026-07-22T17:00:00+02:00')
on conflict (id) do nothing;

-- audit_logs
insert into audit_logs (id, actor_id, actor_role, action, target_type, target_id, metadata, occurred_at, created_at, updated_at) values
  ('81fb614e-97b7-5009-895f-5cb9cb5c1969', 'fac22214-cca1-5d35-8b0e-137c42d5329f', 'content_reviewer', 'listing.moderate', 'listing', '055b088b-b97b-56d1-ae41-13aa56b3e128', '{"reason":"already_rented","reportId":"report-napoli-false-info"}'::jsonb, '2026-06-20T15:00:00+02:00', '2026-06-20T15:00:00+02:00', '2026-06-20T15:00:00+02:00'),
  ('a9d76a1b-4aff-5870-af57-a76d5f4d64d0', 'fac22214-cca1-5d35-8b0e-137c42d5329f', 'content_reviewer', 'comment.moderate', 'comment', '1f1f4cf0-b202-5a8c-bd9f-4c569de44275', '{"reason":"abusive_content","reportId":"report-napoli-comment-abusive"}'::jsonb, '2026-06-20T15:05:00+02:00', '2026-06-20T15:05:00+02:00', '2026-06-20T15:05:00+02:00'),
  ('34e8229f-923c-5494-92ac-2da739163ef4', 'ab7b2626-5d0b-5c43-827e-04427ba3b7bb', 'admin', 'role.grant', 'user', 'fac22214-cca1-5d35-8b0e-137c42d5329f', '{"role":"content_reviewer"}'::jsonb, '2026-03-01T09:00:00+02:00', '2026-03-01T09:00:00+02:00', '2026-03-01T09:00:00+02:00')
on conflict (id) do nothing;

-- system_settings
insert into system_settings (id, key, value, value_type, description, updated_by, created_at, updated_at) values
  ('df59b7db-925d-5190-8b6d-d2e547f4c470', 'listing_validity_options_days', '[7,15,30]', 'json', '发帖时可选的有效期时长（天）', 'ab7b2626-5d0b-5c43-827e-04427ba3b7bb', '2026-07-01T09:00:00+02:00', '2026-07-01T09:00:00+02:00'),
  ('80697e90-c89b-5ed7-a178-db2a5289dffb', 'contact_reveal_rate_limit_window_seconds', '3600', 'number', '「获取联系方式」限流窗口（秒）', 'ab7b2626-5d0b-5c43-827e-04427ba3b7bb', '2026-07-01T09:00:00+02:00', '2026-07-01T09:00:00+02:00'),
  ('d6dbb47c-a858-5b47-98d4-6feae528cc1d', 'contact_reveal_rate_limit_max_requests', '20', 'number', '限流窗口内允许的最大「获取联系方式」次数', 'ab7b2626-5d0b-5c43-827e-04427ba3b7bb', '2026-07-01T09:00:00+02:00', '2026-07-01T09:00:00+02:00'),
  ('0292a8aa-8186-5e86-9130-6036bb3e075a', 'risk_keywords', '["内部渠道","免中介急租","低价急租","无需看房"]', 'json', '房源/评论风险关键词自动预警词库', 'ab7b2626-5d0b-5c43-827e-04427ba3b7bb', '2026-07-01T09:00:00+02:00', '2026-07-01T09:00:00+02:00')
on conflict (id) do nothing;

-- exchange_rates
insert into exchange_rates (id, base_currency, quote_currency, rate, source, effective_at, is_active, created_at, updated_at) values
  ('7a43b11f-90ca-5d77-921c-13eefa39fc07', 'EUR', 'CNY', 7.85, 'manual', '2026-07-20T00:00:00+02:00', true, '2026-07-20T08:00:00+02:00', '2026-07-20T08:00:00+02:00')
on conflict (id) do nothing;
