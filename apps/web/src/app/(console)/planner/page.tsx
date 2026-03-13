import { ArrowRight, Binary, Compass, ShieldAlert, Target, Waypoints } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/feedback/empty-state";
import { PlannerStageCard } from "@/components/planner/planner-stage-card";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusPill } from "@/components/shared/status-pill";
import { buttonVariants } from "@/components/ui/button";
import { ApiClientError } from "@/lib/api";
import { decisionOsDataSource } from "@/lib/api-source";

type PlannerPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function getParam(searchParams: Record<string, string | string[] | undefined> | undefined, key: string) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] : value;
}

function buildQueryString(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  const value = query.toString();
  return value ? `?${value}` : "";
}

async function loadAssessment(scenarioId: string) {
  try {
    return await decisionOsDataSource.getAssessment(scenarioId);
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      return decisionOsDataSource.triggerAssessment(scenarioId);
    }
    throw error;
  }
}

function buildPlannerStance(decisions: Array<"Go" | "Adjust" | "Stop">) {
  const goCount = decisions.filter((decision) => decision === "Go").length;
  const adjustCount = decisions.filter((decision) => decision === "Adjust").length;
  const stopCount = decisions.filter((decision) => decision === "Stop").length;

  return `${goCount} Go / ${adjustCount} Adjust / ${stopCount} Stop gates across the current plan.`;
}

