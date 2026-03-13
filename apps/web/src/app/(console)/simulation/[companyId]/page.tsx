import { notFound } from "next/navigation";

import { CompanyReplayContent } from "@/components/simulation/company-replay-content";
import { ApiClientError } from "@/lib/api";
import { decisionOsDataSource } from "@/lib/api-source";
import { mapCompanyRecordsToReplay } from "@/lib/api-mappers";
import { getWorldlineReplay, getWorldlineReplayIds } from "@/mock";

type CompanyReplayPageProps = {
  params: { companyId: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

function getParam(searchParams: Record<string, string | string[] | undefined> | undefined, key: string) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] : value;
}

export function generateStaticParams() {
  return getWorldlineReplayIds().map((companyId) => ({ companyId }));
}

export default async function CompanyReplayPage({ params, searchParams }: CompanyReplayPageProps) {
  const scenarioId = getParam(searchParams, "scenarioId");

  if (!scenarioId) {
    const replay = getWorldlineReplay(params.companyId);
    if (!replay) notFound();
    return <CompanyReplayContent replay={replay} />;
  }

  try {
    const [detail, timeline] = await Promise.all([
      decisionOsDataSource.getCompanyDetail(scenarioId, params.companyId),
      decisionOsDataSource.getCompanyTimeline(scenarioId, params.companyId),
    ]);

    return <CompanyReplayContent replay={mapCompanyRecordsToReplay(detail, timeline)} />;
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
