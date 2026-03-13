import type {
  ChartPoint,
  ConsoleMetric,
  DecisionPath,
  EvidenceSignal,
  ExperimentStep,
  FailureMode,
  HeartbeatLog,
  IntakeDraft,
  InsightBlock,
  IntakeField,
  MonthlyPulsePoint,
  OutcomeFieldPoint,
  PlannerAction,
  PlannerPhase,
  ReplayProfile,
  ReportSummary,
  ScoreBreakdown,
  SimulatedCompanyCard,
} from "@/types/console";

export const currentProject = {
  name: "Project Orion",
  mode: "Decision sprint",
  signal: "74% confidence",
  status: "dataset synced 12m ago",
};

const alphaScripts = [
  {
    founder: "Narrows ICP to compliance-heavy AI teams and rejects broader discovery requests.",
    market: "Early interviews show stronger urgency where bad decisions carry regulatory cost.",
    operations: "Keeps delivery manual but templated around a single report flow.",
    finance: "Burn stays controlled because build scope is still deliberately narrow.",
    judge: "Focus improves odds; maintain the niche-first strategy.",
  },
  {
    founder: "Runs structured pricing calls instead of adding more features.",
    market: "Buyers respond better to risk reduction framing than productivity messaging.",
    operations: "Delivery cadence holds with repeatable evidence intake steps.",
    finance: "Cash decay slows as pilot commitments begin appearing.",
    judge: "Signal quality is rising faster than burn.",
  },
  {
    founder: "Sells a manual decision brief before automating the workflow.",
    market: "First paid pilots validate the wedge and message pairing.",
    operations: "Creates a repeatable template for evidence review and scoring.",
    finance: "Revenue starts offsetting burn without new hiring.",
    judge: "Report-first motion is the right bridge to software.",
  },
  {
    founder: "Declines requests for broad SMB customization.",
    market: "Niche resonance continues strengthening conversion quality.",
    operations: "Service complexity remains bounded because scope stays opinionated.",
    finance: "Runway expands as pricing becomes more confident.",
    judge: "Good rejection discipline preserves strategic integrity.",
  },
  {
    founder: "Invests only in automation for repeated evidence parsing tasks.",
    market: "Customers value faster turnarounds as much as deeper dashboards.",
    operations: "Automation lowers handling time on the most common report steps.",
    finance: "Margin improves while revenue continues climbing.",
    judge: "Selective productization compounds efficiently.",
  },
  {
    founder: "Keeps the roadmap constrained to one decision workflow.",
    market: "Referral quality improves because positioning is easy to repeat.",
    operations: "Ops load increases but remains manageable within founder capacity.",
    finance: "Runway reaches its first clear recovery point.",
    judge: "Constraint management remains healthy.",
  },
  {
    founder: "Introduces a clearer premium tier tied to strategic depth.",
    market: "Higher-value teams accept pricing where ROI language is explicit.",
    operations: "Templates segment by maturity level without creating bespoke work.",
    finance: "Average revenue per customer improves.",
    judge: "Pricing leverage is now visible.",
  },
  {
    founder: "Maintains a short feedback loop from every delivered report.",
    market: "Retention signal improves because outputs remain actionable.",
    operations: "Repeatable feedback tags refine the scoring engine.",
    finance: "Cash position remains stable through disciplined iteration.",
    judge: "Learning velocity stays high.",
  },
  {
    founder: "Resists broad platform ambitions despite inbound requests.",
    market: "The niche shows enough depth to continue without horizontal expansion.",
    operations: "The system starts behaving more like software than consulting.",
    finance: "Runway reaches the top decile of simulated peers.",
    judge: "Stay concentrated; do not widen the wedge yet.",
  },
  {
    founder: "Codifies decision report output into a reusable operating loop.",
    market: "Customer outcomes become easier to reference in new conversations.",
    operations: "Delivery time falls again as templates harden.",
    finance: "Margins strengthen enough to consider the next growth move.",
    judge: "System quality is compounding.",
  },
  {
    founder: "Evaluates expansion options but keeps scope constrained.",
    market: "Adjacent demand exists, yet current segment still shows best efficiency.",
    operations: "No operational shock appears from staying narrow.",
    finance: "Cash and demand remain aligned.",
    judge: "Expand only after another cycle of proof.",
  },
  {
    founder: "Closes the year with a defensible niche and repeatable playbook.",
    market: "The company now owns a clear narrative for buyers in this segment.",
    operations: "Core flow is repeatable, auditable, and founder-light.",
    finance: "Runway and revenue both finish strong.",
    judge: "Viable with focused expansion options next.",
  },
] as const;

