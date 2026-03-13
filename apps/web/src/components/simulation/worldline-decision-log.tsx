import { Binary } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { StatusPill } from "@/components/shared/status-pill";
import type { MonthlyDecisionLog } from "@/types/simulation";

type WorldlineDecisionLogProps = {
  logs: MonthlyDecisionLog[];
};

export function WorldlineDecisionLog({ logs }: WorldlineDecisionLogProps) {
  if (logs.length === 0) {
    return (
      <EmptyState
        title="No monthly decision log yet"
        description="This replay branch does not have structured monthly decision entries available."
      />
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.label} className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
              <Binary className="h-4 w-4 text-cyan-200" />
              {log.label}
            </div>
            <StatusPill tone={log.tone}>{log.month <= 3 ? "early" : log.month <= 8 ? "mid" : "late"}</StatusPill>
          </div>

          <div className="mt-4 text-base font-medium leading-7 text-white">{log.decision}</div>
          <div className="mt-3 text-sm leading-6 text-slate-400">{log.rationale}</div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-[18px] border border-white/8 bg-slate-950/60 p-3">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Judge</div>
              <div className="mt-2 text-sm leading-6 text-slate-200">{log.judgeSignal}</div>
            </div>
            <div className="rounded-[18px] border border-white/8 bg-slate-950/60 p-3">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Finance</div>
              <div className="mt-2 text-sm leading-6 text-slate-200">{log.financeImpact}</div>
            </div>
            <div className="rounded-[18px] border border-white/8 bg-slate-950/60 p-3">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Market</div>
              <div className="mt-2 text-sm leading-6 text-slate-200">{log.marketSignal}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
