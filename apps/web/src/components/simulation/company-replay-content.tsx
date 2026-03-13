import Link from "next/link";
import { ArrowRight, BrainCircuit, Compass, Radar, Skull, Sparkles, Waypoints } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusPill } from "@/components/shared/status-pill";
import { WorldlineDecisionLog } from "@/components/simulation/worldline-decision-log";
import { WorldlineEventStream } from "@/components/simulation/worldline-event-stream";
import { WorldlineMetricsChart } from "@/components/simulation/worldline-metrics-chart";
import { WorldlineStageTimeline } from "@/components/simulation/worldline-stage-timeline";
import { WorldlineStateCard } from "@/components/simulation/worldline-state-card";
import { buttonVariants } from "@/components/ui/button";
import type { WorldlineReplay } from "@/types/simulation";

type CompanyReplayContentProps = {
  replay: WorldlineReplay;
};

export function CompanyReplayContent({ replay }: CompanyReplayContentProps) {
  const { company } = replay;
  const endStateTone = replay.finalOutcome === "Dead" ? "rose" : replay.finalOutcome === "Explore" ? "amber" : replay.finalOutcome === "Scalable" ? "cyan" : "emerald";

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Worldline Replay"
        title={`${company.name}: replay one startup trajectory across 12 constrained months.`}
        description={replay.finalNarrative}
        badge={`${replay.finalOutcome} outcome`}
        badgeTone={endStateTone}
        actions={
          <>
            <Link href="/simulation" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              Back to Simulation
            </Link>
            <Link href="/planner" className={buttonVariants({ size: "lg" })}>
              Open Planner
              <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.05fr,0.95fr]">
        <SectionCard
          eyebrow="Final Outcome"
          title={`This worldline ends as ${replay.finalOutcome}.`}
          description="The outcome is the compressed end-state of 12 months of decisions, market response, operating constraints, and judge feedback."
          className="border-cyan-300/15 bg-[linear-gradient(180deg,rgba(8,47,73,0.26),rgba(2,6,23,0.92))]"
        >
          <div className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">End State</div>
                <StatusPill tone={endStateTone}>{replay.finalOutcome}</StatusPill>
              </div>
              <div className="mt-8 text-5xl font-semibold tracking-[-0.08em] text-white md:text-6xl">
                {company.outcomeScore}
              </div>
              <div className="mt-2 text-sm uppercase tracking-[0.24em] text-slate-500">worldline score</div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-900/80">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.55),rgba(56,189,248,0.95),rgba(244,244,245,0.85))]"
                  style={{ width: `${company.outcomeScore}%` }}
                />
              </div>

              <div className="mt-6 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                {replay.successOrFailureReason}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <WorldlineStateCard label="Founder Type" value={company.founderType} caption="operator profile" tone="cyan" />
              <WorldlineStateCard label="Strategy Type" value={company.strategyType} caption="execution mode" tone="amber" />
              <WorldlineStateCard label="Months Alive" value={String(company.monthsAlive)} caption="heartbeat duration" tone="default" />
              <WorldlineStateCard
                label={replay.finalOutcome === "Dead" ? "Death Cause" : "Winning Cause"}
                value={replay.finalOutcome === "Dead" ? (company.deathReason ?? "Constraint failure") : replay.finalOutcome}
                caption={replay.finalOutcome === "Dead" ? "terminal cause" : "end-state class"}
                tone={endStateTone}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Judge Agent"
          title="Causal summary from the judge layer"
          description="This is the compressed explanation of why the worldline ends where it does."
          className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.92))]"
        >
          <div className="space-y-4">
            <div className="rounded-[24px] border border-cyan-300/15 bg-cyan-300/10 p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-100">
                <Radar className="h-4 w-4" />
                judge verdict
              </div>
              <div className="mt-4 text-xl font-medium leading-8 text-white">{replay.judgeSummary.headline}</div>
              <div className="mt-3 text-sm leading-6 text-slate-200">{replay.judgeSummary.summary}</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[22px] border border-white/8 bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                  <BrainCircuit className="h-4 w-4 text-cyan-200" />
                  primary cause
                </div>
                <div className="mt-3 text-sm leading-6 text-white">{replay.judgeSummary.primaryCause}</div>
              </div>
              <div className="rounded-[22px] border border-white/8 bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                  <Compass className="h-4 w-4 text-cyan-200" />
                  counterfactual
                </div>
                <div className="mt-3 text-sm leading-6 text-white">{replay.judgeSummary.counterfactual}</div>
              </div>
            </div>

            <div className="rounded-[22px] border border-white/8 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                {replay.finalOutcome === "Dead" ? <Skull className="h-4 w-4 text-rose-300" /> : <Sparkles className="h-4 w-4 text-emerald-300" />}
                {replay.finalOutcome === "Dead" ? "death reason" : "success reason"}
              </div>
              <div className="mt-3 text-sm leading-6 text-slate-200">{replay.successOrFailureReason}</div>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        eyebrow="Monthly State"
        title="Cash, revenue, and founder energy through the replay"
        description="This chart shows the startup as a state machine over time. Money, traction, and human energy move together, not separately."
        className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.92))]"
      >
        <WorldlineMetricsChart data={company.timeline} />
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-[0.95fr,1.05fr]">
        <SectionCard
          eyebrow="Stage Changes"
          title="How the worldline evolves phase by phase"
          description="The replay is easier to understand when the months are grouped into strategic phase changes instead of a flat sequence."
          className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.92))]"
        >
          <WorldlineStageTimeline stages={replay.stageTimeline} />
        </SectionCard>

        <SectionCard
          eyebrow="Key Events"
          title="Major inflection points in the company narrative"
          description="These events mark the moments that meaningfully bend the trajectory rather than merely describing routine monthly operation."
          className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.92))]"
        >
          <WorldlineEventStream events={replay.keyEvents} />
        </SectionCard>
      </div>

      <SectionCard
        eyebrow="Monthly Decision Log"
        title="What happened each month, and why it mattered"
        description="Every month logs a decision, the rationale, the judge signal, and the state consequence so the replay stays causal and legible."
        className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.92))]"
      >
        <WorldlineDecisionLog logs={replay.monthlyLogs} />
      </SectionCard>

      <div className="rounded-[28px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(34,211,238,0.08),rgba(2,6,23,0.88))] p-5 shadow-panel backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-cyan-200/70">
          <Waypoints className="h-4 w-4" />
          next move
        </div>
        <div className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-white">
          Translate this replay into an action plan before copying its mistakes or over-learning from its wins.
        </div>
        <div className="mt-3 text-sm leading-6 text-slate-300">
          The replay makes one worldline legible. The planner layer turns that insight into concrete next actions,
          metrics, and stop-loss rules for the real startup.
        </div>
        <Link href="/planner" className={buttonVariants({ size: "lg" }) + " mt-6"}>
          Open Planner Layer
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