const sigmaScripts = [
  {
    founder: "Locks onto a promising niche but keeps service promises too open-ended.",
    market: "Initial interviews convert because the pain is real.",
    operations: "Delivery work begins with a high manual burden.",
    finance: "Cash burn is acceptable but not yet offset by pricing.",
    judge: "Demand exists; operating design is the problem.",
  },
  {
    founder: "Wins pilots quickly through founder-led selling.",
    market: "Customers care more about the outcome than the interface.",
    operations: "Every customer asks for slightly different framing and output.",
    finance: "Revenue appears, but margins are still thin.",
    judge: "Promising signal, weak standardization.",
  },
  {
    founder: "Adds more delivery promise than the system can absorb.",
    market: "Expansion in use cases creates mixed feedback loops.",
    operations: "Custom work begins to outpace reusable flow creation.",
    finance: "Cash burn stabilizes only because growth is modest.",
    judge: "Scope must narrow or service drag will dominate.",
  },
  {
    founder: "Attempts to scale through process, not product yet.",
    market: "Demand stays alive, but references are inconsistent.",
    operations: "Ops load rises because internal templates diverge by customer type.",
    finance: "Gross margin improvement stalls.",
    judge: "The business is useful, but not compounding.",
  },
  {
    founder: "Keeps taking custom opportunities to avoid revenue dips.",
    market: "Near-term wins mask long-term positioning blur.",
    operations: "Delivery becomes founder-heavy and hard to delegate.",
    finance: "Runway shortens despite top-line stability.",
    judge: "Short-term optimization is hurting scale quality.",
  },
  {
    founder: "Tests automation, but does so across too many workflow variants.",
    market: "Customers still buy, but the product narrative weakens.",
    operations: "Automation reduces little because variability remains too high.",
    finance: "Tooling effort adds cost without enough lift.",
    judge: "Standardize first, automate second.",
  },
  {
    founder: "Cuts some custom branches and recovers partial control.",
    market: "Retention remains decent among the best-fit accounts.",
    operations: "A few flows start becoming reusable.",
    finance: "Runway stabilizes but does not recover materially.",
    judge: "Stabilized, not solved.",
  },
  {
    founder: "Focuses on high-fit accounts while pruning edge cases.",
    market: "Quality improves, but volume remains capped.",
    operations: "Ops complexity drops slightly though the system remains service-heavy.",
    finance: "No breakout efficiency appears.",
    judge: "Better business, still not scalable enough.",
  },
  {
    founder: "Attempts a broader automation layer to unlock growth.",
    market: "The market signal is still there, but clarity blurs again.",
    operations: "Feature work grows faster than standardization benefits.",
    finance: "Burn ticks up without corresponding margin gains.",
    judge: "Execution drag is returning.",
  },
  {
    founder: "Refocuses after the failed expansion attempt.",
    market: "Best-fit buyers remain, but growth is slow and uneven.",
    operations: "The system can serve a few accounts well, not many.",
    finance: "Runway flattens at a mediocre level.",
    judge: "Useful niche business, limited compounding.",
  },
  {
    founder: "Keeps the business alive through disciplined manual work.",
    market: "Demand signal persists without strengthening.",
    operations: "Founders are still too deep in delivery.",
    finance: "Economics remain workable but uninspiring.",
    judge: "Stalled line with optional redesign path.",
  },
  {
    founder: "Ends the year with proof of demand but no true escape velocity.",
    market: "Customers value the service, not yet a scalable system.",
    operations: "The business needs a stricter product boundary.",
    finance: "Runway survives, growth does not.",
    judge: "Simplify delivery before further expansion.",
  },
] as const;

