import type { SignalTone } from "@/types/console";

export type FounderType = string;

export type StrategyType = string;

export type SimulationStatus = "breakout" | "survived" | "stalled" | "failed";

export type DeathReason = string;

export type WorldlineMonth = {
  month: number;
  label: string;
  alive: boolean;
  profitability: number;
  runway: number;
  revenue: number;
  cash: number;
  founderEnergy: number;
};

export type WorldlineOutcome = "Explore" | "Survive" | "Sustainable" | "Scalable" | "Dead";

export type WorldlineCompany = {
  id: string;
  name: string;
  founderType: FounderType;
  strategyType: StrategyType;
  status: SimulationStatus;
  outcomeScore: number;
  monthsAlive: number;
  month12Runway: number;
  month12Profitability: number;
  month12Revenue: number;
  deathReason?: DeathReason;
  tone: SignalTone;
  replayHref?: string;
  timeline: WorldlineMonth[];
};

export type TrendPoint = {
  label: string;
  value: number;
};

export type DistributionPoint = {
  label: string;
  value: number;
  tone?: SignalTone;
};

export type ComparisonPoint = {
  label: string;
  outcomeScore: number;
  survivalRate: number;
  count: number;
};

export type SimulationFilters = {
  founderType: FounderType | "all";
  status: SimulationStatus | "all";
  strategyType: StrategyType | "all";
};

export type MonthlyDecisionLog = {
  month: number;
  label: string;
  decision: string;
  rationale: string;
  judgeSignal: string;
  financeImpact: string;
  marketSignal: string;
  tone?: SignalTone;
};

export type MonthlyKeyEvent = {
  month: number;
  label: string;
  title: string;
  summary: string;
  category: string;
  tone?: SignalTone;
};

export type StageChange = {
  stage: string;
  startMonth: number;
  endMonth: number;
  summary: string;
  outcome: WorldlineOutcome;
  tone?: SignalTone;
};

export type JudgeCausalSummary = {
  headline: string;
  summary: string;
  primaryCause: string;
  counterfactual: string;
};

export type WorldlineReplay = {
  company: WorldlineCompany;
  finalOutcome: WorldlineOutcome;
  finalNarrative: string;
  successOrFailureReason: string;
  judgeSummary: JudgeCausalSummary;
  monthlyLogs: MonthlyDecisionLog[];
  keyEvents: MonthlyKeyEvent[];
  stageTimeline: StageChange[];
};
