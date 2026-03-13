import { StatusPill } from "@/components/shared/status-pill";
import type { PlannerCheckpoint } from "@/types/planner";

type PlannerKpiCheckpointProps = {
  checkpoint: PlannerCheckpoint;
};

export function PlannerKpiCheckpoint({ checkpoint }: PlannerKpiCheckpointProps) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-white">{checkpoint.metric}</div>
        <StatusPill tone={checkpoint.tone}>{checkpoint.successThreshold}</StatusPill>
      </div>
      <div className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">Current Signal</div>
      <div className="mt-2 text-sm leading-6 text-slate-300">{checkpoint.currentSignal}</div>
      <div className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-500">Success Threshold</div>
      <div className="mt-2 text-sm leading-6 text-cyan-100">{checkpoint.successThreshold}</div>
      <div className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-500">Interpretation</div>
      <div className="mt-2 text-sm leading-6 text-slate-400">{checkpoint.note}</div>
    </div>
  );
}