const novaScripts = [
  {
    founder: "Starts building a broad platform before choosing a narrow wedge.",
    market: "Interview feedback stays vague because the problem framing is too wide.",
    operations: "No reusable delivery loop exists yet; work starts with product architecture.",
    finance: "Burn begins immediately with little learning return.",
    judge: "Scope is too broad for the current resource envelope.",
  },
  {
    founder: "Adds features in response to imagined market needs.",
    market: "Prospects show curiosity but no purchase urgency.",
    operations: "Team capacity disappears into build complexity.",
    finance: "Cash drops faster than evidence quality rises.",
    judge: "Proof remains insufficient.",
  },
  {
    founder: "Launches without a disciplined pricing experiment.",
    market: "Traffic appears, but conversion is weak and noisy.",
    operations: "Support load rises despite low revenue.",
    finance: "Runway compression becomes visible.",
    judge: "The system is shipping motion, not validated learning.",
  },
  {
    founder: "Keeps adding breadth to fix weak traction.",
    market: "Messaging drifts further from any single buyer profile.",
    operations: "Ops can no longer keep pace with product complexity.",
    finance: "Burn accelerates as the team chases breadth.",
    judge: "The strategy is compounding in the wrong direction.",
  },
  {
    founder: "Makes a late attempt to narrow positioning.",
    market: "The market never receives a clear enough promise in time.",
    operations: "Internal complexity blocks fast correction.",
    finance: "Remaining cash is no longer enough for a proper pivot cycle.",
    judge: "Non-viable under current constraints.",
  },
  {
    founder: "Stops major build work after runway failure.",
    market: "Residual interest cannot convert without a stronger wedge.",
    operations: "The system is overbuilt relative to demand.",
    finance: "Runway has effectively ended.",
    judge: "Terminated due to mismatch between build scope and learning speed.",
  },
  {
    founder: "Explores salvage options, but capital is gone.",
    market: "No clear segment shows enough pull to restart.",
    operations: "The operational surface is too large to maintain.",
    finance: "No meaningful recovery path remains.",
    judge: "Simulation remains dead.",
  },
  {
    founder: "No further strategic progress occurs.",
    market: "Signal remains too weak to justify renewed burn.",
    operations: "System remains inactive.",
    finance: "Capital constraint dominates all options.",
    judge: "Inactive line.",
  },
  {
    founder: "No further strategic progress occurs.",
    market: "Signal remains too weak to justify renewed burn.",
    operations: "System remains inactive.",
    finance: "Capital constraint dominates all options.",
    judge: "Inactive line.",
  },
  {
    founder: "No further strategic progress occurs.",
    market: "Signal remains too weak to justify renewed burn.",
    operations: "System remains inactive.",
    finance: "Capital constraint dominates all options.",
    judge: "Inactive line.",
  },
  {
    founder: "No further strategic progress occurs.",
    market: "Signal remains too weak to justify renewed burn.",
    operations: "System remains inactive.",
    finance: "Capital constraint dominates all options.",
    judge: "Inactive line.",
  },
  {
    founder: "No further strategic progress occurs.",
    market: "Signal remains too weak to justify renewed burn.",
    operations: "System remains inactive.",
    finance: "Capital constraint dominates all options.",
    judge: "Inactive line.",
  },
] as const;

function buildHeartbeats(
  trajectory: ReplayProfile["trajectory"],
  scripts: readonly {
    founder: string;
    market: string;
    operations: string;
    finance: string;
    judge: string;
  }[],
  energySeries: number[],
  customerSeries: number[],
  cashSeries: number[],
): HeartbeatLog[] {
  return trajectory.map((point, index) => ({
    month: point.label,
    founder: scripts[index]?.founder ?? scripts[scripts.length - 1].founder,
    market: scripts[index]?.market ?? scripts[scripts.length - 1].market,
    operations: scripts[index]?.operations ?? scripts[scripts.length - 1].operations,
    finance: scripts[index]?.finance ?? scripts[scripts.length - 1].finance,
    judge: scripts[index]?.judge ?? scripts[scripts.length - 1].judge,
    energy: energySeries[index] ?? energySeries[energySeries.length - 1],
    customers: customerSeries[index] ?? customerSeries[customerSeries.length - 1],
    cash: cashSeries[index] ?? cashSeries[cashSeries.length - 1],
    capacity: Math.max(14, Math.round((energySeries[index] ?? 20) * 0.72)),
  }));
}

export const intakeMetrics: ConsoleMetric[] = [
  {
    label: "Evidence density",
    value: "18 signals",
    caption: "Reader interviews, prototype notes, symbolic test cases",
    delta: "+4 this week",
    tone: "cyan",
  },
  {
    label: "Builder bandwidth",
    value: "32 hrs/wk",
    caption: "Available execution energy in first 90 days",
    delta: "tight",
    tone: "amber",
  },
  {
    label: "Budget envelope",
    value: "$42k",
    caption: "Usable capital before the next prototype cycle",
    delta: "5.2 months",
    tone: "emerald",
  },
];

export const intakeFields: IntakeField[] = [
  {
    label: "Problem",
    value: "Most astrology tools do not compare alternative paths before pushing one interpretation.",
    detail: "Decision quality is bottlenecked by fragmented signals and interpretation bias.",
  },
  {
    label: "Customer",
    value: "Astrologers, symbolic practitioners, and curious decision-makers exploring timing-sensitive choices.",
    detail: "Early adopters already value structured interpretation and replayable scenario tools.",
  },
  {
    label: "Wedge",
    value: "Astrolabe simulator for branching scenarios, replayable timing analysis, and action guidance.",
    detail: "Position around symbolic clarity and path comparison, not generic horoscope content.",
  },
];

