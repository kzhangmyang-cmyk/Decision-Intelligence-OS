import { FlaskConical, MoveRight } from "lucide-react";

import { StatusPill } from "@/components/shared/status-pill";
import type { ExperimentStep } from "@/types/console";

type ReportExperimentCardProps = {
  experiment: ExperimentStep;
};

export function ReportExperimentCard({ experiment }: ReportExperimentCardProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.75),rgba(2,6,23,0.88))] p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-200/70">
          <FlaskConical className="h-4 w-4" />
          next best experiment
        </div>
        {experiment.priority ? <StatusPill tone="cyan">#{experiment.priority}</StatusPill> : null}
      </div>

      <div className="mt-4 text-lg font-medium leading-7 text-white">{experiment.title}</div>
      {experiment.why ? <div className="mt-3 text-sm leading-6 text-slate-300">{experiment.why}</div> : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-[20px] border border-white/8 bg-white/[0.02] p-4">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Success Metric</div>
          <div className="mt-3 text-sm leading-6 text-slate-100">{experiment.metric}</div>
        </div>
        <div className="rounded-[20px] border border-white/8 bg-white/[0.02] p-4">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Threshold</div>
          <div className="mt-3 text-sm leading-6 text-cyan-100">{experiment.threshold}</div>
        </div>
      </div>

      {experiment.expectedLearning ? (
        <div className="mt-4 flex items-start gap-2 rounded-[20px] border border-white/8 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">
          <MoveRight className="mt-1 h-4 w-4 shrink-0 text-cyan-200" />
          {experiment.expectedLearning}
        </div>
      ) : null}
    </div>
  );
}
