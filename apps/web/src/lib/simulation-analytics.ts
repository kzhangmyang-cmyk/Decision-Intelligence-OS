import type {
  ComparisonPoint,
  DistributionPoint,
  SimulationFilters,
  WorldlineCompany,
  WorldlineMonth,
} from "@/types/simulation";

function round(value: number, digits = 1) {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
}

export function filterWorldlines(companies: WorldlineCompany[], filters: SimulationFilters) {
  return companies.filter((company) => {
    const founderMatch = filters.founderType === "all" || company.founderType === filters.founderType;
    const statusMatch = filters.status === "all" || company.status === filters.status;
    const strategyMatch = filters.strategyType === "all" || company.strategyType === filters.strategyType;

    return founderMatch && statusMatch && strategyMatch;
  });
}

export function buildDeathReasonDistribution(companies: WorldlineCompany[]): DistributionPoint[] {
  const failed = companies.filter((company) => company.status === "failed" && company.deathReason);
  const grouped = failed.reduce<Record<string, number>>((accumulator, company) => {
    const reason = company.deathReason as string;
    accumulator[reason] = (accumulator[reason] ?? 0) + 1;
    return accumulator;
  }, {});

  const toneMap: Record<string, DistributionPoint["tone"]> = {
    Overbuild: "rose",
    "No pricing proof": "amber",
    "Acquisition drag": "amber",
    "Founder fatigue": "rose",
    "Runway exhaustion": "rose",
  };

  return Object.entries(grouped)
    .map(([label, value]) => ({ label, value, tone: toneMap[label] ?? "rose" }))
    .sort((a, b) => b.value - a.value);
}

function buildComparison(companies: WorldlineCompany[], groupKey: "founderType" | "strategyType"): ComparisonPoint[] {
  const grouped = companies.reduce<Record<string, WorldlineCompany[]>>((accumulator, company) => {
    const key = company[groupKey];
    accumulator[key] = [...(accumulator[key] ?? []), company];
    return accumulator;
  }, {});

  return Object.entries(grouped)
    .map(([label, items]) => ({
      label,
      outcomeScore: round(items.reduce((total, item) => total + item.outcomeScore, 0) / items.length, 1),
      survivalRate: round((items.filter((item) => item.status !== "failed").length / items.length) * 100, 1),
      count: items.length,
    }))
    .sort((a, b) => b.outcomeScore - a.outcomeScore);
}

export function buildFounderPerformance(companies: WorldlineCompany[]) {
  return buildComparison(companies, "founderType");
}

export function buildStrategyPerformance(companies: WorldlineCompany[]) {
  return buildComparison(companies, "strategyType");
}

export function buildSimulationSnapshot(companies: WorldlineCompany[]) {
  const survivors = companies.filter((company) => company.status === "survived" || company.status === "breakout").length;
  const breakouts = companies.filter((company) => company.status === "breakout").length;
  const failed = companies.filter((company) => company.status === "failed").length;
  const averageProfitability =
    companies.length === 0
      ? 0
      : round(companies.reduce((total, company) => total + company.month12Profitability, 0) / companies.length, 1);

  return {
    total: companies.length,
    survivors,
    breakouts,
    failed,
    averageProfitability,
  };
}

export function buildSurvivalCurve(companies: WorldlineCompany[]) {
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const aliveCount = companies.filter((company) => company.timeline[index]?.alive).length;
    const base = companies.length === 0 ? 0 : (aliveCount / companies.length) * 100;

    return {
      label: `M${month}`,
      value: round(base, 1),
    };
  });
}

export function buildProfitabilityCurve(companies: WorldlineCompany[]) {
  return Array.from({ length: 12 }, (_, index) => {
    const alivePoints = companies
      .map((company) => company.timeline[index])
      .filter((point): point is WorldlineMonth => Boolean(point && point.alive));

    const average =
      alivePoints.length === 0 ? 0 : alivePoints.reduce((total, point) => total + point.profitability, 0) / alivePoints.length;

    return {
      label: `M${index + 1}`,
      value: round(average, 1),
    };
  });
}
