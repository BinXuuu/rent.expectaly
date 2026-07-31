"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { Drawer } from "@/components/ui/Drawer";
import { PageContainer } from "@/components/shared/PageContainer";
import { Grid } from "@/components/shared/Grid";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ListingCardSkeleton } from "@/components/shared/Skeleton";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { ListingCard } from "@/components/listing/ListingCard";
import { CityCard } from "@/components/city/CityCard";
import { mockCities, mockListings } from "@/data/mock";
import { filterPubliclyVisibleListings } from "@/lib/services/listing-lifecycle-service";

const COLOR_SWATCHES: { token: string; className: string }[] = [
  { token: "paper", className: "bg-paper" },
  { token: "surface", className: "bg-surface border border-line" },
  { token: "surface-muted", className: "bg-surface-muted" },
  { token: "line", className: "bg-line" },
  { token: "line-strong", className: "bg-line-strong" },
  { token: "ink", className: "bg-ink" },
  { token: "ink-muted", className: "bg-ink-muted" },
  { token: "ink-faint", className: "bg-ink-faint" },
  { token: "brand-50", className: "bg-brand-50" },
  { token: "brand-100", className: "bg-brand-100" },
  { token: "brand-700", className: "bg-brand-700" },
  { token: "brand-900", className: "bg-brand-900" },
  { token: "success-700", className: "bg-success-700" },
  { token: "warning-900", className: "bg-warning-900" },
  { token: "danger-900", className: "bg-danger-900" },
];

const BADGE_TONES: BadgeTone[] = [
  "neutral",
  "accent",
  "emphasis",
  "muted",
  "success",
  "warning",
  "danger",
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-line flex flex-col gap-4 border-t py-10 first:border-t-0 first:pt-0">
      <h2 className="text-ink font-serif text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function UiKitPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inputError, setInputError] = useState(false);

  const demoListings = filterPubliclyVisibleListings(mockListings).slice(0, 4);
  const demoCities = mockCities.slice(0, 4);
  const cityNameById = new Map(mockCities.map((c) => [c.id, c.name["zh-CN"]]));

  return (
    <PageContainer className="py-12">
      <header className="mb-4">
        <p className="text-ink-faint text-xs tracking-[0.2em] uppercase">
          Internal / Design System
        </p>
        <h1 className="text-ink mt-2 font-serif text-3xl font-semibold">内部 UI 组件展示页</h1>
        <p className="text-ink-muted mt-2 max-w-2xl text-sm">
          仅供开发阶段内部核对设计系统一致性使用，不作为正式页面对外发布。
        </p>
      </header>

      <Section title="色彩">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
          {COLOR_SWATCHES.map((swatch) => (
            <div key={swatch.token} className="flex flex-col gap-2">
              <div className={`h-16 rounded-sm ${swatch.className}`} />
              <span className="text-ink-muted text-xs">{swatch.token}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="字体">
        <div className="flex flex-col gap-3">
          <p className="text-ink font-serif text-3xl font-semibold">
            Expectaly Rent 意料之中～意租
          </p>
          <p className="text-ink text-base">
            正文中文使用系统无衬线字体栈，保证跨平台渲染速度与一致性。
          </p>
          <p className="text-ink-muted text-sm">次要文字 / 说明性文字 Secondary text</p>
          <p className="text-ink-faint text-xs">弱化文字 / 占位说明 Faint text</p>
        </div>
      </Section>

      <Section title="按钮">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">主要按钮</Button>
          <Button variant="secondary">次要按钮</Button>
          <Button variant="ghost">幽灵按钮</Button>
          <Button variant="danger">危险按钮</Button>
          <Button variant="primary" isLoading>
            加载中
          </Button>
          <Button variant="primary" disabled>
            禁用
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">小</Button>
          <Button size="md">中</Button>
          <Button size="lg">大</Button>
        </div>
      </Section>

      <Section title="表单控件">
        <div className="grid max-w-xl gap-4">
          <Input label="房源标题" placeholder="如：米兰纳维利运河区精装一室公寓" />
          <Input
            label="月租（欧元）"
            type="number"
            error={inputError ? "请输入大于 0 的金额" : undefined}
            onChange={(e) => setInputError(Number(e.target.value) <= 0)}
          />
          <Textarea label="房源描述" description="详细描述房屋情况、周边交通等信息" />
          <Select
            label="房型"
            placeholder="请选择房型"
            options={[
              { value: "entire_place", label: "整租" },
              { value: "private_room", label: "单间" },
              { value: "shared_room", label: "合租" },
              { value: "bed_space", label: "床位" },
            ]}
          />
        </div>
      </Section>

      <Section title="徽章">
        <div className="flex flex-wrap gap-2">
          {BADGE_TONES.map((tone) => (
            <Badge key={tone} tone={tone}>
              {tone}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="弹层 / 抽屉">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setDialogOpen(true)}>打开对话框</Button>
          <Button onClick={() => setDrawerOpen(true)}>打开抽屉</Button>
        </div>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="示例对话框"
          description="用于确认类交互，如举报提交确认。"
        >
          <p className="text-ink-muted text-sm">对话框内容区域。</p>
        </Dialog>
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="示例抽屉"
          side="right"
        >
          <p className="text-ink-muted text-sm">抽屉内容区域，常用于移动端菜单/筛选面板。</p>
        </Drawer>
      </Section>

      <Section title="占位图与骨架屏">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <PlaceholderImage label="占位图示例" aspect="landscape" className="rounded-xs" />
          <ListingCardSkeleton />
        </div>
      </Section>

      <Section title="空状态 / 错误状态">
        <div className="grid gap-6 sm:grid-cols-2">
          <EmptyState title="暂无房源" description="试试更换筛选条件，或稍后再来看看。" />
          <ErrorState onRetry={() => {}} />
        </div>
      </Section>

      <Section title="房源卡片">
        <Grid columns="4">
          {demoListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              cityName={cityNameById.get(listing.cityId)}
            />
          ))}
        </Grid>
      </Section>

      <Section title="城市卡片">
        <Grid columns="4">
          {demoCities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </Grid>
      </Section>
    </PageContainer>
  );
}
