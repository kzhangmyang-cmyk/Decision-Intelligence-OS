import { buildDeathReasonDistribution, buildFounderPerformance, buildProfitabilityCurve, buildStrategyPerformance, buildSurvivalCurve, coreLevers, coreRisks, defaultIntakeDraft, getWorldlineReplay, plannerBlueprint, reportCoverageMatrix, reportDecisionPaths, reportExperiments, reportScoreBreakdown, reportSummary, worldlineCompanies } from "@/mock";
import type { AssessmentRecord, CompanyDetailRecord, CompanyTimelineRecord, DecisionOsApiContract, PlannerRecord, ScenarioCreateInput, ScenarioRecord, SimulationOverviewRecord } from "@/types/api";

const mockScenarioId = "scenario-orion";
const mockSimulationId = "simulation-orion";

function buildScenario(intake: ScenarioCreateInput): ScenarioRecord {
  return {
    id: mockScenarioId,
    name: intake.projectName || "Scenario Orion",
    intake,
    lifecycle: "planned",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function buildAssessmentRecord(scenarioId: string): AssessmentRecord {
  return {
    id: `assessment-${scenarioId}`,
    scenarioId,
    status: "completed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    report: {
      summary: reportSummary,
      scoreBreakdown: reportScoreBreakdown,
      topRisks: coreRisks,
      topLevers: coreLevers,
      strategicPaths: reportDecisionPaths,
      experiments: reportExperiments,
    },
  };
}

function buildSimulationRecord(scenarioId: string): SimulationOverviewRecord {
  return {
    id: mockSimulationId,
    scenarioId,
    status: "completed",
    companyCount: worldlineCompanies.length,
    months: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    survivalCurve: buildSurvivalCurve(worldlineCompanies),
    profitabilityCurve: buildProfitabilityCurve(worldlineCompanies),
    deathReasons: buildDeathReasonDistribution(worldlineCompanies).map(({ label, value }) => ({ label, value })),
    founderPerformance: buildFounderPerformance(worldlineCompanies),
    strategyPerformance: buildStrategyPerformance(worldlineCompanies),
    companies: worldlineCompanies,
  };
}

export function createMockDecisionOsApi(): DecisionOsApiContract {
  return {
    async createScenario(input) {
      return buildScenario(input);
    },

    async getScenario() {
      return buildScenario(defaultIntakeDraft);
    },

    async triggerAssessment(scenarioId) {
      return buildAssessmentRecord(scenarioId);
    },

    async getAssessment(scenarioId) {
      return buildAssessmentRecord(scenarioId);
    },

    async triggerSimulation(scenarioId) {
      return buildSimulationRecord(scenarioId);
    },

    async getSimulationOverview(scenarioId) {
      return buildSimulationRecord(scenarioId ?? mockScenarioId);
    },

    async getCompanyDetail(scenarioId, companyId) {
      const replay = getWorldlineReplay(companyId);

      if (!replay) {
        throw new Error(`Mock company not found: ${companyId}`);
      }

      const payload: CompanyDetailRecord = {
        scenarioId: scenarioId ?? mockScenarioId,
        simulationId: mockSimulationId,
        company: replay.company,
        finalOutcome: replay.finalOutcome,
        finalNarrative: replay.finalNarrative,
        successOrFailureReason: replay.successOrFailureReason,
        judgeSummary: replay.judgeSummary,
      };

      return payload;
    },

    async getCompanyTimeline(scenarioId, companyId) {
      const replay = getWorldlineReplay(companyId);

      if (!replay) {
        throw new Error(`Mock company timeline not found: ${companyId}`);
      }

      const payload: CompanyTimelineRecord = {
        scenarioId: scenarioId ?? mockScenarioId,
        simulationId: mockSimulationId,
        companyId,
        timeline: replay.company.timeline,
        monthlyLogs: replay.monthlyLogs,
        keyEvents: replay.keyEvents,
        stageTimeline: replay.stageTimeline,
      };

      return payload;
    },

    async getPlanner(scenarioId) {
      const payload: PlannerRecord = {
        id: `planner-${scenarioId}`,
        scenarioId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        planner: plannerBlueprint,
      };

      return payload;
    },
  };
}

export const mockDecisionOsApi = createMockDecisionOsApi();

export const mockAssessmentCoverage = reportCoverageMatrix;
