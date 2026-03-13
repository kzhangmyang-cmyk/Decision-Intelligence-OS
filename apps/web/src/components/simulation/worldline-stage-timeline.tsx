import { StatusPill } from "@/components/shared/status-pill";
import { EmptyState } from "@/components/feedback/empty-state";
import type { StageChange } from "@/types/simulation";

type WorldlineStageTimelineProps = {
  stages: StageChange[];
};

export function WorldlineStageTimeline({ stages }: WorldlineStageTimelineProps) {
  if (stages.length === 0) {
    return (
      <EmptyState
        title="No stage transitions recorded"
        description="This replay branch does not yet expose grouped phase changes."
      />
    );
  }

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => (
        <div key={`${stage.stage}-${stage.startMonth}`} className="relative rounded-[24px] border border-white/8 bg-white/[0.02] p-5">
          {index < stages.length - 1 ? (
            <div className="absolute left-[26px] top-[74px] h-[calc(100%-40px)] w-px bg-gradient-to-b from-cyan-300/40 to-transparent" />
          ) : null}
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-xs font-medium text-cyan-100">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-base font-medium text-white">{stage.stage}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">
                    month {stage.startMonth} - {stage.endMonth}
                  </div>
                </div>
                <StatusPill tone={stage.tone}>{stage.outcome}</StatusPill>
              </div>
              <div className="mt-3 text-sm leading-6 text-slate-400">{stage.summary}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