export const defaultIntakeDraft: IntakeDraft = {
  projectName: "Astrolabe Decision Simulator",
  oneLiner: "Turn symbolic uncertainty into structured scenario comparisons before making a timing-sensitive choice.",
  targetCustomer:
    "Astrologers, symbolic readers, and curious decision-makers who want more than a static horoscope or one-shot reading.",
  corePain:
    "Most astrology workflows stop at interpretation fragments and do not compare alternative paths, timing windows, or contradictory signals in a structured way.",
  solution:
    "A simulator that structures chart inputs, runs 100 symbolic worldlines, and produces replayable guidance with next questions and action timing.",
  businessModel: "Premium readings, paid simulation reports, and subscription access for repeat scenario analysis.",
  pricing: "$49 personal reports, $199 deep-dive simulations, and subscription tiers for returning users.",
  acquisitionChannels:
    "Astrology communities, newsletters, creator partnerships, search, and shareable scenario reports.",
  founderProfile:
    "Hybrid founder with product judgment, symbolic literacy, and willingness to test guided readings manually before automating the simulator.",
  teamSize: "2",
  budget: "42000",
  traction:
    "Prototype reviews from practicing astrologers, symbolic researchers, and beta users comparing major life choices.",
  competitors:
    "Generic horoscope apps, chart calculators, tarot tools, and unstructured astrology content that do not model constrained worldline simulation.",
  supplementaryEvidence: [
    {
      id: "ev-1",
      type: "landing-page",
      url: "https://astrolabe-simulator.example/landing",
      note: "Early concept page for the symbolic-path positioning test.",
    },
    {
      id: "ev-2",
      type: "repo",
      url: "https://github.com/example/astrolabe-decision-simulator",
      note: "Prototype repo for the simulation shell and replay UI.",
    },
    {
      id: "ev-3",
      type: "demo",
      url: "https://demo.example/astrolabe-simulator",
      note: "Interactive mock showing symbolic reports and worldline replay concepts.",
    },
  ],
};

export const evidenceSignals: EvidenceSignal[] = [
  {
    title: "8 founder interviews report overbuilding before price discovery.",
    type: "Interview",
    confidence: "0.82",
    summary: "Most teams want a tool that pressures them into smaller, testable decisions.",
    tone: "cyan",
  },
  {
    title: "Three adjacent tools stop at analysis and do not model constrained execution.",
    type: "Competitive signal",
    confidence: "0.67",
    summary: "There is room for a system that connects assessment to simulation and execution playbooks.",
    tone: "emerald",
  },
  {
    title: "CAC assumptions remain weak outside founder-led distribution channels.",
    type: "Risk signal",
    confidence: "0.58",
    summary: "The model needs stronger evidence for scalable acquisition before expanding market scope.",
    tone: "amber",
  },
];

export const reportMetrics: ConsoleMetric[] = [
  {
    label: "Feasibility score",
    value: "78 / 100",
    caption: "Signal-adjusted viability of the current thesis",
    delta: "+9 vs unstructured baseline",
    tone: "cyan",
  },
  {
    label: "Confidence",
    value: "0.74",
    caption: "Evidence coverage across market, founder, and economics",
    delta: "medium-high",
    tone: "emerald",
  },
  {
    label: "Critical risk",
    value: "Pricing proof",
    caption: "Willingness to pay is still more fragile than product desirability",
    delta: "needs test",
    tone: "amber",
  },
  {
    label: "Core leverage",
    value: "Vertical wedge",
    caption: "Narrow compliance-heavy use case dominates broad SMB launch",
    delta: "highest upside",
    tone: "cyan",
  },
];

export const reportSummary: ReportSummary = {
  viabilityScore: 78,
  viabilityLabel: "Selective Go",
  strategicVerdict: "Worth pursuing if the team stays niche-first and proves pricing before broad product buildout.",
  executiveSummary:
    "The idea shows real strategic promise because the pain is strong, the MVP can be delivered with constrained resources, and differentiated value appears in turning fuzzy startup bets into structured decisions. The weak point is not desirability but monetization proof and channel certainty.",
  dataSufficiency: 71,
  dataSufficiencyLabel: "Developing",
  confidence: 74,
  confidenceLabel: "Moderately High",
};

