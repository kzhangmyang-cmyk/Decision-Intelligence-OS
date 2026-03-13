import type { IntakeDraft, DecisionPath, ExperimentStep, InsightBlock, ReportSummary, ScoreBreakdown } from "@/types/console";
import type { PlannerBlueprint } from "@/types/planner";
import type {
  ComparisonPoint,
  MonthlyDecisionLog,
  MonthlyKeyEvent,
  StageChange,
  TrendPoint,
  WorldlineCompany,
  WorldlineMonth,
  WorldlineOutcome,
} from "@/types/simulation";

export type JobStatus = "queued" | "running" | "completed" | "failed";

export type ApiEntityMeta = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ScenarioCreateInput = IntakeDraft;

export type ScenarioRecord = ApiEntityMeta & {
  name: string;
  intake: IntakeDraft;
  lifecycle: "draft" | "ready" | "assessing" | "simulating" | "planned";
};

export type AssessmentTriggerInput = {
  force?: boolean;
  modelVersion?: string;
};

export type AssessmentReport = {
  summary: ReportSummary;
  scoreBreakdown: ScoreBreakdown[];
  topRisks: InsightBlock[];
  topLevers: InsightBlock[];
  strategicPaths: DecisionPath[];
  experiments: ExperimentStep[];
};

export type AssessmentRecord = ApiEntityMeta & {
  scenarioId: string;
  status: JobStatus;
  report?: AssessmentReport;
};

export type SimulationTriggerInput = {
  companyCount?: number;
  months?: number;
  seed?: number;
  force?: boolean;
};

export type SimulationOverviewRecord = ApiEntityMeta & {
  scenarioId: string;
  status: JobStatus;
  companyCount: number;
  months: number;
  survivalCurve: TrendPoint[];
  profitabilityCurve: TrendPoint[];
  deathReasons: Array<{ label: string; value: number }>;
  founderPerformance: ComparisonPoint[];
  strategyPerformance: ComparisonPoint[];
  companies: WorldlineCompany[];
};

export type CompanyDetailRecord = {
  scenarioId: string;
  simulationId: string;
  company: WorldlineCompany;
  finalOutcome: WorldlineOutcome;
  finalNarrative: string;
  successOrFailureReason: string;
  judgeSummary: {
    headline: string;
    summary: string;
    primaryCause: string;
    counterfactual: string;
  };
};

export type CompanyTimelineRecord = {
  scenarioId: string;
  simulationId: string;
  companyId: string;
  timeline: WorldlineMonth[];
  monthlyLogs: MonthlyDecisionLog[];
  keyEvents: MonthlyKeyEvent[];
  stageTimeline: StageChange[];
};

export type PlannerRecord = ApiEntityMeta & {
  scenarioId: string;
  planner: PlannerBlueprint;
};

export interface DecisionOsApiContract {
  createScenario(input: ScenarioCreateInput, init?: RequestInit): Promise<ScenarioRecord>;
  getScenario(scenarioId: string, init?: RequestInit): Promise<ScenarioRecord>;
  triggerAssessment(
    scenarioId: string,
    input?: AssessmentTriggerInput,
    init?: RequestInit,
  ): Promise<AssessmentRecord>;
  getAssessment(scenarioId: string, init?: RequestInit): Promise<AssessmentRecord>;
  triggerSimulation(
    scenarioId: string,
    input?: SimulationTriggerInput,
    init?: RequestInit,
  ): Promise<SimulationOverviewRecord>;
  getSimulationOverview(
    scenarioId?: string,
    simulationId?: string,
    init?: RequestInit,
  ): Promise<SimulationOverviewRecord>;
  getCompanyDetail(
    scenarioId: string | undefined,
    companyId: string,
    simulationId?: string,
    init?: RequestInit,
  ): Promise<CompanyDetailRecord>;
  getCompanyTimeline(
    scenarioId: string | undefined,
    companyId: string,
    simulationId?: string,
    init?: RequestInit,
  ): Promise<CompanyTimelineRecord>;
  getPlanner(scenarioId: string, init?: RequestInit): Promise<PlannerRecord>;
}

export type ApiErrorPayload = {
  message: string;
  code?: string;
  details?: unknown;
};
