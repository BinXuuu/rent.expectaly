import type { ID, ISODateString } from "./common";

/** 对应数据库实体 favorites：用户收藏房源，需登录 */
export interface Favorite {
  id: ID;
  userId: ID;
  listingId: ID;
  createdAt: ISODateString;
}