export default async function PlannerPage({ searchParams }: PlannerPageProps) {
  const scenarioId = getParam(searchParams, "scenarioId");
  const simulationId = getParam(searchParams, "simulationId");

  if (!scenarioId) {
    return (
      <EmptyState
        title="No scenario selected for planning"
        description="Run intake, assessment, and simulation first so the planner can build a staged execution sequence from real backend data."
        action={
          <Link href="/intake" className={buttonVariants({ size: "lg" })}>
            Open Intake
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />
    );
  }

  try {
    const [plannerRecord, assessment] = await Promise.all([
      decisionOsDataSource.getPlanner(scenarioId),
      loadAssessment(scenarioId),
    ]);

    const planner = plannerRecord.planner;
    const report = assessment.report;
    const summary = report?.summary;
    const simulationHref = `/simulation${buildQueryString({ scenarioId, simulationId })}`;

    if (!summary) {
      return (
        <EmptyState
          title="Planner prerequisites are incomplete"
          description="The backend returned a planner payload, but the linked assessment summary is missing."
          action={
            <Link href={`/report${buildQueryString({ scenarioId })}`} className={buttonVariants({ size: "lg" })}>
              Open Report
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      );
    }

    const commandMetrics = [
      {
        label: "Viability",
        value: `${summary.viabilityScore}/100`,
        caption: "Decision layer says the idea is worth pursuing under discipline",
        delta: summary.viabilityLabel,
        tone: "cyan" as const,
      },
      {
        label: "Confidence",
        value: `${summary.confidence}%`,
        caption: "Evidence quality is strong enough to sequence action, not to drift",
        delta: summary.confidenceLabel,
        tone: "emerald" as const,
      },
      {
        label: "Primary bet",
        value: planner.primaryBet,
        caption: "The strongest lever the current plan wants to compound first",
        delta: `${planner.stages.length} stages`,
        tone: "cyan" as const,
      },
      {
        label: "Primary failure mode",
        value: planner.failurePattern,
        caption: "The planner is explicitly structured to avoid this pattern",
        delta: "stop-loss anchor",
        tone: "amber" as const,
      },
    ];

    return (
      <div className="space-y-4">
        <PageHeader
          eyebrow="DecisionOS Planner"
          title="Translate judgment and simulation into an operating sequence."
          description="This is the action layer: what to do first, what to measure next, what success looks like, and when to adjust or stop instead of drifting forward by default."
          badge={`${planner.stages.length}-stage execution path`}
          actions={
            <Link href={simulationHref} className={buttonVariants({ variant: "secondary", size: "lg" })}>
              Back to Simulation
            </Link>
          }
        />

        <div className="grid gap-4 lg:grid-cols-4">
          {commandMetrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.02fr,0.98fr]">
          <SectionCard
            eyebrow="Planning Brief"
            title={planner.headline}
            description={planner.summary}
            className="border-cyan-300/15 bg-[linear-gradient(180deg,rgba(8,47,73,0.26),rgba(2,6,23,0.92))]"
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                  <Target className="h-4 w-4 text-cyan-200" />
                  primary bet
                </div>
                <div className="mt-4 text-lg font-medium leading-7 text-white">{planner.primaryBet}</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                  <Compass className="h-4 w-4 text-cyan-200" />
                  north star
                </div>
                <div className="mt-4 text-lg font-medium leading-7 text-white">{planner.planningNorthStar}</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                  <ShieldAlert className="h-4 w-4 text-amber-200" />
                  failure pattern
                </div>
                <div className="mt-4 text-lg font-medium leading-7 text-white">{planner.failurePattern}</div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Execution Logic"
            title="The planner tells you what to do next at a glance"
            description="Each phase turns strategic uncertainty into a finite checklist: actions, KPIs, thresholds, correction path, and a go / adjust / stop gate."
            className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.92))]"
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-emerald-300/15 bg-emerald-300/[0.08] p-5">
                <StatusPill tone="emerald">Go</StatusPill>
                <div className="mt-4 text-sm leading-6 text-slate-100">
                  Move forward because the current stage is producing the right signal at the right cost.
                </div>
              </div>
              <div className="rounded-[24px] border border-amber-300/15 bg-amber-300/[0.08] p-5">
                <StatusPill tone="amber">Adjust</StatusPill>
                <div className="mt-4 text-sm leading-6 text-slate-100">
                  Keep the line alive, but correct scope, channel, pricing, or execution before continuing.
                </div>
              </div>
              <div className="rounded-[24px] border border-rose-300/15 bg-rose-300/[0.08] p-5">
                <StatusPill tone="rose">Stop</StatusPill>
                <div className="mt-4 text-sm leading-6 text-slate-100">
                  Kill the line when the signal stays weak after correction and the opportunity cost gets too high.
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-white/8 bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-cyan-200/70">
                <Binary className="h-4 w-4" />
                current planner stance
              </div>
              <div className="mt-4 text-lg font-medium leading-7 text-white">
                {buildPlannerStance(planner.stages.map((stage) => stage.decision))}
              </div>
              <div className="mt-3 text-sm leading-6 text-slate-300">{planner.summary}</div>
            </div>
          </SectionCard>
        </div>

        <SectionCard
          eyebrow="Strategic Action Panel"
          title="What to do from Day 1 to Month 6"
          description="Read this top to bottom like a command sequence. Each phase has a clear objective, concrete actions, KPIs, thresholds, a failure response, and a decision gate."
          className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.92))]"
        >
          <div className="space-y-4">
            {planner.stages.map((stage, index) => (
              <PlannerStageCard key={stage.id} stage={stage} index={index} />
            ))}
          </div>
        </SectionCard>

        <div className="rounded-[28px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(34,211,238,0.08),rgba(2,6,23,0.88))] p-5 shadow-panel backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-cyan-200/70">
            <Waypoints className="h-4 w-4" />
            execution note
          </div>
          <div className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-white">
            The planner is not a roadmap generator. It is a sequencing engine for the next irreversible decisions.
          </div>
          <div className="mt-3 text-sm leading-6 text-slate-300">
            This page is now driven by the latest assessment and simulation persisted for the selected scenario, so the
            stage gates reflect real backend outputs rather than a static blueprint.
          </div>
          <Link href="/intake" className={buttonVariants({ size: "lg" }) + " mt-6"}>
            Revisit Intake
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      return (
        <EmptyState
          title="Scenario not found"
          description="The selected scenario does not exist in the backend anymore."
          action={
            <Link href="/intake" className={buttonVariants({ size: "lg" })}>
              Open Intake
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      );
    }

    if (error instanceof ApiClientError && error.status === 409) {
      return (
        <EmptyState
          title="Planner prerequisites are not ready"
          description={error.message}
          action={
            <Link href={`/simulation${buildQueryString({ scenarioId, simulationId })}`} className={buttonVariants({ size: "lg" })}>
              Open Simulation
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      );
    }

    throw error;
  }
}
