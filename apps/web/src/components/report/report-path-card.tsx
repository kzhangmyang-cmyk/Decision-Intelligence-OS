import { ArrowUpRight } from "lucide-react";

import { StatusPill } from "@/components/shared/status-pill";
import { cn } from "@/lib/utils";
import type { DecisionPath } from "@/types/console";

const toneClasses = {
  cyan: "border-cyan-300/20 bg-cyan-300/[0.08]",
  emerald: "border-emerald-300/20 bg-emerald-300/[0.08]",
  amber: "border-amber-300/20 bg-amber-300/[0.08]",
  rose: "border-rose-300/20 bg-rose-300/[0.08]",
  default: "border-white/10 bg-white/[0.03]",
};

type ReportPathCardProps = {
  path: DecisionPath;
};

export function ReportPathCard({ path }: ReportPathCardProps) {
  const tone = path.tone ?? "default";

  return (
    <div className={cn("rounded-[24px] border p-5", toneClasses[tone])}>
      <div className="flex items-center justify-between gap-3">
        <StatusPill tone={tone}>{path.label}</StatusPill>
        <ArrowUpRight className="h-4 w-4 text-slate-500" />
      </div>
      <div className="mt-4 text-lg font-medium leading-7 text-white">{path.title}</div>
      <div className="mt-3 text-sm leading-6 text-slate-300">{path.description}</div>
      <div className="mt-4 rounded-[18px] border border-white/8 bg-slate-950/60 p-3 text-sm text-slate-400">
        {path.condition}
      </div>
    </div>
  );
}
