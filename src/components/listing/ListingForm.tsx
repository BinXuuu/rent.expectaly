"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
  LISTING_PURPOSE_LABELS,
  LISTING_VALIDITY_OPTIONS_DAYS,
  RENOVATION_CONDITION_LABELS,
  ROOM_TYPE_LABELS,
  type ListingPurpose,
  type RenovationCondition,
  type RoomType,
} from "@/types";

const PURPOSE_OPTIONS = (Object.entries(LISTING_PURPOSE_LABELS) as [ListingPurpose, string][]).map(
  ([value, label]) => ({ value, label }),
);

const ROOM_TYPE_OPTIONS = (Object.entries(ROOM_TYPE_LABELS) as [RoomType, string][]).map(
  ([value, label]) => ({ value, label }),
);

// 出售房源不存在"合租/单间/床位"概念，房型固定为整套单元
const SALE_ROOM_TYPE_OPTIONS = ROOM_TYPE_OPTIONS.filter((o) => o.value === "entire_place");

const RENOVATION_OPTIONS = (
  Object.entries(RENOVATION_CONDITION_LABELS) as [RenovationCondition, string][]
).map(([value, label]) => ({ value, label }));

const ORIENTATION_OPTIONS = [
  { value: "north", label: "朝北" },
  { value: "south", label: "朝南" },
  { value: "east", label: "朝东" },
  { value: "west", label: "朝西" },
  { value: "southeast", label: "东南" },
  { value: "southwest", label: "西南" },
];

const VALIDITY_OPTIONS = LISTING_VALIDITY_OPTIONS_DAYS.map((days) => ({
  value: String(days),
  label: `${days} 天`,
}));

export interface ListingFormDefaults {
  purpose?: ListingPurpose;
  title?: string;
  description?: string;
  cityId?: string;
  address?: string;
  roomType?: RoomType;
  areaSqm?: number;
  floor?: string;
  renovationCondition?: RenovationCondition;
  priceAmount?: number;
  depositTerms?: string;
  requiresAgencyFee?: boolean;
  hasContract?: boolean;
  minLeaseTermMonths?: number | null;
  availableFrom?: string;
  petsAllowed?: boolean;
  furnished?: boolean;
  moveInReady?: boolean;
  transitNote?: string;
  validityDays?: number;
}

export interface ListingFormProps {
  mode: "create" | "edit";
  cityOptions: { value: string; label: string }[];
  defaultValues?: ListingFormDefaults;
}

/**
 * 房源发布/编辑表单。第一期为界面交互演示：提交后展示确认提示，
 * 尚未接入 listings 表的真实写入（留待真实 Supabase 项目接入后补充）。
 * 明确不包含任何交易/支付字段，详见 docs/NO_TRANSACTION_POLICY.md。
 */
