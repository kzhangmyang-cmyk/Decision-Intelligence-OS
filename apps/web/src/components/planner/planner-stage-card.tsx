import { ArrowRight, ShieldAlert } from "lucide-react";

import { StatusPill } from "@/components/shared/status-pill";
import { PlannerKpiCheckpoint } from "@/components/planner/planner-kpi-checkpoint";
import { cn } from "@/lib/utils";
import type { PlannerStage } from "@/types/planner";

const decisionTone = {
  Go: "emerald",
  Adjust: "amber",
  Stop: "rose",
} as const;

type PlannerStageCardProps = {
  stage: PlannerStage;
  index: number;
};

export function PlannerStageCard({ stage, index }: PlannerStageCardProps) {
  return (
    <div className="relative rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-6 shadow-panel backdrop-blur-xl">
      {index < 4 ? (
        <div className="absolute left-8 top-[86px] hidden h-[calc(100%-20px)] w-px bg-gradient-to-b from-cyan-300/35 to-transparent xl:block" />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.34fr,0.66fr]">
        <div className="space-y-4 xl:pr-4">
          <div className="flex items-center justify-between gap-3 xl:block xl:space-y-3">
            <StatusPill tone={stage.tone}>{stage.label}</StatusPill>
            <StatusPill tone={decisionTone[stage.decision]}>{stage.decision}</StatusPill>
          </div>

          <div>
            <div className="text-2xl font-semibold tracking-[-0.05em] text-white">{stage.title}</div>
            <div className="mt-3 text-sm leading-6 text-slate-300">{stage.objective}</div>
          </div>

          <div className={cn("rounded-[22px] border p-4", stage.decision === "Go" ? "border-emerald-300/15 bg-emerald-300/[0.07]" : stage.decision === "Adjust" ? "border-amber-300/15 bg-amber-300/[0.07]" : "border-rose-300/15 bg-rose-300/[0.07]") }>
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Decision Gate</div>
            <div className="mt-3 text-sm leading-6 text-slate-100">{stage.decisionReason}</div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Recommended Actions</div>
            <div className="mt-4 grid gap-3">
              {stage.recommendedActions.map((action) => (
                <div key={action} className="flex items-start gap-3 rounded-[20px] border border-white/8 bg-white/[0.02] p-4">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-sm leading-6 text-slate-200">{action}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">KPI Checkpoints</div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {stage.checkpoints.map((checkpoint) => (
                <PlannerKpiCheckpoint key={`${stage.id}-${checkpoint.metric}`} checkpoint={checkpoint} />
              ))}
            </div>
          </div>

          <div className="rounded-[22px] border border-amber-300/15 bg-amber-300/[0.08] p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-amber-100">
              <ShieldAlert className="h-4 w-4" />
              If This Fails
            </div>
            <div className="mt-3 text-sm leading-6 text-slate-200">{stage.adjustmentAdvice}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
