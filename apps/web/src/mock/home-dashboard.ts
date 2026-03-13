export type SurvivalPoint = {
  month: string;
  survival: number;
};

export type CompanyDistributionPoint = {
  archetype: string;
  wins: number;
};

export type TrajectoryMetric = {
  label: string;
  value: string;
  caption: string;
  delta: string;
};

export type Insight = {
  title: string;
  tag: string;
  body: string;
};

export const survivalCurve: SurvivalPoint[] = [
  { month: "P1", survival: 100 },
  { month: "P2", survival: 95 },
  { month: "P3", survival: 90 },
  { month: "P4", survival: 84 },
  { month: "P5", survival: 77 },
  { month: "P6", survival: 71 },
  { month: "P7", survival: 64 },
  { month: "P8", survival: 58 },
  { month: "P9", survival: 52 },
  { month: "P10", survival: 47 },
  { month: "P11", survival: 41 },
  { month: "P12", survival: 36 },
];

export const companyDistribution: CompanyDistributionPoint[] = [
  { archetype: "Saturnian", wins: 19 },
  { archetype: "Lunar", wins: 16 },
  { archetype: "Martian", wins: 21 },
  { archetype: "Venusian", wins: 18 },
  { archetype: "Mercurial", wins: 26 },
];

export const trajectoryMetrics: TrajectoryMetric[] = [
  {
    label: "Stable paths",
    value: "36 / 100",
    caption: "Worldlines that stay coherent through 12 replay phases",
    delta: "+8 vs single-read baseline",
  },
  {
    label: "Signal confidence",
    value: "0.79",
    caption: "After contradiction mapping and branch replay",
    delta: "+0.11",
  },
  {
    label: "Best path",
    value: "Slow read",
    caption: "Layered interpretation beats impulsive conclusion",
    delta: "top leverage",
  },
];

export const topInsights: Insight[] = [
  {
    title: "The strongest paths appear when symbolic contradictions are mapped before judgment begins.",
    tag: "leverage",
    body: "The best branches do not rush to certainty. They keep multiple tensions visible long enough for the replay to separate noise from pattern.",
  },
  {
    title: "Single-signal overreaction collapses path quality faster than low confidence alone.",
    tag: "risk",
    body: "Most failed worldlines over-privilege one transit, one symbol, or one emotional interpretation before the wider field is compared.",
  },
  {
    title: "Replay discipline matters more than dramatic symbolism.",
    tag: "signal",
    body: "The most stable outcomes come from readers who compare branches, test timing assumptions, and let the judge layer slow the decision down.",
  },
];