export function ListingForm({ mode, cityOptions, defaultValues }: ListingFormProps) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [purpose, setPurpose] = useState<ListingPurpose>(defaultValues?.purpose ?? "rent");
  const [requiresAgencyFee, setRequiresAgencyFee] = useState(
    defaultValues?.requiresAgencyFee ?? false,
  );
  const [hasContract, setHasContract] = useState(defaultValues?.hasContract ?? true);
  const [petsAllowed, setPetsAllowed] = useState(defaultValues?.petsAllowed ?? false);
  const [furnished, setFurnished] = useState(defaultValues?.furnished ?? true);
  const [moveInReady, setMoveInReady] = useState(defaultValues?.moveInReady ?? true);

  if (submitted) {
    return (
      <div className="border-success-200 bg-success-50 flex flex-col gap-3 rounded-xs border p-6">
        <h2 className="text-ink text-sm font-semibold">
          {mode === "create" ? "房源已提交" : "修改已提交"}
        </h2>
        <p className="text-ink-muted text-sm">
          房源已进入待审核状态，若命中风险关键词自动预警将由内容审核员人工核实后发布；未命中的房源将直接发布，
          并按你选择的有效期时长自动计算到期时间。
        </p>
        <Button
          variant="secondary"
          className="w-fit"
          onClick={() => router.push("/account/listings")}
        >
          返回我的房源
        </Button>
      </div>
    );
  }

  return (
    <form
      className="grid gap-5 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <Select
        label="类别"
        name="purpose"
        required
        options={PURPOSE_OPTIONS}
        value={purpose}
        onChange={(event) => setPurpose(event.target.value as ListingPurpose)}
        className="sm:col-span-2"
      />
      <Input
        label="房源标题"
        name="title"
        required
        defaultValue={defaultValues?.title}
        className="sm:col-span-2"
      />
      <Textarea
        label="房源描述"
        name="description"
        required
        defaultValue={defaultValues?.description}
        className="sm:col-span-2"
      />
      <Select
        label="城市"
        name="cityId"
        required
        options={cityOptions}
        defaultValue={defaultValues?.cityId}
      />
      <Input label="详细地址" name="address" required defaultValue={defaultValues?.address} />
      <Select
        key={purpose}
        label="房型"
        name="roomType"
        required
        options={purpose === "sale" ? SALE_ROOM_TYPE_OPTIONS : ROOM_TYPE_OPTIONS}
        defaultValue={purpose === "sale" ? "entire_place" : defaultValues?.roomType}
      />
      <Input
        label="面积（㎡）"
        name="areaSqm"
        type="number"
        min={1}
        required
        defaultValue={defaultValues?.areaSqm}
      />
      <Input label="楼层（可选）" name="floor" defaultValue={defaultValues?.floor} />
      <Select
        label="朝向（可选）"
        name="orientation"
        options={ORIENTATION_OPTIONS}
        placeholder="请选择朝向"
      />
      <Select
        label="装修状况"
        name="renovationCondition"
        required
        options={RENOVATION_OPTIONS}
        defaultValue={defaultValues?.renovationCondition}
      />

      <div className="border-line rounded-xs border p-4 sm:col-span-2">
        <h2 className="text-ink text-sm font-semibold">
          {purpose === "sale" ? "价格与费用" : "租金与费用"}
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Input
            label={purpose === "sale" ? "总价（欧元）" : "月租（欧元）"}
            name="priceAmount"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={defaultValues?.priceAmount}
          />
          {purpose === "rent" && (
            <Input
              label="押金条款（可选）"
              name="depositTerms"
              placeholder="如：押一付三"
              defaultValue={defaultValues?.depositTerms}
            />
          )}
          <label className="text-ink flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={requiresAgencyFee}
              onChange={(event) => setRequiresAgencyFee(event.target.checked)}
              className="border-line-strong h-4 w-4 rounded-xs"
            />
            需要中介费
          </label>
          <label className="text-ink flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={hasContract}
              onChange={(event) => setHasContract(event.target.checked)}
              className="border-line-strong h-4 w-4 rounded-xs"
            />
            提供正式登记合同
          </label>
        </div>
      </div>

      {purpose === "rent" && (
        <Input
          label="最短租期（月）"
          name="minLeaseTermMonths"
          type="number"
          min={1}
          required
          defaultValue={defaultValues?.minLeaseTermMonths ?? 6}
        />
      )}
      <Input
        label={purpose === "sale" ? "可交房日期" : "可入住日期"}
        name="availableFrom"
        type="date"
        required
        defaultValue={defaultValues?.availableFrom}
      />
      <Input
        label="交通说明（可选）"
        name="transitNote"
        className="sm:col-span-2"
        defaultValue={defaultValues?.transitNote}
      />

      <div className="border-line rounded-xs border p-4 sm:col-span-2">
        <h2 className="text-ink text-sm font-semibold">其他标签</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {purpose === "rent" && (
            <label className="text-ink flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={petsAllowed}
                onChange={(event) => setPetsAllowed(event.target.checked)}
                className="border-line-strong h-4 w-4 rounded-xs"
              />
              可养宠物
            </label>
          )}
          <label className="text-ink flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={furnished}
              onChange={(event) => setFurnished(event.target.checked)}
              className="border-line-strong h-4 w-4 rounded-xs"
            />
            配备家具
          </label>
          <label className="text-ink flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={moveInReady}
              onChange={(event) => setMoveInReady(event.target.checked)}
              className="border-line-strong h-4 w-4 rounded-xs"
            />
            拎包入住
          </label>
        </div>
      </div>

      <Select
        label="有效期时长"
        name="validityDays"
        required
        options={VALIDITY_OPTIONS}
        defaultValue={String(defaultValues?.validityDays ?? 30)}
        description="到期后房源将自动从公开列表下架，可随时重新发布延长展示时间"
      />

      <div className="sm:col-span-2">
        <Button type="submit" variant="primary">
          {mode === "create" ? "提交房源" : "保存修改"}
        </Button>
      </div>
    </form>
  );
}
