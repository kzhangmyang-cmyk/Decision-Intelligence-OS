import type {
  AssessmentRecord,
  CompanyDetailRecord,
  CompanyTimelineRecord,
  PlannerRecord,
  ScenarioRecord,
  SimulationOverviewRecord,
} from "@/types/api";
import type { DecisionPath, ExperimentStep, InsightBlock, IntakeAttachment, IntakeDraft, ReportSummary, ScoreBreakdown } from "@/types/console";
import type { PlannerBlueprint, PlannerCheckpoint, PlannerDecision, PlannerStage } from "@/types/planner";
import type {
  MonthlyDecisionLog,
  MonthlyKeyEvent,
  StageChange,
  WorldlineCompany,
  WorldlineMonth,
  WorldlineOutcome,
  WorldlineReplay,
} from "@/types/simulation";

type BackendScenario = {
  id: string;
  oneLinePitch: string;
  structuredInputs: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

type BackendAssessment = {
  id: string;
  scenarioId: string;
  viabilityScore: number;
  dimensionScores: Array<{ label: string; score: number; confidence?: number; note?: string }>;
  dataSufficiency: number;
  confidence: number;
  topRisks: Array<{ title: string; body: string; tone?: string }>;
  topLevers: Array<{ title: string; body: string; tone?: string }>;
  suggestedPaths: Array<{ label: string; title: string; description: string; condition?: string; tone?: string }>;
  nextBestExperiments: Array<{
    title: string;
    metric: string;
    threshold: string;
    why?: string;
    expectedLearning?: string;
    priority?: string;
  }>;
  createdAt?: string;
};

type BackendOverviewCompany = {
  id: string;
  simulationRunId: string;
  companyIndex: number;
  companyName: string;
  founderType: string;
  pricingStrategy: string;
  channelStrategy: string;
  finalStage?: string | null;
  finalOutcome?: string | null;
  deathReason?: string | null;
  summary?: string | null;
  latestMonthIndex: number;
  latestCashBalance: number;
  latestRunwayMonths: number;
  latestMonthlyRevenue: number;
  latestProfitability: number;
  latestFounderEnergy: number;
  latestStateLabel: string;
  latestScore: number;
};

type BackendSimulationOverview = {
  id: string;
  scenarioId: string;
  status: "queued" | "running" | "completed" | "failed";
  companyCount: number;
  durationMonths: number;
  survivalCurve: Array<{ label: string; value: number }>;
  profitabilityCurve: Array<{ label: string; value: number }>;
  deathReasonDistribution: Array<{ label: string; value: number }>;
  founderTypePerformance: Array<{ label: string; outcomeScore: number; survivalRate: number; profitabilityRate: number; count: number }>;
  strategyTypePerformance: Array<{ label: string; outcomeScore: number; survivalRate: number; profitabilityRate: number; count: number }>;
  companies: BackendOverviewCompany[];
  createdAt?: string;
};

type BackendCompanyDetail = BackendOverviewCompany & {
  judgeSummary?: string | null;
  replayLog?: string | null;
  causes?: string[];
  successReason?: string | null;
};

type BackendCompanyTimelineEntry = {
  monthIndex: number;
  stage: string;
  stateLabel: string;
  cashBalance: number;
  monthlyRevenue: number;
  founderEnergy: number;
  backlogUnits: number;
  qualityScore: number;
  leads: number;
  conversionRate: number;
  churnRate: number;
  repeatRate: number;
  satisfactionDelta: number;
  netProfit: number;
  runwayMonths: number;
  judgeSummary?: string | null;
  replayLog?: string | null;
  keyEvents: string[];
  deathSignals: string[];
};

type BackendCompanyTimeline = {
  companyId: string;
  simulationRunId: string;
  timeline: BackendCompanyTimelineEntry[];
};

type BackendPlanner = {
  scenarioId: string;
  headline: string;
  summary: string;
  primaryBet: string;
  planningNorthStar: string;
  failurePattern: string;
  stages: Array<{
    id: string;
    stageLabel: string;
    stageOrder: number;
    title: string;
    objective: string;
    recommendedActions: string[];
    checkpoints: Array<{
      metric: string;
      currentSignal: string;
      successThreshold: string;
      note: string;
      tone?: string;
    }>;
    adjustmentAdvice: string;
    decision: string;
    decisionReason: string;
    tone?: string;
  }>;
};

function toneFromOutcome(outcome?: string | null): "cyan" | "emerald" | "amber" | "rose" | "default" {
  if (outcome === "scalable") return "cyan";
  if (outcome === "sustainable" || outcome === "survive") return "emerald";
  if (outcome === "explore") return "amber";
  if (outcome === "dead") return "rose";
  return "default";
}

function mapOutcomeToStatus(outcome?: string | null): WorldlineCompany["status"] {
  if (outcome === "scalable") return "breakout";
  if (outcome === "sustainable" || outcome === "survive") return "survived";
  if (outcome === "explore") return "stalled";
  return "failed";
}

function mapOutcomeLabel(outcome?: string | null): WorldlineOutcome {
  if (outcome === "scalable") return "Scalable";
  if (outcome === "sustainable") return "Sustainable";
  if (outcome === "survive") return "Survive";
  if (outcome === "explore") return "Explore";
  return "Dead";
}

function viabilityLabel(score: number) {
  if (score >= 82) return "High Conviction";
  if (score >= 68) return "Selective Go";
  if (score >= 52) return "Conditional";
  return "Low Conviction";
}

function sufficiencyLabel(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Developing";
  return "Thin";
}

function confidenceLabel(score: number) {
  if (score >= 80) return "High";
  if (score >= 65) return "Moderately High";
  if (score >= 50) return "Mixed";
  return "Low";
}

function toIntakeAttachment(value: unknown): IntakeAttachment[] {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => {
    const record = item as Record<string, unknown>;
    return {
      id: String(record.id ?? `evidence-${index + 1}`),
      type: String(record.type ?? "link"),
      url: String(record.url ?? ""),
      note: String(record.note ?? ""),
    };
  });
}

