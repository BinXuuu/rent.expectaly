/**
 * 演示数据：举报。覆盖房源举报（已处理下架）与评论举报（已隐藏）两种闭环。
 */
import type { Report } from "@/types";

const base = {
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
};

export const mockReports: Report[] = [
  {
    id: "report-napoli-false-info",
    reportedType: "listing",
    reportedId: "listing-napoli-removed",
    reporterId: "profile-user-wangqiang",
    category: "already_rented",
    description: "联系房东后被告知房子上周已经出租，但信息一直没有下架。",
    status: "removed",
    handledBy: "profile-content-reviewer",
    handledAt: "2026-06-20T15:00:00+02:00",
    resolutionNote: "核实举报属实，已下架该房源并通知发帖人。",
    createdAt: "2026-06-18T20:00:00+02:00",
    updatedAt: "2026-06-20T15:00:00+02:00",
    ...base,
  },
  {
    id: "report-napoli-comment-abusive",
    reportedType: "comment",
    reportedId: "comment-napoli-abusive",
    reporterId: "profile-user-giulia",
    category: "abusive_content",
    description: "该评论包含辱骂性语言。",
    status: "resolved",
    handledBy: "profile-content-reviewer",
    handledAt: "2026-06-20T15:05:00+02:00",
    resolutionNote: "已隐藏该评论。",
    createdAt: "2026-06-19T08:00:00+02:00",
    updatedAt: "2026-06-20T15:05:00+02:00",
    ...base,
  },
  {
    id: "report-bologna-pending",
    reportedType: "listing",
    reportedId: "listing-bologna-pending-review",
    reporterId: "profile-user-giulia",
    category: "fraud_suspicion",
    description: "价格明显低于市场行情，且强调「内部渠道」，怀疑是诈骗信息。",
    status: "pending",
    handledBy: null,
    handledAt: null,
    resolutionNote: null,
    createdAt: "2026-07-22T17:00:00+02:00",
    updatedAt: "2026-07-22T17:00:00+02:00",
    ...base,
  },
];
