import type {
  ComparisonPoint,
  DeathReason,
  DistributionPoint,
  FounderType,
  SimulationFilters,
  SimulationStatus,
  StrategyType,
  TrendPoint,
  WorldlineCompany,
  WorldlineMonth,
} from "@/types/simulation";

const founderProfiles: Record<FounderType, { survivalBias: number; profitBias: number }> = {
  Hybrid: { survivalBias: 12, profitBias: 8 },
  Operator: { survivalBias: 6, profitBias: 4 },
  Builder: { survivalBias: -10, profitBias: -7 },
  Seller: { survivalBias: 3, profitBias: 6 },
  Analyst: { survivalBias: 0, profitBias: 2 },
};

const strategyProfiles: Record<StrategyType, { survivalBias: number; profitBias: number }> = {
  "Niche-first": { survivalBias: 12, profitBias: 9 },
  "Service-led": { survivalBias: 4, profitBias: 2 },
  PLG: { survivalBias: -2, profitBias: 5 },
  "Community-led": { survivalBias: 2, profitBias: 4 },
  Horizontal: { survivalBias: -12, profitBias: -8 },
};

const founderTypes = Object.keys(founderProfiles) as FounderType[];
const strategyTypes = Object.keys(strategyProfiles) as StrategyType[];
const statuses: SimulationStatus[] = ["breakout", "survived", "stalled", "failed"];

const worldlineNames = [
  "Atlas",
  "Vector",
  "Signal",
  "Nova",
  "Helix",
  "Prism",
  "Axiom",
  "Quanta",
  "Drift",
  "Relay",
  "Aegis",
  "Pulse",
  "Orbit",
  "Cinder",
  "Lattice",
  "Shift",
  "Thesis",
  "Anchor",
  "Tangent",
  "Forge",
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, digits = 1) {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
}

function toneFromStatus(status: SimulationStatus): WorldlineCompany["tone"] {
  switch (status) {
    case "breakout":
      return "cyan";
    case "survived":
      return "emerald";
    case "stalled":
      return "amber";
    case "failed":
      return "rose";
  }
}

function buildManualTimeline(
  runway: number[],
  profitability: number[],
  revenue: number[],
  cash?: number[],
  founderEnergy?: number[],
): WorldlineMonth[] {
  return Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    label: `M${index + 1}`,
    alive: runway[index] > 0 || index === 0,
    profitability: profitability[index],
    runway: runway[index],
    revenue: revenue[index],
    cash: cash?.[index] ?? round(Math.max(0, runway[index] * 12 + revenue[index] * 1.4), 1),
    founderEnergy: founderEnergy?.[index] ?? clamp(72 - index * 3 + (profitability[index] > 0 ? 8 : -4), 8, 96),
  }));
}

function chooseDeathReason(founderType: FounderType, strategyType: StrategyType, index: number): DeathReason {
  if (strategyType === "Horizontal" || founderType === "Builder") {
    return "Overbuild";
  }

  if (strategyType === "PLG") {
    return "Acquisition drag";
  }

  if (founderType === "Analyst") {
    return "No pricing proof";
  }

  if (index % 3 === 0) {
    return "Founder fatigue";
  }

  return "Runway exhaustion";
}

