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
  { month: "M1", survival: 100 },
  { month: "M2", survival: 94 },
  { month: "M3", survival: 87 },
  { month: "M4", survival: 82 },
  { month: "M5", survival: 76 },
  { month: "M6", survival: 69 },
  { month: "M7", survival: 61 },
  { month: "M8", survival: 55 },
  { month: "M9", survival: 48 },
  { month: "M10", survival: 42 },
  { month: "M11", survival: 37 },
  { month: "M12", survival: 33 },
];

export const companyDistribution: CompanyDistributionPoint[] = [
  { archetype: "Builder", wins: 17 },
  { archetype: "Seller", wins: 22 },
  { archetype: "Analyst", wins: 14 },
  { archetype: "Operator", wins: 20 },
  { archetype: "Hybrid", wins: 27 },
];

export const trajectoryMetrics: TrajectoryMetric[] = [
  {
    label: "12-mo survivors",
    value: "33 / 100",
    caption: "Companies still alive after 12 heartbeat cycles",
    delta: "+6 vs broad launch",
  },
  {
    label: "Median payback",
    value: "4.5 mo",
    caption: "After pricing and ICP tightening",
    delta: "-1.2 mo",
  },
  {
    label: "Best path",
    value: "Niche wedge",
    caption: "Vertical-first GTM beats broad feature expansion",
    delta: "top leverage",
  },
];

export const topInsights: Insight[] = [
  {
    title: "The best upside appears in a narrow ICP with high pain and low onboarding complexity.",
    tag: "leverage",
    body: "The highest-survival paths do not start broad. They start with a sharper wedge, cleaner pricing, and a lower delivery burden per customer.",
  },
  {
    title: "Feature expansion destroys runway faster than CAC in the first quarter.",
    tag: "risk",
    body: "Most failed runs overbuilt before price clarity. The simulation consistently rewards willingness-to-pay proof before product surface area increases.",
  },
  {
    title: "Founder archetype matters, but heartbeat discipline matters more.",
    tag: "signal",
    body: "Monthly experiment cadence, budget discipline, and controlled scope beat charisma once cash, delivery, and fatigue constraints begin compounding.",
  },
];
