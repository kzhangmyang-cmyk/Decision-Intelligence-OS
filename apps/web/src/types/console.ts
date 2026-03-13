export type SignalTone = "default" | "cyan" | "amber" | "emerald" | "rose";

export type ConsoleMetric = {
  label: string;
  value: string;
  caption: string;
  delta?: string;
  tone?: SignalTone;
};

export type IntakeField = {
  label: string;
  value: string;
  detail: string;
};

export type IntakeAttachment = {
  id: string;
  type: string;
  url: string;
  note: string;
};

export type IntakeDraft = {
  projectName: string;
  oneLiner: string;
  targetCustomer: string;
  corePain: string;
  solution: string;
  businessModel: string;
  pricing: string;
  acquisitionChannels: string;
  founderProfile: string;
  teamSize: string;
  budget: string;
  traction: string;
  competitors: string;
  supplementaryEvidence: IntakeAttachment[];
};

export type EvidenceSignal = {
  title: string;
  type: string;
  confidence: string;
  summary: string;
  tone?: SignalTone;
};

export type InsightBlock = {
  title: string;
  body: string;
  tone?: SignalTone;
};

export type ExperimentStep = {
  title: string;
  metric: string;
  threshold: string;
  why?: string;
  expectedLearning?: string;
  priority?: string;
};

export type ReportSummary = {
  viabilityScore: number;
  viabilityLabel: string;
  strategicVerdict: string;
  executiveSummary: string;
  dataSufficiency: number;
  dataSufficiencyLabel: string;
  confidence: number;
  confidenceLabel: string;
};

export type ChartPoint = {
  label: string;
  value: number;
};

export type ScoreBreakdown = {
  label: string;
  score: number;
  confidence: number;
  note: string;
};

export type DecisionPath = {
  label: string;
  title: string;
  description: string;
  condition: string;
  tone?: SignalTone;
};

export type OutcomeFieldPoint = {
  label: string;
  x: number;
  y: number;
  z: number;
  cluster: string;
  tone?: SignalTone;
};

export type FailureMode = {
  label: string;
  value: number;
  detail: string;
  tone?: SignalTone;
};

export type MonthlyPulsePoint = {
  label: string;
  survivors: number;
  revenue: number;
  runway: number;
};

export type ReplayPoint = {
  label: string;
  revenue: number;
  runway: number;
};

export type ReplayEvent = {
  month: string;
  title: string;
  body: string;
  verdict: string;
  tone?: SignalTone;
};

export type HeartbeatLog = {
  month: string;
  founder: string;
  market: string;
  operations: string;
  finance: string;
  judge: string;
  energy: number;
  customers: number;
  cash: number;
  capacity: number;
};

export type SimulatedCompanyCard = {
  id: string;
  name: string;
  archetype: string;
  status: string;
  runway: string;
  headline: string;
  tone?: SignalTone;
};

export type PlannerPhase = {
  label: string;
  title: string;
  focus: string;
  metric: string;
  stopLoss: string;
};

export type PlannerAction = {
  phase: string;
  title: string;
  owner: string;
  measure: string;
};

export type ReplayProfile = {
  id: string;
  company: string;
  archetype: string;
  verdict: string;
  summary: string;
  metrics: ConsoleMetric[];
  trajectory: ReplayPoint[];
  events: ReplayEvent[];
  heartbeats?: HeartbeatLog[];
};