export function mapScenarioToRecord(payload: BackendScenario): ScenarioRecord {
  const structured = payload.structuredInputs ?? {};
  const intake: IntakeDraft = {
    projectName: String(structured.projectName ?? structured.project_name ?? "Scenario"),
    oneLiner: payload.oneLinePitch ?? "",
    targetCustomer: String(structured.targetCustomer ?? structured.target_customer ?? ""),
    corePain: String(structured.corePain ?? structured.core_pain ?? ""),
    solution: String(structured.solution ?? ""),
    businessModel: String(structured.businessModel ?? structured.business_model ?? ""),
    pricing: String(structured.pricing ?? ""),
    acquisitionChannels: String(structured.acquisitionChannels ?? structured.acquisition_channels ?? ""),
    founderProfile: String(structured.founderProfile ?? structured.founder_profile ?? ""),
    teamSize: String(structured.teamSize ?? structured.team_size ?? ""),
    budget: String(structured.budget ?? ""),
    traction: String(structured.traction ?? ""),
    competitors: String(structured.competitors ?? ""),
    supplementaryEvidence: toIntakeAttachment(structured.supplementaryEvidence ?? structured.supplementary_evidence),
  };

  return {
    id: payload.id,
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
    name: intake.projectName || payload.oneLinePitch || "Scenario",
    intake,
    lifecycle: "ready",
  };
}

export function mapAssessmentToRecord(payload: BackendAssessment): AssessmentRecord {
  const scoreBreakdown: ScoreBreakdown[] = payload.dimensionScores.map((item) => ({
    label: item.label,
    score: item.score,
    confidence: item.confidence ?? payload.confidence,
    note: item.note ?? "",
  }));

  const topRisks: InsightBlock[] = payload.topRisks.map((item) => ({
    title: item.title,
    body: item.body,
    tone: item.tone as InsightBlock["tone"],
  }));

  const topLevers: InsightBlock[] = payload.topLevers.map((item) => ({
    title: item.title,
    body: item.body,
    tone: item.tone as InsightBlock["tone"],
  }));

  const strategicPaths: DecisionPath[] = payload.suggestedPaths.map((item) => ({
    label: item.label,
    title: item.title,
    description: item.description,
    condition: item.condition ?? "",
    tone: item.tone as DecisionPath["tone"],
  }));

  const experiments: ExperimentStep[] = payload.nextBestExperiments.map((item) => ({
    title: item.title,
    metric: item.metric,
    threshold: item.threshold,
    why: item.why,
    expectedLearning: item.expectedLearning,
    priority: item.priority,
  }));

  const summary: ReportSummary = {
    viabilityScore: payload.viabilityScore,
    viabilityLabel: viabilityLabel(payload.viabilityScore),
    strategicVerdict: strategicPaths[0]?.description ?? "The scenario merits further testing under disciplined execution.",
    executiveSummary:
      topLevers[0]?.body ?? topRisks[0]?.body ?? "The engine combines viability, evidence quality, and structural constraints into an explainable recommendation.",
    dataSufficiency: payload.dataSufficiency,
    dataSufficiencyLabel: sufficiencyLabel(payload.dataSufficiency),
    confidence: payload.confidence,
    confidenceLabel: confidenceLabel(payload.confidence),
  };

  return {
    id: payload.id,
    createdAt: payload.createdAt,
    scenarioId: payload.scenarioId,
    status: "completed",
    report: {
      summary,
      scoreBreakdown,
      topRisks,
      topLevers,
      strategicPaths,
      experiments,
    },
  };
}

