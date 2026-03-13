import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { StatusPill } from "@/components/shared/status-pill";
import type { WorldlineCompany } from "@/types/simulation";

type WorldlineGridProps = {
  companies: WorldlineCompany[];
  scenarioId?: string;
  simulationId?: string;
};

export function WorldlineGrid({ companies, scenarioId, simulationId }: WorldlineGridProps) {
  if (companies.length === 0) {
    return (
      <EmptyState
        title="No worldlines match this filter state"
        description="Try widening founder type, status, or strategy filters to bring more branches back into the simulation field."
      />
    );
  }

  return (
    <div className="pr-1 xl:max-h-[860px] xl:overflow-auto">
      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {companies.map((company) => (
          <div key={company.id} className="rounded-[22px] border border-white/8 bg-white/[0.02] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm uppercase tracking-[0.24em] text-slate-500">{company.id}</div>
                <div className="mt-2 text-base font-medium text-white">{company.name}</div>
              </div>
              <StatusPill tone={company.tone}>{company.status}</StatusPill>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Founder</div>
                <div className="mt-1">{company.founderType}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Strategy</div>
                <div className="mt-1">{company.strategyType}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Outcome</div>
                <div className="mt-1">{company.outcomeScore}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Month-12 margin</div>
                <div className="mt-1">{company.month12Profitability}%</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-400">
              <span>runway {company.month12Runway} mo</span>
              <Link
                href={
                  company.replayHref ??
                  `/simulation/${company.id}${
                    scenarioId || simulationId
                      ? `?${new URLSearchParams(
                          Object.fromEntries(
                            Object.entries({ scenarioId, simulationId }).filter(([, value]) => value),
                          ) as Record<string, string>,
                        ).toString()}`
                      : ""
                  }`
                }
                className="inline-flex items-center gap-1 text-cyan-100 hover:text-white"
              >
                replay
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