function generateTimeline(index: number, status: SimulationStatus, outcomeScore: number, founderType: FounderType, strategyType: StrategyType, monthsAlive: number) {
  const founderBias = founderProfiles[founderType];
  const strategyBias = strategyProfiles[strategyType];
  const startingRunway = clamp(5.5 + (founderBias.survivalBias + strategyBias.survivalBias) / 10 + (index % 4) * 0.4, 3.4, 8.8);
  const marginStart = -34 + founderBias.profitBias + strategyBias.profitBias + ((index * 11) % 7) - 3;
  const marginSlope = 3.2 + (outcomeScore - 52) / 24;
  const revenueBase = 3 + founderBias.profitBias * 0.55 + strategyBias.profitBias * 0.45;

  return Array.from({ length: 12 }, (_, monthIndex) => {
    const month = monthIndex + 1;
    const alive = status !== "failed" || month <= monthsAlive;
    let profitability = alive
      ? clamp(marginStart + marginSlope * month + (((index + month * 3) % 5) - 2), -45, 34)
      : -50;

    if (status === "stalled") {
      profitability = Math.min(profitability, 8 + ((month + index) % 4));
    }

    if (status === "breakout") {
      profitability = Math.max(profitability, 6 + month * 1.6);
    }

    if (status === "failed" && month === monthsAlive) {
      profitability = -46;
    }

    const revenue = alive
      ? round(
          Math.max(
            0,
            revenueBase + month * (status === "breakout" ? 2.4 : status === "survived" ? 1.7 : 1.0) + ((index + month) % 4),
          ),
          1,
        )
      : 0;

    let runway = alive
      ? clamp(
          startingRunway + month * (profitability > 0 ? 0.16 : -0.28) + outcomeScore / 100 + ((index + month) % 3) * 0.06,
          0,
          12,
        )
      : 0;

    if (status === "failed" && month >= monthsAlive) {
      runway = month === monthsAlive ? 0.2 : 0;
    }

    const founderEnergy = alive
      ? clamp(
          78 + founderBias.survivalBias * 0.5 - month * (status === "breakout" ? 2.2 : status === "survived" ? 2.8 : 3.6) + (profitability > 0 ? 5 : -3),
          6,
          96,
        )
      : 0;

    const cash = alive ? round(Math.max(0, runway * 12.5 + revenue * 1.8), 1) : 0;

    return {
      month,
      label: `M${month}`,
      alive,
      profitability: round(profitability, 1),
      runway: round(runway, 1),
      revenue,
      cash,
      founderEnergy: round(founderEnergy, 1),
    };
  });
}

function generateCompany(index: number): WorldlineCompany {
  const founderType = founderTypes[index % founderTypes.length];
  const strategyType = strategyTypes[(Math.floor(index / founderTypes.length) + index) % strategyTypes.length];
  const founderBias = founderProfiles[founderType];
  const strategyBias = strategyProfiles[strategyType];
  const noise = ((index * 7) % 19) - 9;
  const outcomeScore = clamp(57 + founderBias.survivalBias + strategyBias.survivalBias + noise, 24, 96);

  let status: SimulationStatus;

  if (outcomeScore >= 86) {
    status = "breakout";
  } else if (outcomeScore >= 70) {
    status = "survived";
  } else if (outcomeScore >= 56) {
    status = "stalled";
  } else {
    status = "failed";
  }

  const monthsAlive = status === "failed" ? 4 + ((index * 3) % 6) : 12;
  const timeline = generateTimeline(index, status, outcomeScore, founderType, strategyType, monthsAlive);
  const finalMonth = timeline[timeline.length - 1];
  const deathReason = status === "failed" ? chooseDeathReason(founderType, strategyType, index) : undefined;

  return {
    id: `company-${String(index + 4).padStart(3, "0")}`,
    name: `${worldlineNames[index % worldlineNames.length]}-${String(index + 4).padStart(3, "0")}`,
    founderType,
    strategyType,
    status,
    outcomeScore,
    monthsAlive,
    month12Runway: finalMonth.runway,
    month12Profitability: finalMonth.profitability,
    month12Revenue: finalMonth.revenue,
    deathReason,
    tone: toneFromStatus(status),
    replayHref: `/simulation/company-${String(index + 4).padStart(3, "0")}`,
    timeline,
  };
}

