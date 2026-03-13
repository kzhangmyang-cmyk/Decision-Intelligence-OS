import { AlertTriangle, Sparkles } from "lucide-react";

import { StatusPill } from "@/components/shared/status-pill";
import type { InsightBlock } from "@/types/console";

type ReportSignalListProps = {
  items: InsightBlock[];
  kind: "risk" | "lever";
};

export function ReportSignalList({ items, kind }: ReportSignalListProps) {
  const Icon = kind === "risk" ? AlertTriangle : Sparkles;

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.title} className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-cyan-200">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-base font-medium leading-7 text-white">{item.title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">{item.body}</div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <StatusPill tone={item.tone}>{kind}</StatusPill>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">0{index + 1}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
