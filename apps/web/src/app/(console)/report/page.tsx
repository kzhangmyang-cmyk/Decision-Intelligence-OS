import Link from "next/link";
import { ArrowRight, Binary, DatabaseZap, Waypoints } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { ReportExperimentCard } from "@/components/report/report-experiment-card";
import { ReportPathCard } from "@/components/report/report-path-card";
import { ReportRadarChart } from "@/components/report/report-radar-chart";
import { ReportScoreChamber } from "@/components/report/report-score-chamber";
import { ReportSignalList } from "@/components/report/report-signal-list";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { buttonVariants } from "@/components/ui/button";
import { ApiClientError } from "@/lib/api";
import { decisionOsDataSource } from "@/lib/api-source";
import type { ScoreBreakdown } from "@/types/console";

type ReportPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function getScenarioId(searchParams?: Record<string, string | string[] | undefined>) {
  const value = searchParams?.scenarioId;
  return Array.isArray(value) ? value[0] : value;
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

function buildCoverageMatrix(scoreBreakdown: ScoreBreakdown[]) {
  return scoreBreakdown.slice(0, 4).map((item) => ({
    label: item.label,
    score: item.score,
    confidence: item.confidence,
    note: item.note,
  }));
}

export default async function ReportPage({ searchParams }: ReportPageProps) {
  const scenarioId = getScenarioId(searchParams);

  if (!scenarioId) {
    return (
      <EmptyState
        title="No scenario selected for this report"
        description="Start from intake so the backend can create a scenario and generate a real assessment report."
        action={
          <Link href="/intake" className={buttonVariants({ size: "lg" })}>
            Open Intake
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />
    );
  }

  let assessment;

  try {
    assessment = await loadAssessment(scenarioId);
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

    throw error;
  }

  const report = assessment.report;

  if (!report) {
    return (
      <EmptyState
        title="Assessment completed without a report payload"
        description="The scenario exists, but the backend did not return a usable assessment report yet."
        action={
          <Link href="/intake" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Revisit Intake
          </Link>
        }
      />
    );
  }

  const summary = report.summary;
  const scoreBreakdown = report.scoreBreakdown;
  const risks = report.topRisks;
  const levers = report.topLevers;
  const paths = report.strategicPaths;
  const experiments = report.experiments;
  const coverageMatrix = buildCoverageMatrix(scoreBreakdown);
  const simulationHref = `/simulation?scenarioId=${scenarioId}`;

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Decision Report"
        title="Read the scenario like a structured intelligence brief, not a dashboard."
        description="The decision engine compresses the current thesis into a viability judgment, evidence posture, strategic paths, and the experiments most likely to change the odds."
        badge={`viability ${summary.viabilityScore}/100`}
        actions={
          <Link href={simulationHref} className={buttonVariants({ size: "lg" })}>
            Run 100 Simulations
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.08fr,0.92fr]">
        <ReportScoreChamber summary={summary} />

        <SectionCard
          eyebrow="Evidence Posture"
          title="Data sufficiency is improving, but not evenly across the thesis"
          description="The engine distinguishes between idea quality and data quality. A decent venture can still be under-evidenced."
          className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.74),rgba(2,6,23,0.9))]"
        >
          <div className="space-y-4">
            {coverageMatrix.map((item) => (
              <div key={item.label} className="rounded-[22px] border border-white/8 bg-white/[0.02] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-white">{item.label}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-400">{item.note}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-white">{item.score}</div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">conf {item.confidence}</div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-500">
                      <span>sufficiency</span>
                      <span>{item.score}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-900/80">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.25),rgba(34,211,238,0.82))]"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-500">
                      <span>confidence</span>
                      <span>{item.confidence}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-900/80">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,rgba(16,185,129,0.25),rgba(16,185,129,0.8))]"
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-[22px] border border-amber-300/15 bg-amber-300/[0.08] p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-amber-100">
                <DatabaseZap className="h-4 w-4" />
                blind spot
              </div>
              <div className="mt-3 text-sm leading-6 text-slate-200">
                {experiments[0]?.why ?? "The weakest evidence zones should be tested before the system commits to heavier execution."}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr,0.85fr]">
        <SectionCard
          eyebrow="8-Dimensional Assessment"
          title="How the engine scores the scenario across the core decision dimensions"
          description="This is not a vanity chart. Each axis is tied to a specific decision mechanism that can strengthen or collapse the path."
          className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.74),rgba(2,6,23,0.9))]"
        >
          <ReportRadarChart breakdown={scoreBreakdown} />
        </SectionCard>

        <SectionCard
          eyebrow="Suggested Strategic Paths"
          title="The most plausible paths from this report"
          description="The report does not stop at a score. It suggests which strategic path is strongest, conditional, or likely wrong."
          className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.74),rgba(2,6,23,0.9))]"
        >
          <div className="space-y-4">
            {paths.map((path) => (
              <ReportPathCard key={path.title} path={path} />
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          eyebrow="Top Risks"
          title="What is most likely to break the venture"
          description="These are the mechanisms that destroy viability if they stay unresolved for too long."
          className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.74),rgba(2,6,23,0.9))]"
        >
          <ReportSignalList items={risks} kind="risk" />
        </SectionCard>

        <SectionCard
          eyebrow="Top Levers"
          title="What most improves the odds"
          description="These are the moves that repeatedly improve outcomes across the decision logic and later simulations."
          className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.74),rgba(2,6,23,0.9))]"
        >
          <ReportSignalList items={levers} kind="lever" />
        </SectionCard>
      </div>

      <SectionCard
        eyebrow="Top 3 Next Best Experiments"
        title="The next tests most likely to change the decision"
        description="The engine prioritizes experiments that reduce uncertainty fast, rather than generating long recommendation lists."
        className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.74),rgba(2,6,23,0.9))]"
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {experiments.map((experiment) => (
            <ReportExperimentCard key={experiment.title} experiment={experiment} />
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-[1fr,0.9fr]">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-panel backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-cyan-200/70">
            <Binary className="h-4 w-4" />
            intelligence posture
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-[22px] border border-white/8 bg-white/[0.02] p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Viability</div>
              <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">{summary.viabilityLabel}</div>
            </div>
            <div className="rounded-[22px] border border-white/8 bg-white/[0.02] p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Data Sufficiency</div>
              <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">{summary.dataSufficiencyLabel}</div>
            </div>
            <div className="rounded-[22px] border border-white/8 bg-white/[0.02] p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Confidence</div>
              <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">{summary.confidenceLabel}</div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(34,211,238,0.08),rgba(2,6,23,0.88))] p-5 shadow-panel backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-cyan-200/70">
            <Waypoints className="h-4 w-4" />
            next route
          </div>
          <div className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-white">
            Use simulation to pressure-test the recommended strategic path.
          </div>
          <div className="mt-3 text-sm leading-6 text-slate-300">
            The report says the idea is worth pursuing under discipline. The next step is to see how that thesis behaves
            across 100 constrained company worldlines before real capital gets allocated.
          </div>
          <Link href={simulationHref} className={buttonVariants({ size: "lg" }) + " mt-6"}>
            Open Simulation Layer
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
