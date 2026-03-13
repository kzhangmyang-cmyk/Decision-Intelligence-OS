"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Binary,
  Filter,
  Gauge,
  Orbit,
  RefreshCw,
  Skull,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusPill } from "@/components/shared/status-pill";
import { SimulationComparisonChart } from "@/components/simulation/simulation-comparison-chart";
import { SimulationDistributionChart } from "@/components/simulation/simulation-distribution-chart";
import { SimulationTrendChart } from "@/components/simulation/simulation-trend-chart";
import { WorldlineGrid } from "@/components/simulation/worldline-grid";
import { WorldlineMatrix } from "@/components/simulation/worldline-matrix";
import { buttonVariants } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  buildDeathReasonDistribution,
  buildFounderPerformance,
  buildSimulationSnapshot,
  buildStrategyPerformance,
  filterWorldlines,
} from "@/lib/simulation-analytics";
import type { SimulationOverviewRecord } from "@/types/api";
import type { SignalTone } from "@/types/console";
import type { SimulationFilters } from "@/types/simulation";

const initialFilters: SimulationFilters = {
  founderType: "all",
  status: "all",
  strategyType: "all",
};

type StatusCard = {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  tone: SignalTone;
};

type SimulationOverviewContentProps = {
  data?: SimulationOverviewRecord;
  scenarioId?: string;
};

function buildPlannerHref(scenarioId?: string, simulationId?: string) {
  if (!scenarioId) return "/planner";
  const query = new URLSearchParams({ scenarioId });

  if (simulationId) {
    query.set("simulationId", simulationId);
  }

  return `/planner?${query.toString()}`;
}

function buildReportHref(scenarioId?: string) {
  return scenarioId ? `/report?${new URLSearchParams({ scenarioId }).toString()}` : "/report";
}

