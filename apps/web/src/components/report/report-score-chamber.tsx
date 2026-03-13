import { BrainCircuit, DatabaseZap, ShieldCheck, Sparkles } from "lucide-react";

import { StatusPill } from "@/components/shared/status-pill";
import { Card, CardContent } from "@/components/ui/card";
import type { ReportSummary } from "@/types/console";

type ReportScoreChamberProps = {
  summary: ReportSummary;
};

export function ReportScoreChamber({ summary }: ReportScoreChamberProps) {
  return (
    <Card className="overflow-hidden border-cyan-300/15 bg-[linear-gradient(180deg,rgba(8,47,73,0.3),rgba(2,6,23,0.92))]">
      <CardContent className="relative p-6 md:p-7">
        <div className="absolute right-[-3rem] top-[-3rem] h-44 w-44 rounded-full bg-cyan-300/10 blur-[90px]" />
        <div className="absolute bottom-[-3rem] left-[-2rem] h-36 w-36 rounded-full bg-sky-400/10 blur-[80px]" />

        <div className="relative grid gap-6 xl:grid-cols-[0.95fr,1.05fr] xl:items-center">
          <div className="rounded-[28px] border border-cyan-300/15 bg-slate-950/70 p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Viability Score</div>
              <StatusPill tone="cyan">{summary.viabilityLabel}</StatusPill>
            </div>

            <div className="mt-8 flex items-end gap-4">
              <div className="text-7xl font-semibold tracking-[-0.08em] text-white md:text-8xl">
                {summary.viabilityScore}
              </div>
              <div className="pb-3 text-sm uppercase tracking-[0.28em] text-slate-500">/ 100</div>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-900/80">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.55),rgba(56,189,248,0.95),rgba(244,244,245,0.85))]"
                style={{ width: `${summary.viabilityScore}%` }}
              />
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                <Sparkles className="h-4 w-4 text-cyan-200" />
                strategic verdict
              </div>
              <div className="mt-3 text-base leading-7 text-slate-100">{summary.strategicVerdict}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                  <DatabaseZap className="h-4 w-4 text-cyan-200" />
                  data sufficiency
                </div>
                <div className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-white">
                  {summary.dataSufficiency}
                </div>
                <div className="mt-2 text-sm text-slate-300">{summary.dataSufficiencyLabel}</div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-900/80">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.25),rgba(34,211,238,0.8))]"
                    style={{ width: `${summary.dataSufficiency}%` }}
                  />
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-200" />
                  confidence
                </div>
                <div className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-white">
                  {summary.confidence}
                </div>
                <div className="mt-2 text-sm text-slate-300">{summary.confidenceLabel}</div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-900/80">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(16,185,129,0.25),rgba(16,185,129,0.78))]"
                    style={{ width: `${summary.confidence}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                <BrainCircuit className="h-4 w-4 text-cyan-200" />
                executive intelligence brief
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300 md:text-[15px]">
                {summary.executiveSummary}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
