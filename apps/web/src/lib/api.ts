import {
  mapAssessmentToRecord,
  mapCompanyDetailToRecord,
  mapCompanyTimelineToRecord,
  mapPlannerToRecord,
  mapScenarioToRecord,
  mapSimulationOverviewToRecord,
} from "@/lib/api-mappers";
import type {
  ApiErrorPayload,
  AssessmentRecord,
  AssessmentTriggerInput,
  CompanyDetailRecord,
  CompanyTimelineRecord,
  DecisionOsApiContract,
  PlannerRecord,
  ScenarioCreateInput,
  ScenarioRecord,
  SimulationOverviewRecord,
  SimulationTriggerInput,
} from "@/types/api";

const DEFAULT_API_BASE_URL = "http://localhost:8000/api/v1";
const API_BASE_URL_ENV = "NEXT_PUBLIC_API_BASE_URL";

type QueryValue = string | number | boolean | null | undefined;

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  query?: Record<string, QueryValue>;
};

export class ApiClientError extends Error {
  status: number;
  payload?: ApiErrorPayload | unknown;

  constructor(message: string, status: number, payload?: ApiErrorPayload | unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.payload = payload;
  }
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getApiBaseUrl() {
  const configured = process.env[API_BASE_URL_ENV];
  return trimTrailingSlash(configured || DEFAULT_API_BASE_URL);
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${getApiBaseUrl()}${normalizedPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const detailMessage =
      typeof payload === "object" && payload && "detail" in payload ? String((payload as { detail: unknown }).detail) : undefined;
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as ApiErrorPayload).message)
        : detailMessage || response.statusText || "API request failed";

    throw new ApiClientError(message, response.status, payload);
  }

  return payload as T;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, query, ...init } = options;
  const finalHeaders = new Headers(headers);
  let finalBody: BodyInit | undefined;

  if (body !== undefined && body !== null) {
    finalHeaders.set("Content-Type", "application/json");
    finalBody = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: finalHeaders,
    body: finalBody,
    cache: init.cache ?? "no-store",
  });

  return parseResponse<T>(response);
}

function ensureSimulationId(simulationId?: string) {
  if (!simulationId) {
    throw new ApiClientError("simulationId is required for this request.", 400);
  }
  return simulationId;
}

export function createDecisionOsApi(): DecisionOsApiContract {
  return {
    async createScenario(input, init) {
      const payload = await apiRequest<any>("/scenarios", {
        method: "POST",
        body: {
          oneLinePitch: input.oneLiner,
          structuredInputs: input,
        },
        ...init,
      });
      return mapScenarioToRecord(payload);
    },

    async getScenario(scenarioId, init) {
      const payload = await apiRequest<any>(`/scenarios/${scenarioId}`, {
        method: "GET",
        ...init,
      });
      return mapScenarioToRecord(payload);
    },

    async triggerAssessment(scenarioId, _input, init) {
      const payload = await apiRequest<any>(`/scenarios/${scenarioId}/assess`, {
        method: "POST",
        ...init,
      });
      return mapAssessmentToRecord(payload);
    },

    async getAssessment(scenarioId, init) {
      const payload = await apiRequest<any>(`/scenarios/${scenarioId}/assessment`, {
        method: "GET",
        ...init,
      });
      return mapAssessmentToRecord(payload);
    },

    async triggerSimulation(scenarioId, input, init) {
      const payload = await apiRequest<any>(`/scenarios/${scenarioId}/simulate`, {
        method: "POST",
        body: {
          companyCount: input?.companyCount ?? 100,
          durationMonths: input?.months ?? 12,
        },
        ...init,
      });
      return mapSimulationOverviewToRecord(payload);
    },

    async getSimulationOverview(_scenarioId, simulationId, init) {
      const payload = await apiRequest<any>(`/simulations/${ensureSimulationId(simulationId)}`, {
        method: "GET",
        ...init,
      });
      return mapSimulationOverviewToRecord(payload);
    },

    async getCompanyDetail(_scenarioId, companyId, _simulationId, init) {
      const payload = await apiRequest<any>(`/companies/${companyId}`, {
        method: "GET",
        ...init,
      });
      return mapCompanyDetailToRecord(payload);
    },

    async getCompanyTimeline(_scenarioId, companyId, _simulationId, init) {
      const payload = await apiRequest<any>(`/companies/${companyId}/timeline`, {
        method: "GET",
        ...init,
      });
      return mapCompanyTimelineToRecord(payload);
    },

    async getPlanner(scenarioId, init) {
      const payload = await apiRequest<any>(`/scenarios/${scenarioId}/planner`, {
        method: "GET",
        ...init,
      });
      return mapPlannerToRecord(payload);
    },
  };
}

export const decisionOsApi = createDecisionOsApi();
export { API_BASE_URL_ENV, DEFAULT_API_BASE_URL };