function mapBackendCompany(company: BackendOverviewCompany): WorldlineCompany {
  const strategyType = `${company.pricingStrategy}/${company.channelStrategy}`;
  return {
    id: company.id,
    name: company.companyName,
    founderType: company.founderType,
    strategyType,
    status: mapOutcomeToStatus(company.finalOutcome),
    outcomeScore: company.latestScore,
    monthsAlive: company.latestMonthIndex,
    month12Runway: company.latestRunwayMonths,
    month12Profitability: company.latestProfitability,
    month12Revenue: company.latestMonthlyRevenue,
    deathReason: company.deathReason ?? undefined,
    tone: toneFromOutcome(company.finalOutcome),
    replayHref: undefined,
    timeline: [],
  };
}

export function mapSimulationOverviewToRecord(payload: BackendSimulationOverview): SimulationOverviewRecord {
  return {
    id: payload.id,
    createdAt: payload.createdAt,
    scenarioId: payload.scenarioId,
    status: payload.status,
    companyCount: payload.companyCount,
    months: payload.durationMonths,
    survivalCurve: payload.survivalCurve,
    profitabilityCurve: payload.profitabilityCurve,
    deathReasons: payload.deathReasonDistribution,
    founderPerformance: payload.founderTypePerformance.map((item) => ({
      label: item.label,
      outcomeScore: item.outcomeScore,
      survivalRate: item.survivalRate,
      count: item.count,
    })),
    strategyPerformance: payload.strategyTypePerformance.map((item) => ({
      label: item.label,
      outcomeScore: item.outcomeScore,
      survivalRate: item.survivalRate,
      count: item.count,
    })),
    companies: payload.companies.map(mapBackendCompany),
  };
}

export function mapCompanyDetailToRecord(payload: BackendCompanyDetail): CompanyDetailRecord {
  return {
    scenarioId: "",
    simulationId: payload.simulationRunId,
    company: mapBackendCompany(payload),
    finalOutcome: mapOutcomeLabel(payload.finalOutcome),
    finalNarrative: payload.summary ?? payload.judgeSummary ?? "This worldline reflects the combined effect of market, operations, finance, and founder choices.",
    successOrFailureReason:
      payload.successReason ??
      (payload.deathReason ? `The line ends due to ${payload.deathReason.replaceAll("_", " ")}.` : payload.judgeSummary ?? payload.summary ?? "No summary available."),
    judgeSummary: {
      headline: payload.latestStateLabel || "Judge Summary",
      summary: payload.judgeSummary ?? payload.summary ?? "No judge summary available.",
      primaryCause: payload.causes?.[0] ?? payload.deathReason ?? "compound simulation factors",
      counterfactual: "A different pricing, channel, or wedge choice could shift this worldline into another stage.",
    },
  };
}

function mapTimelinePoints(entries: BackendCompanyTimelineEntry[]): WorldlineMonth[] {
  return entries.map((entry) => ({
    month: entry.monthIndex,
    label: `M${entry.monthIndex}`,
    alive: entry.stage !== "dead",
    profitability: entry.netProfit,
    runway: entry.runwayMonths,
    revenue: entry.monthlyRevenue,
    cash: entry.cashBalance,
    founderEnergy: entry.founderEnergy,
  }));
}