export function SimulationOverviewContent({ data, scenarioId }: SimulationOverviewContentProps) {
  const [filters, setFilters] = useState<SimulationFilters>(initialFilters);
  const baseCompanies = useMemo(() => data?.companies ?? [], [data?.companies]);

  const filteredCompanies = useMemo(() => {
    const items = filterWorldlines(baseCompanies, filters);
    return [...items].sort((a, b) => b.outcomeScore - a.outcomeScore);
  }, [baseCompanies, filters]);

  const snapshot = useMemo(() => buildSimulationSnapshot(filteredCompanies), [filteredCompanies]);
  const deathReasons = useMemo(() => buildDeathReasonDistribution(filteredCompanies), [filteredCompanies]);
  const founderPerformance = useMemo(() => buildFounderPerformance(filteredCompanies), [filteredCompanies]);
  const strategyPerformance = useMemo(() => buildStrategyPerformance(filteredCompanies), [filteredCompanies]);

  const founderOptions = useMemo(() => ["all", ...Array.from(new Set(baseCompanies.map((company) => company.founderType))).sort()], [baseCompanies]);
  const strategyOptions = useMemo(() => ["all", ...Array.from(new Set(baseCompanies.map((company) => company.strategyType))).sort()], [baseCompanies]);
  const statusOptions = useMemo(() => ["all", ...Array.from(new Set(baseCompanies.map((company) => company.status))).sort()], [baseCompanies]);

  const statusCards: StatusCard[] = [
    {
      label: "Filtered worldlines",
      value: String(snapshot.total),
      caption: "active under current filters",
      icon: Orbit,
      tone: "cyan",
    },
    {
      label: "Month-12 survivors",
      value: String(snapshot.survivors),
      caption: "survived or broke out",
      icon: Sparkles,
      tone: "emerald",
    },
    {
      label: "Average profitability",
      value: `${snapshot.averageProfitability}%`,
      caption: "latest cohort profitability signal",
      icon: Gauge,
      tone: snapshot.averageProfitability >= 0 ? "emerald" : "amber",
    },
    {
      label: "Failed worldlines",
      value: String(snapshot.failed),
      caption: "terminated by constraints",
      icon: Skull,
      tone: "rose",
    },
  ];

  function updateFilter<K extends keyof SimulationFilters>(key: K, value: SimulationFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function resetFilters() {
    setFilters(initialFilters);
  }

  if (!data || baseCompanies.length === 0) {
    return (
      <div className="space-y-4">
        <PageHeader
          eyebrow="Simulation Overview"
          title="Worldline simulation command center for 100 branches."
          description="The same scenario runs across constrained branches so you can inspect survival, profitability, and failure patterns before committing to one path."
          badge="no simulation loaded"
        />
        <EmptyState
          title="No simulation run selected"
          description="Open a report first, then run a simulation for a real scenario so this page can render backend worldlines instead of mock data."
          action={
            <Link href={buildReportHref(scenarioId)} className={buttonVariants({ size: "lg" })}>
              Open Report
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Simulation Overview"
        title="Worldline simulation command center for 100 branches."
        description="The same scenario runs across 100 constrained branches with different profiles, choices, and noise conditions. This console shows which worldlines survive, fail, or break out over 12 phases."
        badge={`${baseCompanies.length} worldlines loaded`}
        actions={
          <Link href={buildPlannerHref(scenarioId, data.id)} className={buttonVariants({ size: "lg" })}>
            Open Planner
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.05fr,0.95fr]">
        <SectionCard
          eyebrow="Worldline Field"
          title="100 trajectories in one visual field"
          description="Every tile is one virtual company. Color encodes outcome state across the simulation run."
          className="border-cyan-300/15 bg-[linear-gradient(180deg,rgba(8,47,73,0.26),rgba(2,6,23,0.92))]"
        >
          <div className="space-y-6">
            <WorldlineMatrix companies={baseCompanies} />
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone="cyan">breakout</StatusPill>
              <StatusPill tone="emerald">survived</StatusPill>
              <StatusPill tone="amber">stalled</StatusPill>
              <StatusPill tone="rose">failed</StatusPill>
            </div>
          </div>
        </SectionCard>

        <div className="grid gap-4 sm:grid-cols-2">
          {statusCards.map((item) => (
            <div
              key={item.label}
              className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.9))] p-5 shadow-panel backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.label}</div>
                <StatusPill tone={item.tone}>{item.caption}</StatusPill>
              </div>
              <div className="mt-5 flex items-end justify-between gap-3">
                <div className="text-4xl font-semibold tracking-[-0.06em] text-white">{item.value}</div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-cyan-200">
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SectionCard
        eyebrow="Simulation Filters"
        title="Slice the worldline field by founder, status, and strategy"
        description="Filters update the company grid and cohort comparisons below. The survival and profitability curves remain run-level aggregates returned by the backend."
        className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.9))]"
      >
        <div className="grid gap-4 xl:grid-cols-[1fr,1fr,1fr,auto]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
              <Users className="h-4 w-4 text-cyan-200" />
              founder type
            </div>
            <Select
              value={filters.founderType}
              onChange={(event) => updateFilter("founderType", event.target.value as SimulationFilters["founderType"])}
            >
              {founderOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
              <Binary className="h-4 w-4 text-cyan-200" />
              status
            </div>
            <Select
              value={filters.status}
              onChange={(event) => updateFilter("status", event.target.value as SimulationFilters["status"])}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
              <Filter className="h-4 w-4 text-cyan-200" />
              strategy type
            </div>
            <Select
              value={filters.strategyType}
              onChange={(event) => updateFilter("strategyType", event.target.value as SimulationFilters["strategyType"])}
            >
              {strategyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-slate-200 transition-colors hover:border-cyan-300/20 hover:bg-cyan-300/10 xl:w-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Reset filters
            </button>
          </div>
        </div>
      </SectionCard>

      {filteredCompanies.length === 0 ? (
        <EmptyState
          title="No worldlines match the current filter stack"
          description="The simulation field is empty under this founder, status, and strategy combination. Reset the filters to reopen the full company search space."
          icon={Filter}
          action={
            <button
              type="button"
              onClick={resetFilters}
              className={buttonVariants({ size: "lg", variant: "secondary" })}
            >
              <RefreshCw className="h-4 w-4" />
              Reset filters
            </button>
          }
        />
      ) : null}

      {filteredCompanies.length > 0 ? (
        <>
          <div className="grid gap-4 xl:grid-cols-2">
            <SectionCard
              eyebrow="12-Month Survival Curve"
              title="Run-level survival across the full simulation"
              description="This curve comes from the backend aggregate for the selected simulation run."
              className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.9))]"
            >
              <SimulationTrendChart data={data.survivalCurve} variant="survival" />
            </SectionCard>

            <SectionCard
              eyebrow="Profitability Curve"
              title="Run-level profitability across the full simulation"
              description="This curve is returned by the backend aggregate for the selected run rather than recalculated per filter."
              className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.9))]"
            >
              <SimulationTrendChart data={data.profitabilityCurve} variant="profitability" />
            </SectionCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.88fr,1.12fr]">
            <SectionCard
              eyebrow="Death Reason Distribution"
              title="Why the filtered worldlines die"
              description="This distribution is recalculated from the currently filtered company set."
              className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.9))]"
            >
              <SimulationDistributionChart data={deathReasons} />
            </SectionCard>

            <SectionCard
              eyebrow="Founder Type Comparison"
              title="Which founder profiles hold up best in the filtered cohort"
              description="Outcome score and month-12 survival are shown together to highlight both upside and resilience."
              className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.9))]"
            >
              <SimulationComparisonChart data={founderPerformance} />
            </SectionCard>
          </div>

          <SectionCard
            eyebrow="Strategy Type Comparison"
            title="Strategy shape matters almost as much as founder shape"
            description="This comparison is recalculated from the currently filtered cohort."
            className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.9))]"
          >
            <SimulationComparisonChart data={strategyPerformance} />
          </SectionCard>

          <SectionCard
            eyebrow="100 Company Grid"
            title="Inspect the full virtual company field"
            description="This grid reflects the active filters and keeps the simulation tangible at the company level, not just in aggregate charts."
            className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.9))]"
          >
            <WorldlineGrid companies={filteredCompanies} scenarioId={scenarioId} simulationId={data.id} />
          </SectionCard>
        </>
      ) : null}
    </div>
  );
}