export const reportScoreBreakdown: ScoreBreakdown[] = [
  {
    label: "Market pain",
    score: 81,
    confidence: 78,
    note: "Need intensity is strongest where wrong startup bets are especially expensive.",
  },
  {
    label: "Founder fit",
    score: 76,
    confidence: 72,
    note: "The thesis benefits from strong product judgment and disciplined execution cadence.",
  },
  {
    label: "Customer urgency",
    score: 79,
    confidence: 74,
    note: "Pain sharpens when wrong startup decisions are expensive and time-sensitive.",
  },
  {
    label: "Distribution",
    score: 63,
    confidence: 54,
    note: "Founder-led channels look viable first; scalable acquisition still needs proof.",
  },
  {
    label: "Buildability",
    score: 84,
    confidence: 80,
    note: "A report-first MVP is feasible without heavy infrastructure.",
  },
  {
    label: "Unit economics",
    score: 69,
    confidence: 61,
    note: "Economics improve only if manual service work gets constrained quickly.",
  },
  {
    label: "Defensibility",
    score: 66,
    confidence: 57,
    note: "Differentiation can grow from proprietary simulations and decision logs, but is early today.",
  },
  {
    label: "Timing",
    score: 80,
    confidence: 73,
    note: "AI founders currently face high noise and demand clearer go/no-go systems.",
  },
];

export const reportDecisionPaths: DecisionPath[] = [
  {
    label: "Recommended",
    title: "Pursue a niche-first launch with manual decision reports.",
    description:
      "Lead with a narrow founder segment where capital misallocation hurts most, and sell clarity before broad product automation.",
    condition: "Strongest expected outcome if pricing is tested before expansion.",
    tone: "emerald",
  },
  {
    label: "Conditional",
    title: "Build a wider platform only after pricing and repeatable delivery prove out.",
    description:
      "A broader operating system can emerge later, but only if one wedge shows sustained willingness to pay and repeatable report loops.",
    condition: "Viable after pilot conversion and hours-per-report targets are hit.",
    tone: "amber",
  },
  {
    label: "Avoid",
    title: "Do not launch as a generic AI founder dashboard.",
    description:
      "Broad positioning weakens urgency, hurts conversion quality, and pushes the team toward premature feature expansion.",
    condition: "No-go if the story still requires multiple buyer personas to feel compelling.",
    tone: "rose",
  },
];

export const reportCoverageMatrix: ScoreBreakdown[] = [
  {
    label: "Customer pain evidence",
    score: 82,
    confidence: 84,
    note: "Interview density is already strong relative to the stage.",
  },
  {
    label: "Pricing evidence",
    score: 58,
    confidence: 51,
    note: "The system still needs direct willingness-to-pay validation.",
  },
  {
    label: "Acquisition evidence",
    score: 49,
    confidence: 43,
    note: "Top-of-funnel assumptions remain the weakest part of the case.",
  },
  {
    label: "Delivery feasibility",
    score: 77,
    confidence: 70,
    note: "A constrained report workflow is feasible with current founder bandwidth.",
  },
];

export const coreRisks: InsightBlock[] = [
  {
    title: "Broad positioning dilutes proof of value too early.",
    body: "The model expects weaker conversion if onboarding and messaging try to serve every AI founder persona at once.",
    tone: "amber",
  },
  {
    title: "Founder energy becomes a hidden constraint by month 4.",
    body: "Too many custom analyses increase delivery drag and erase the benefit of a software-first model.",
    tone: "rose",
  },
  {
    title: "Paid growth is premature before pricing sensitivity is understood.",
    body: "Organic founder-led channels outperform any scaled acquisition path in current evidence conditions.",
    tone: "amber",
  },
];

export const coreLevers: InsightBlock[] = [
  {
    title: "Start with a high-stakes niche where wrong decisions are expensive.",
    body: "Teams in compliance-heavy or capital-sensitive workflows show stronger need intensity and clearer ROI language.",
    tone: "cyan",
  },
  {
    title: "Use reports as sales assets, not just internal artifacts.",
    body: "Decision briefs can become the wedge that converts pilots into recurring strategy subscriptions.",
    tone: "emerald",
  },
  {
    title: "Keep the first product loop tightly opinionated.",
    body: "The system wins when it forces prioritization instead of offering endless analysis paths.",
    tone: "cyan",
  },
];

