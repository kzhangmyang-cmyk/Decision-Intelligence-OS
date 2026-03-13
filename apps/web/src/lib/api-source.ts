import { decisionOsApi } from "@/lib/api";
import { mockDecisionOsApi } from "@/lib/mock-api";

const USE_MOCK_API_ENV = "NEXT_PUBLIC_USE_MOCK_API";

export function shouldUseMockApi() {
  return process.env[USE_MOCK_API_ENV] === "true";
}

export function getDecisionOsDataSource() {
  return shouldUseMockApi() ? mockDecisionOsApi : decisionOsApi;
}

export const decisionOsDataSource = getDecisionOsDataSource();
export { USE_MOCK_API_ENV };
