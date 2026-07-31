import type { BaseEntity, ID, LocalizedText } from "./common";

/** 对应数据库实体 cities：第一期复用「意购」项目已建立的意大利城市数据集（独立维护，不做跨项目 import） */
export interface City extends BaseEntity {
  slug: string;
  name: LocalizedText;
  country: string;
  heroImageUrl: string | null;
  introduction: LocalizedText | null;
  sortOrder: number;
  isVisible: boolean;
}

/** 城市引用（房源等实体只存 cityId，展示时联查） */
export type CityRef = ID;
