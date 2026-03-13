import { SimulationOverviewContent } from "@/components/simulation/simulation-overview-content";
import { decisionOsDataSource } from "@/lib/api-source";

type SimulationPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function getParam(searchParams: Record<string, string | string[] | undefined> | undefined, key: string) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function SimulationPage({ searchParams }: SimulationPageProps) {
  const scenarioId = getParam(searchParams, "scenarioId");
  const simulationId = getParam(searchParams, "simulationId");

  const data = scenarioId
    ? simulationId
      ? await decisionOsDataSource.getSimulationOverview(scenarioId, simulationId)
      : await decisionOsDataSource.triggerSimulation(scenarioId, { companyCount: 100, months: 12 })
    : undefined;

  return <SimulationOverviewContent data={data} scenarioId={scenarioId} />;
}