export const reportExperiments: ExperimentStep[] = [
  {
    title: "Run a pricing sensitivity sprint with 10 founders.",
    metric: "Positive willingness-to-pay signal",
    threshold: "4 of 10 accept a paid pilot range",
    why: "Pricing proof is the highest-leverage uncertainty still unresolved in the model.",
    expectedLearning: "Whether the wedge is strong enough to move from interest into real budget commitment.",
    priority: "01",
  },
  {
    title: "Test vertical-specific landing page messaging.",
    metric: "Qualified conversion rate",
    threshold: "> 12% from founder communities",
    why: "The decision engine believes narrow positioning is the main lever behind improved viability.",
    expectedLearning: "Which use case and message produce the cleanest, highest-intent inbound signal.",
    priority: "02",
  },
  {
    title: "Time-box manual report delivery for first cohort.",
    metric: "Founder hours per report",
    threshold: "< 2.5 hours median",
    why: "Unit economics only work if the system becomes repeatable faster than service complexity grows.",
    expectedLearning: "Whether this can behave like software-assisted operations instead of founder-heavy consulting.",
    priority: "03",
  },
];

export const simulationMetrics: ConsoleMetric[] = [
  {
    label: "Simulated companies",
    value: "100",
    caption: "Founder archetypes, budgets, and noise conditions",
    delta: "12 months each",
    tone: "cyan",
  },
  {
    label: "Month-12 survivors",
    value: "33",
    caption: "Positive runway and retained strategic viability",
    delta: "+6 vs baseline",
    tone: "emerald",
  },
  {
    label: "Failure driver",
    value: "Overbuild",
    caption: "Feature surface expands before clear pricing proof",
    delta: "41% of failures",
    tone: "amber",
  },
  {
    label: "Best strategy",
    value: "Niche-first",
    caption: "Concentrated messaging outperforms broad launch patterns",
    delta: "top quartile",
    tone: "cyan",
  },
];

export const survivalSeries: ChartPoint[] = [
  { label: "M1", value: 100 },
  { label: "M2", value: 94 },
  { label: "M3", value: 87 },
  { label: "M4", value: 82 },
  { label: "M5", value: 76 },
  { label: "M6", value: 69 },
  { label: "M7", value: 61 },
  { label: "M8", value: 55 },
  { label: "M9", value: 48 },
  { label: "M10", value: 42 },
  { label: "M11", value: 37 },
  { label: "M12", value: 33 },
];

export const strategyDistribution: ChartPoint[] = [
  { label: "Builder", value: 18 },
  { label: "Seller", value: 24 },
  { label: "Operator", value: 21 },
  { label: "Analyst", value: 15 },
  { label: "Hybrid", value: 28 },
];

export const simulatedCompanies: SimulatedCompanyCard[] = [
  {
    id: "company-alpha",
    name: "Company Alpha",
    archetype: "Hybrid founder",
    status: "survived",
    runway: "9.2 mo",
    headline: "Won by narrowing to compliance-heavy teams and selling reports before software automation.",
    tone: "emerald",
  },
  {
    id: "company-sigma",
    name: "Company Sigma",
    archetype: "Operator founder",
    status: "stalled",
    runway: "4.1 mo",
    headline: "Maintained demand signal but lost pace due to high manual service overhead.",
    tone: "amber",
  },
  {
    id: "company-nova",
    name: "Company Nova",
    archetype: "Builder founder",
    status: "failed",
    runway: "0.0 mo",
    headline: "Expanded feature scope too quickly and missed pricing validation before month 5.",
    tone: "rose",
  },
];

export const plannerMetrics: ConsoleMetric[] = [
  {
    label: "Primary bet",
    value: "Compliance wedge",
    caption: "Start with the use case where bad decisions are most expensive",
    delta: "priority one",
    tone: "cyan",
  },
  {
    label: "First KPI",
    value: "Pilot conversion",
    caption: "Move from interest to paid commitment fast",
    delta: ">= 40%",
    tone: "emerald",
  },
  {
    label: "Stop-loss",
    value: "CAC payback",
    caption: "Pause expansion if payback stays outside threshold after three iterations",
    delta: "by month 3",
    tone: "amber",
  },
];

export const plannerPhases: PlannerPhase[] = [
  {
    label: "Day 1",
    title: "Lock the niche and the decision promise.",
    focus: "Commit to one wedge, one founder persona, one failure mode worth paying to avoid.",
    metric: "One-sentence positioning approved",
    stopLoss: "If the promise still needs three audiences to make sense, narrow further.",
  },
  {
    label: "Week 1",
    title: "Run ten structured pricing conversations.",
    focus: "Sell the decision outcome, not the dashboard surface.",
    metric: "4 paid pilot intents",
    stopLoss: "If nobody accepts a price range, rewrite the wedge before building deeper.",
  },
  {
    label: "Month 1",
    title: "Deliver manual reports with software scaffolding.",
    focus: "Find the minimum system that creates repeatable insight with low founder drag.",
    metric: "< 2.5 founder hours per report",
    stopLoss: "If delivery still feels like consulting, strip scope immediately.",
  },
  {
    label: "Month 3",
    title: "Automate the repeatable loop and expand the best segment only.",
    focus: "Translate the highest-signal report motions into product primitives.",
    metric: "70% of reports generated from reusable flows",
    stopLoss: "If automation adds complexity without margin lift, keep the system manual longer.",
  },
  {
    label: "Month 6",
    title: "Decide whether to scale, specialize, or pivot the wedge.",
    focus: "Use retention, payback, and margin signal to choose the next capital allocation move.",
    metric: "Sustainable payback inside target window",
    stopLoss: "If the niche still needs founder heroics to close, revisit market selection.",
  },
];

