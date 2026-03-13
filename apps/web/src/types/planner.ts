import type { SignalTone } from "@/types/console";

export type PlannerDecision = "Go" | "Adjust" | "Stop";

export type PlannerCheckpoint = {
  metric: string;
  currentSignal: string;
  successThreshold: string;
  note: string;
  tone?: SignalTone;
};

export type PlannerStage = {
  id: string;
  label: string;
  title: string;
  objective: string;
  recommendedActions: string[];
  checkpoints: PlannerCheckpoint[];
  adjustmentAdvice: string;
  decision: PlannerDecision;
  decisionReason: string;
  tone?: SignalTone;
};

export type PlannerBlueprint = {
  headline: string;
  summary: string;
  primaryBet: string;
  planningNorthStar: string;
  failurePattern: string;
  stages: PlannerStage[];
};
