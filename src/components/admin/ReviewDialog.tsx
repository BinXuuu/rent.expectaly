"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/Textarea";

export type ReviewDecision = "resolve" | "dismiss" | "remove";

const DECISION_LABELS: Record<ReviewDecision, string> = {
  resolve: "标记为已处理",
  dismiss: "驳回举报",
  remove: "下架/隐藏内容",
};

const DECISION_CONFIRMATIONS: Record<ReviewDecision, string> = {
  resolve: "已标记为已处理。",
  dismiss: "已驳回该举报。",
  remove: "对应内容已下架/隐藏，并记录到审计日志。",
};

export interface ReviewDialogProps {
  title: string;
  subject: string;
  triggerLabel?: string;
}

/** 通用审核决定弹层：举报处理/房源审核/评论管理等场景共用，第一期为界面交互演示，未接入真实状态写入。 */
export function ReviewDialog({ title, subject, triggerLabel = "处理" }: ReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [decision, setDecision] = useState<ReviewDecision | null>(null);

  function handleClose() {
    setOpen(false);
    setDecision(null);
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <Dialog open={open} onClose={handleClose} title={title} description={subject}>
        {decision ? (
          <div className="flex flex-col gap-4">
            <p className="text-ink text-sm">{DECISION_CONFIRMATIONS[decision]}</p>
            <Button variant="secondary" onClick={handleClose} className="w-fit">
              关闭
            </Button>
          </div>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              setDecision(formData.get("decision") as ReviewDecision);
            }}
          >
            <fieldset className="flex flex-col gap-2">
              <legend className="text-ink text-sm font-medium">处理决定</legend>
              {(Object.keys(DECISION_LABELS) as ReviewDecision[]).map((key) => (
                <label key={key} className="text-ink-muted flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="decision"
                    value={key}
                    defaultChecked={key === "resolve"}
                    className="accent-brand-700"
                  />
                  {DECISION_LABELS[key]}
                </label>
              ))}
            </fieldset>
            <Textarea label="处理说明" name="note" placeholder="填写处理原因，供审计记录" />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={handleClose}>
                取消
              </Button>
              <Button type="submit" variant="primary">
                提交处理结果
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </>
  );
}