function mapDecisionLogs(entries: BackendCompanyTimelineEntry[]): MonthlyDecisionLog[] {
  return entries.map((entry) => ({
    month: entry.monthIndex,
    label: `M${entry.monthIndex}`,
    decision: entry.replayLog || `State transition for ${entry.stateLabel}`,
    rationale: entry.judgeSummary || "Replay summary not available.",
    judgeSignal: entry.judgeSummary || "No judge signal available.",
    financeImpact: `Net profit ${entry.netProfit.toFixed(2)} | runway ${entry.runwayMonths.toFixed(1)} mo`,
    marketSignal: `Leads ${entry.leads} | conversion ${entry.conversionRate.toFixed(2)} | churn ${entry.churnRate.toFixed(2)}`,
    tone: entry.stage === "dead" ? "rose" : entry.stateLabel === "Scalable" ? "cyan" : entry.stateLabel === "Sustainable" ? "emerald" : "amber",
  }));
}

function mapKeyEvents(entries: BackendCompanyTimelineEntry[]): MonthlyKeyEvent[] {
  return entries.map((entry) => ({
    month: entry.monthIndex,
    label: `M${entry.monthIndex}`,
    title: entry.keyEvents[0] ?? entry.stateLabel,
    summary: entry.judgeSummary || entry.replayLog || "No event summary available.",
    category: entry.stage,
    tone: entry.stage === "dead" ? "rose" : entry.stateLabel === "Scalable" ? "cyan" : entry.stateLabel === "Sustainable" ? "emerald" : "amber",
  }));
}

function mapStageTimeline(entries: BackendCompanyTimelineEntry[]): StageChange[] {
  const stages: StageChange[] = [];
  let current: StageChange | null = null;

  for (const entry of entries) {
    const outcome = mapOutcomeLabel(entry.stage);
    if (!current || current.stage !== entry.stateLabel) {
      if (current) stages.push(current);
      current = {
        stage: entry.stateLabel,
        startMonth: entry.monthIndex,
        endMonth: entry.monthIndex,
        summary: entry.judgeSummary || entry.replayLog || `${entry.stateLabel} stage`,
        outcome,
        tone: entry.stage === "dead" ? "rose" : entry.stateLabel === "Scalable" ? "cyan" : entry.stateLabel === "Sustainable" ? "emerald" : "amber",
      };
    } else {
      current.endMonth = entry.monthIndex;
    }
  }

  if (current) stages.push(current);
  return stages;
}

export function mapCompanyTimelineToRecord(payload: BackendCompanyTimeline): CompanyTimelineRecord {
  return {
    scenarioId: "",
    simulationId: payload.simulationRunId,
    companyId: payload.companyId,
    timeline: mapTimelinePoints(payload.timeline),
    monthlyLogs: mapDecisionLogs(payload.timeline),
    keyEvents: mapKeyEvents(payload.timeline),
    stageTimeline: mapStageTimeline(payload.timeline),
  };
}

export function mapPlannerToRecord(payload: BackendPlanner): PlannerRecord {
  const stages: PlannerStage[] = payload.stages.map((stage) => ({
    id: stage.id,
    label: stage.stageLabel,
    title: stage.title,
    objective: stage.objective,
    recommendedActions: stage.recommendedActions,
    checkpoints: stage.checkpoints.map((checkpoint): PlannerCheckpoint => ({
      metric: checkpoint.metric,
      currentSignal: checkpoint.currentSignal,
      successThreshold: checkpoint.successThreshold,
      note: checkpoint.note,
      tone: checkpoint.tone as PlannerCheckpoint["tone"],
    })),
    adjustmentAdvice: stage.adjustmentAdvice,
    decision: stage.decision === "go" ? "Go" : stage.decision === "stop" ? "Stop" : "Adjust",
    decisionReason: stage.decisionReason,
    tone: stage.tone as PlannerStage["tone"],
  }));

  const planner: PlannerBlueprint = {
    headline: payload.headline,
    summary: payload.summary,
    primaryBet: payload.primaryBet,
    planningNorthStar: payload.planningNorthStar,
    failurePattern: payload.failurePattern,
    stages,
  };

  return {
    id: `planner-${payload.scenarioId}`,
    scenarioId: payload.scenarioId,
    planner,
  };
}

export function mapCompanyRecordsToReplay(detail: CompanyDetailRecord, timeline: CompanyTimelineRecord): WorldlineReplay {
  return {
    company: {
      ...detail.company,
      timeline: timeline.timeline,
    },
    finalOutcome: detail.finalOutcome,
    finalNarrative: detail.finalNarrative,
    successOrFailureReason: detail.successOrFailureReason,
    judgeSummary: detail.judgeSummary,
    monthlyLogs: timeline.monthlyLogs,
    keyEvents: timeline.keyEvents,
    stageTimeline: timeline.stageTimeline,
  };
}