export const plannerActions: PlannerAction[] = [
  {
    phase: "Day 1",
    title: "Write the founder-facing decision thesis and rejection criteria.",
    owner: "Founder",
    measure: "Approved positioning doc",
  },
  {
    phase: "Week 1",
    title: "Interview and price-test 10 targets from the chosen wedge.",
    owner: "Founder + GTM",
    measure: "Pilot intent rate",
  },
  {
    phase: "Month 1",
    title: "Ship manual decision reports to the first cohort with a repeatable template.",
    owner: "Ops",
    measure: "Hours per report",
  },
  {
    phase: "Month 3",
    title: "Automate evidence parsing and report assembly for the best-performing flow.",
    owner: "Product",
    measure: "Gross margin per report",
  },
  {
    phase: "Month 6",
    title: "Choose scale, deepen specialization, or pivot based on payback and retention.",
    owner: "Founder",
    measure: "Payback + retention threshold",
  },
];

export const replayProfiles: Record<string, ReplayProfile> = {
  "company-alpha": {
    id: "company-alpha",
    company: "Company Alpha",
    archetype: "Hybrid founder",
    verdict: "Viable with a narrow wedge and disciplined report-first motion.",
    summary:
      "Alpha survived because it sold clarity before software. It kept scope small, found price signal quickly, and automated only after a repeatable report loop existed.",
    metrics: [
      {
        label: "Month-12 status",
        value: "Survived",
        caption: "Runway and demand both remained positive",
        delta: "top quartile",
        tone: "emerald",
      },
      {
        label: "Peak runway",
        value: "9.2 mo",
        caption: "After vertical pricing adjustment",
        delta: "+2.4 mo",
        tone: "cyan",
      },
      {
        label: "Judge verdict",
        value: "Focus wins",
        caption: "Narrow segmentation outperformed product breadth",
        delta: "confirmed",
        tone: "cyan",
      },
    ],
    trajectory: [
      { label: "M1", revenue: 1, runway: 6.2 },
      { label: "M2", revenue: 2, runway: 6.5 },
      { label: "M3", revenue: 3, runway: 7.1 },
      { label: "M4", revenue: 4, runway: 7.4 },
      { label: "M5", revenue: 6, runway: 7.7 },
      { label: "M6", revenue: 7, runway: 8.1 },
      { label: "M7", revenue: 8, runway: 8.5 },
      { label: "M8", revenue: 9, runway: 8.8 },
      { label: "M9", revenue: 11, runway: 9.0 },
      { label: "M10", revenue: 12, runway: 9.1 },
      { label: "M11", revenue: 13, runway: 9.2 },
      { label: "M12", revenue: 15, runway: 9.2 },
    ],
    events: [
      {
        month: "Month 1",
        title: "Founder narrows the ICP to compliance-heavy AI teams.",
        body: "This reduces message ambiguity and improves early interview quality immediately.",
        verdict: "Leverage identified",
        tone: "cyan",
      },
      {
        month: "Month 3",
        title: "Pricing signal appears before product automation does.",
        body: "The company starts selling a manual decision report rather than waiting for a complete software build.",
        verdict: "Cash efficiency improved",
        tone: "emerald",
      },
      {
        month: "Month 6",
        title: "Ops complexity starts rising, but automation is applied selectively.",
        body: "Only the repeatable evidence parsing steps are productized, preserving founder bandwidth.",
        verdict: "Constraint managed",
        tone: "cyan",
      },
      {
        month: "Month 10",
        title: "Company declines broader SMB requests.",
        body: "Short-term top-line grows slower, but the model avoids support drag and keeps retention stronger.",
        verdict: "Good rejection",
        tone: "emerald",
      },
    ],
  },
  "company-sigma": {
    id: "company-sigma",
    company: "Company Sigma",
    archetype: "Operator founder",
    verdict: "Promising demand, but manual delivery drag caps momentum.",
    summary:
      "Sigma finds buyer interest but keeps too much service complexity in the loop. The business does not fail, yet it becomes too labor-intensive to compound quickly.",
    metrics: [
      {
        label: "Month-12 status",
        value: "Stalled",
        caption: "Demand exists, but operating margin remains weak",
        delta: "middle cohort",
        tone: "amber",
      },
      {
        label: "Median runway",
        value: "4.1 mo",
        caption: "Manual service layer eats bandwidth",
        delta: "-1.6 mo",
        tone: "amber",
      },
      {
        label: "Judge verdict",
        value: "Simplify delivery",
        caption: "Standardization lags behind customer variety",
        delta: "urgent",
        tone: "rose",
      },
    ],
    trajectory: [
      { label: "M1", revenue: 1, runway: 5.8 },
      { label: "M2", revenue: 2, runway: 5.7 },
      { label: "M3", revenue: 3, runway: 5.3 },
      { label: "M4", revenue: 4, runway: 5.0 },
      { label: "M5", revenue: 4, runway: 4.8 },
      { label: "M6", revenue: 5, runway: 4.7 },
      { label: "M7", revenue: 5, runway: 4.5 },
      { label: "M8", revenue: 5, runway: 4.4 },
      { label: "M9", revenue: 6, runway: 4.3 },
      { label: "M10", revenue: 6, runway: 4.2 },
      { label: "M11", revenue: 6, runway: 4.1 },
      { label: "M12", revenue: 6, runway: 4.1 },
    ],
    events: [
      {
        month: "Month 2",
        title: "Customer demand validates the wedge.",
        body: "Early conversations convert well, confirming the strategic framing is useful.",
        verdict: "Demand confirmed",
        tone: "emerald",
      },
      {
        month: "Month 5",
        title: "Each delivery becomes custom and founder-heavy.",
        body: "The company keeps winning work, but cannot reduce the time cost of each engagement.",
        verdict: "Scale friction",
        tone: "amber",
      },
      {
        month: "Month 9",
        title: "Automation attempt expands scope instead of reducing it.",
        body: "Feature creep enters through customization demands, hurting efficiency gains.",
        verdict: "Execution drag",
        tone: "rose",
      },
    ],
  },
  "company-nova": {
    id: "company-nova",
    company: "Company Nova",
    archetype: "Builder founder",
    verdict: "Fails due to overbuild before pricing proof.",
    summary:
      "Nova chases product completeness first. Without narrow positioning or early paid validation, runway collapses before the wedge becomes legible to buyers.",
    metrics: [
      {
        label: "Month-12 status",
        value: "Failed",
        caption: "Runway exhausted before repeatable revenue",
        delta: "bottom quartile",
        tone: "rose",
      },
      {
        label: "Runway collapse",
        value: "Month 5",
        caption: "Feature velocity outruns market learning",
        delta: "critical",
        tone: "rose",
      },
      {
        label: "Judge verdict",
        value: "Too broad",
        caption: "Strategy never narrows enough to gain traction",
        delta: "avoidable",
        tone: "amber",
      },
    ],
    trajectory: [
      { label: "M1", revenue: 0, runway: 6.0 },
      { label: "M2", revenue: 0, runway: 5.1 },
      { label: "M3", revenue: 1, runway: 4.0 },
      { label: "M4", revenue: 1, runway: 2.8 },
      { label: "M5", revenue: 1, runway: 0.6 },
      { label: "M6", revenue: 0, runway: 0.0 },
      { label: "M7", revenue: 0, runway: 0.0 },
      { label: "M8", revenue: 0, runway: 0.0 },
      { label: "M9", revenue: 0, runway: 0.0 },
      { label: "M10", revenue: 0, runway: 0.0 },
      { label: "M11", revenue: 0, runway: 0.0 },
      { label: "M12", revenue: 0, runway: 0.0 },
    ],
    events: [
      {
        month: "Month 1",
        title: "Founder expands product ambition immediately.",
        body: "The company invests in a broad platform before validating what decision buyers truly need.",
        verdict: "Strategic sprawl",
        tone: "amber",
      },
      {
        month: "Month 4",
        title: "Acquisition experiments remain weak and under-instrumented.",
        body: "Without pricing clarity, GTM cannot convert interest into committed revenue.",
        verdict: "Signal deficit",
        tone: "rose",
      },
      {
        month: "Month 5",
        title: "Runway collapses before strategic focus improves.",
        body: "The judge agent marks the line as non-viable given remaining capital and learning speed.",
        verdict: "Termination",
        tone: "rose",
      },
    ],
  },
};