const manualCompanies: WorldlineCompany[] = [
  {
    id: "company-alpha",
    name: "Company Alpha",
    founderType: "Hybrid",
    strategyType: "Niche-first",
    status: "survived",
    outcomeScore: 88,
    monthsAlive: 12,
    month12Runway: 9.2,
    month12Profitability: 27,
    month12Revenue: 15,
    tone: "emerald",
    replayHref: "/simulation/company-alpha",
    timeline: buildManualTimeline(
      [6.2, 6.5, 7.1, 7.4, 7.7, 8.1, 8.5, 8.8, 9.0, 9.1, 9.2, 9.2],
      [-18, -12, -6, -2, 4, 8, 12, 16, 19, 23, 25, 27],
      [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 15],
      [74, 77, 82, 86, 93, 97, 101, 106, 110, 113, 115, 118],
      [82, 79, 77, 74, 72, 70, 69, 67, 66, 64, 63, 62],
    ),
  },
  {
    id: "company-sigma",
    name: "Company Sigma",
    founderType: "Operator",
    strategyType: "Service-led",
    status: "stalled",
    outcomeScore: 61,
    monthsAlive: 12,
    month12Runway: 4.1,
    month12Profitability: 5,
    month12Revenue: 6,
    tone: "amber",
    replayHref: "/simulation/company-sigma",
    timeline: buildManualTimeline(
      [5.8, 5.7, 5.3, 5.0, 4.8, 4.7, 4.5, 4.4, 4.3, 4.2, 4.1, 4.1],
      [-21, -17, -12, -9, -6, -4, -2, 1, 3, 4, 5, 5],
      [1, 2, 3, 4, 4, 5, 5, 5, 6, 6, 6, 6],
      [70, 69, 66, 64, 61, 59, 57, 56, 55, 53, 52, 51],
      [78, 75, 71, 67, 61, 57, 53, 48, 44, 41, 39, 38],
    ),
  },
  {
    id: "company-nova",
    name: "Company Nova",
    founderType: "Builder",
    strategyType: "Horizontal",
    status: "failed",
    outcomeScore: 33,
    monthsAlive: 5,
    month12Runway: 0,
    month12Profitability: -50,
    month12Revenue: 0,
    deathReason: "Overbuild",
    tone: "rose",
    replayHref: "/simulation/company-nova",
    timeline: buildManualTimeline(
      [6.0, 5.1, 4.0, 2.8, 0.6, 0, 0, 0, 0, 0, 0, 0],
      [-28, -31, -35, -39, -46, -50, -50, -50, -50, -50, -50, -50],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [72, 61, 48, 34, 7, 0, 0, 0, 0, 0, 0, 0],
      [76, 69, 60, 48, 28, 0, 0, 0, 0, 0, 0, 0],
    ),
  },
];

export const worldlineCompanies: WorldlineCompany[] = [
  ...manualCompanies,
  ...Array.from({ length: 97 }, (_, index) => generateCompany(index)),
];

export const simulationFounderOptions: Array<FounderType | "all"> = ["all", ...founderTypes];
export const simulationStrategyOptions: Array<StrategyType | "all"> = ["all", ...strategyTypes];
export const simulationStatusOptions: Array<SimulationStatus | "all"> = ["all", ...statuses];

export function filterWorldlines(companies: WorldlineCompany[], filters: SimulationFilters) {
  return companies.filter((company) => {
    const founderMatch = filters.founderType === "all" || company.founderType === filters.founderType;
    const statusMatch = filters.status === "all" || company.status === filters.status;
    const strategyMatch = filters.strategyType === "all" || company.strategyType === filters.strategyType;

    return founderMatch && statusMatch && strategyMatch;
  });
}

export function buildSurvivalCurve(companies: WorldlineCompany[]): TrendPoint[] {
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

export function buildProfitabilityCurve(companies: WorldlineCompany[]): TrendPoint[] {
  return Array.from({ length: 12 }, (_, index) => {
    const alivePoints = companies
      .map((company) => company.timeline[index])
      .filter((point): point is WorldlineMonth => Boolean(point && point.alive));

    const average = alivePoints.length === 0 ? 0 : alivePoints.reduce((total, point) => total + point.profitability, 0) / alivePoints.length;

    return {
      label: `M${index + 1}`,
      value: round(average, 1),
    };
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
