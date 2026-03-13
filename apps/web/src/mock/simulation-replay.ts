import type {
  JudgeCausalSummary,
  MonthlyDecisionLog,
  MonthlyKeyEvent,
  StageChange,
  WorldlineCompany,
  WorldlineOutcome,
  WorldlineReplay,
} from "@/types/simulation";
import { worldlineCompanies } from "@/mock/simulation";

function getFinalOutcome(company: WorldlineCompany): WorldlineOutcome {
  if (company.status === "failed") {
    return "Dead";
  }

  if (company.status === "breakout") {
    return "Scalable";
  }

  if (company.status === "survived" && company.month12Profitability >= 15 && company.month12Runway >= 7) {
    return "Sustainable";
  }

  if (company.status === "survived") {
    return "Survive";
  }

  return "Explore";
}

function toneFromOutcome(outcome: WorldlineOutcome) {
  switch (outcome) {
    case "Scalable":
      return "cyan" as const;
    case "Sustainable":
      return "emerald" as const;
    case "Survive":
      return "emerald" as const;
    case "Explore":
      return "amber" as const;
    case "Dead":
      return "rose" as const;
  }
}

function getGenericReason(company: WorldlineCompany, outcome: WorldlineOutcome) {
  if (outcome === "Dead") {
    return company.deathReason
      ? `The worldline dies because ${company.deathReason.toLowerCase()} compounds faster than learning and cash recovery.`
      : "The worldline dies because constraints compound faster than strategy quality improves.";
  }

  if (outcome === "Scalable") {
    return "This worldline wins because focus, pricing clarity, and execution discipline compound together before the team broadens scope.";
  }

  if (outcome === "Sustainable") {
    return "This worldline survives by finding a repeatable wedge and keeping founder energy and capital inside a manageable loop.";
  }

  if (outcome === "Survive") {
    return "This worldline stays alive, but only by maintaining enough demand and cash discipline to avoid terminal mistakes.";
  }

  return "This worldline remains exploratory because signal exists, but the business never reaches a strong repeatable operating loop.";
}

function getGenericJudgeSummary(company: WorldlineCompany, outcome: WorldlineOutcome): JudgeCausalSummary {
  const primaryCause =
    outcome === "Dead"
      ? company.deathReason ?? "runway mismanagement"
      : `${company.strategyType.toLowerCase()} strategy under a ${company.founderType.toLowerCase()} founder profile`;

  return {
    headline:
      outcome === "Dead"
        ? "Constraint failure outruns learning."
        : outcome === "Scalable"
          ? "Focused execution compounds into scale."
          : outcome === "Sustainable"
            ? "A viable loop forms before burn wins."
            : outcome === "Survive"
              ? "The company stays alive without fully breaking out."
              : "The company keeps learning but never locks a decisive loop.",
    summary: getGenericReason(company, outcome),
    primaryCause,
    counterfactual:
      outcome === "Dead"
        ? "A tighter wedge and earlier pricing proof would have extended runway enough to create a second strategic cycle."
        : "Broader expansion before pricing proof would likely have pushed this line into the failure cohort.",
  };
}

function getGenericStageTimeline(company: WorldlineCompany, outcome: WorldlineOutcome): StageChange[] {
  if (outcome === "Dead") {
    return [
      {
        stage: "Exploration",
        startMonth: 1,
        endMonth: 2,
        summary: "The company searches for wedge clarity and early signal.",
        outcome,
        tone: "amber",
      },
      {
        stage: "Pressure Build",
        startMonth: 3,
        endMonth: 4,
        summary: "Scope expands faster than validated demand or pricing proof.",
        outcome,
        tone: "rose",
      },
      {
        stage: "Collapse",
        startMonth: 5,
        endMonth: 12,
        summary: "Cash and founder energy drop below recovery threshold before strategy corrects.",
        outcome,
        tone: "rose",
      },
    ];
  }

  return [
    {
      stage: "Exploration",
      startMonth: 1,
      endMonth: 3,
      summary: "The company sharpens problem framing and tests where urgency is strongest.",
      outcome,
      tone: "amber",
    },
    {
      stage: "Proof Loop",
      startMonth: 4,
      endMonth: 6,
      summary: "Demand, pricing, and delivery begin interacting as a real operating loop.",
      outcome,
      tone: "cyan",
    },
    {
      stage: outcome === "Scalable" ? "Scale Loop" : "Operating Loop",
      startMonth: 7,
      endMonth: 9,
      summary:
        outcome === "Scalable"
          ? "The company productizes what is already working and compounds without losing focus."
          : "The company stabilizes around a constrained but repeatable execution path.",
      outcome,
      tone: outcome === "Scalable" ? "cyan" : "emerald",
    },
    {
      stage: "Outcome State",
      startMonth: 10,
      endMonth: 12,
      summary: `The line ends in a ${outcome.toLowerCase()} state based on the combined effect of strategy, market response, and resource discipline.`,
      outcome,
      tone: toneFromOutcome(outcome),
    },
  ];
}

function getGenericKeyEvents(company: WorldlineCompany, outcome: WorldlineOutcome): MonthlyKeyEvent[] {
  return [
    {
      month: 1,
      label: "M1",
      title: `Initial wedge defined around a ${company.strategyType.toLowerCase()} strategy.`,
      summary: "The founder sets the first operating assumptions and decides where to collect signal.",
      category: "setup",
      tone: "cyan",
    },
    {
      month: 3,
      label: "M3",
      title: "Market feedback begins separating noise from repeatable signal.",
      summary: "The company starts discovering whether the current positioning creates urgency or just curiosity.",
      category: "signal",
      tone: "amber",
    },
    {
      month: 6,
      label: "M6",
      title: outcome === "Dead" ? "Resource pressure overtakes learning speed." : "A clearer operating loop emerges.",
      summary:
        outcome === "Dead"
          ? "At the midpoint, the line is already failing to recover from earlier strategic decisions."
          : "The company now behaves more like a real system than a loose collection of experiments.",
      category: "inflection",
      tone: outcome === "Dead" ? "rose" : "emerald",
    },
    {
      month: 9,
      label: "M9",
      title: outcome === "Scalable" ? "The winning motion begins compounding." : "The line reveals its long-term ceiling.",
      summary:
        outcome === "Scalable"
          ? "Founder energy, cash, and demand all move in the same direction for the first time."
          : "By month 9 it becomes clear whether the company will scale, plateau, or die.",
      category: "trajectory",
      tone: toneFromOutcome(outcome),
    },
    {
      month: 12,
      label: "M12",
      title: `Final state: ${outcome}.`,
      summary: getGenericReason(company, outcome),
      category: "outcome",
      tone: toneFromOutcome(outcome),
    },
  ];
}

function getGenericMonthlyLogs(company: WorldlineCompany, outcome: WorldlineOutcome): MonthlyDecisionLog[] {
  return company.timeline.map((month) => ({
    month: month.month,
    label: month.label,
    decision:
      month.month <= 3
        ? `Probe the ${company.strategyType.toLowerCase()} wedge while the ${company.founderType.toLowerCase()} founder profile defines operating constraints.`
        : month.month <= 6
          ? "Convert signal into a repeatable pricing and delivery loop."
          : month.month <= 9
            ? outcome === "Dead"
              ? "Cut burn and search for a late recovery path."
              : "Decide what to standardize and what to deliberately reject."
            : outcome === "Scalable"
              ? "Reinforce the winning loop without broadening too early."
              : "Protect runway and see whether the loop can hold.",
    rationale:
      month.month <= 3
        ? "The first quarter is mostly about finding where urgency is real enough to justify continued investment."
        : month.month <= 6
          ? "Middle months determine whether the idea becomes a system or remains a promising theory."
          : month.month <= 9
            ? "The line is now shaped more by operating discipline than raw idea quality."
            : "Late-stage decisions mostly reveal whether the earlier structure was strong enough.",
    judgeSignal:
      month.alive
        ? `Judge sees ${month.profitability >= 0 ? "improving" : "fragile"} viability with ${month.founderEnergy}% founder energy.`
        : "Judge marks the line non-recoverable under remaining constraints.",
    financeImpact: `Cash ${month.cash}k | runway ${month.runway} mo | revenue ${month.revenue}k`,
    marketSignal:
      month.revenue > 0
        ? `${month.revenue}k monthly revenue implies some market pull, but quality depends on profitability and energy.`
        : "No durable revenue signal yet; the company is still searching for proof.",
    tone: month.alive ? (month.profitability >= 0 ? "emerald" : "amber") : "rose",
  }));
}

const manualReplayNarratives: Record<string, Omit<WorldlineReplay, "company">> = {
  "company-alpha": {
    finalOutcome: "Sustainable",
    finalNarrative:
      "Company Alpha plays the worldline correctly: it narrows fast, sells clarity before software, and only productizes the parts of the system that already show repeatability.",
    successOrFailureReason:
      "Alpha succeeds because it resists breadth, turns pricing proof into a real operating loop by month 3, and keeps founder energy from collapsing while revenue compounds.",
    judgeSummary: {
      headline: "Focus beats platform ambition.",
      summary:
        "The judge agent attributes Alpha's success to disciplined wedge selection, early willingness-to-pay proof, and selective automation. The company never confuses product breadth with strategic progress.",
      primaryCause: "Niche-first positioning with report-first monetization",
      counterfactual:
        "If Alpha had accepted broader SMB work in month 4-6, manual delivery drag would likely have pushed it into the stalled cohort.",
    },
    stageTimeline: [
      {
        stage: "Niche Lock",
        startMonth: 1,
        endMonth: 2,
        summary: "The founder narrows to compliance-heavy AI teams and rejects broader positioning.",
        outcome: "Sustainable",
        tone: "cyan",
      },
      {
        stage: "Pricing Proof",
        startMonth: 3,
        endMonth: 4,
        summary: "Manual decision briefs prove buyers will pay for clarity before a full platform exists.",
        outcome: "Sustainable",
        tone: "emerald",
      },
      {
        stage: "Systemization",
        startMonth: 5,
        endMonth: 8,
        summary: "Only repeatable evidence parsing and report assembly steps get automated.",
        outcome: "Sustainable",
        tone: "emerald",
      },
      {
        stage: "Sustainable Loop",
        startMonth: 9,
        endMonth: 12,
        summary: "Revenue, runway, and founder energy stabilize into a durable operating cadence.",
        outcome: "Sustainable",
        tone: "emerald",
      },
    ],
    keyEvents: [
      {
        month: 1,
        label: "M1",
        title: "Alpha narrows to a compliance-heavy wedge.",
        summary: "This is the first decisive move that turns broad curiosity into legible buyer urgency.",
        category: "positioning",
        tone: "cyan",
      },
      {
        month: 3,
        label: "M3",
        title: "The first paid report validates pricing before automation exists.",
        summary: "Alpha learns that the outcome is sellable even while the workflow is still partially manual.",
        category: "pricing",
        tone: "emerald",
      },
      {
        month: 6,
        label: "M6",
        title: "Automation is applied selectively instead of broadly.",
        summary: "The team productizes only the repeatable parts, preserving energy and reducing delivery drag.",
        category: "operations",
        tone: "cyan",
      },
      {
        month: 10,
        label: "M10",
        title: "Alpha rejects attractive but off-strategy SMB requests.",
        summary: "This keeps the system concentrated and prevents service complexity from exploding.",
        category: "discipline",
        tone: "emerald",
      },
      {
        month: 12,
        label: "M12",
        title: "Alpha closes the year as a sustainable niche business.",
        summary: "It is not yet infinitely scalable, but it has a repeatable revenue and decision loop.",
        category: "outcome",
        tone: "emerald",
      },
    ],
    monthlyLogs: [
      { month: 1, label: "M1", decision: "Choose one wedge and reject general founder tooling language.", rationale: "The company needs urgency, not broad appeal.", judgeSignal: "Judge sees improved signal density after wedge narrowing.", financeImpact: "Cash 74k | runway 6.2 mo | revenue 1k", marketSignal: "Early calls become more specific and problem-driven.", tone: "cyan" },
      { month: 2, label: "M2", decision: "Run problem-first interviews instead of building more dashboard surface.", rationale: "Pricing and pain clarity matter more than interface breadth.", judgeSignal: "Judge notes stronger fit, but monetization remains unproven.", financeImpact: "Cash 77k | runway 6.5 mo | revenue 2k", marketSignal: "Buyers respond to stop-loss framing.", tone: "amber" },
      { month: 3, label: "M3", decision: "Sell a manual decision brief to the first pilot customer.", rationale: "The company needs payment proof before product automation.", judgeSignal: "Judge upgrades viability because willingness to pay appears.", financeImpact: "Cash 82k | runway 7.1 mo | revenue 3k", marketSignal: "Paid demand arrives before software completeness.", tone: "emerald" },
      { month: 4, label: "M4", decision: "Template the report workflow instead of customizing every delivery.", rationale: "Repeatability matters more than bespoke depth this early.", judgeSignal: "Judge sees the first signs of an operating loop.", financeImpact: "Cash 86k | runway 7.4 mo | revenue 4k", marketSignal: "Customer value remains strong with a tighter scope.", tone: "emerald" },
      { month: 5, label: "M5", decision: "Instrument pricing objections and close the feedback loop weekly.", rationale: "The next leverage point is price confidence, not feature volume.", judgeSignal: "Judge sees improving economics with controlled burn.", financeImpact: "Cash 93k | runway 7.7 mo | revenue 6k", marketSignal: "Buyers react to ROI language more than product breadth.", tone: "emerald" },
      { month: 6, label: "M6", decision: "Automate only evidence parsing and report assembly primitives.", rationale: "Selective productization keeps founder effort focused.", judgeSignal: "Judge marks automation as additive rather than distracting.", financeImpact: "Cash 97k | runway 8.1 mo | revenue 7k", marketSignal: "Faster delivery becomes part of the value proposition.", tone: "cyan" },
      { month: 7, label: "M7", decision: "Formalize the operating cadence around one high-fit segment.", rationale: "Compounding begins when the loop stops branching.", judgeSignal: "Judge sees less noise and better conversion consistency.", financeImpact: "Cash 101k | runway 8.5 mo | revenue 8k", marketSignal: "Referrals improve because the positioning is repeatable.", tone: "emerald" },
      { month: 8, label: "M8", decision: "Increase pricing where the wedge is clearly ROI positive.", rationale: "The company now has enough signal to capture more value.", judgeSignal: "Judge sees economics strengthening without hurting demand.", financeImpact: "Cash 106k | runway 8.8 mo | revenue 9k", marketSignal: "High-fit buyers accept premium positioning.", tone: "emerald" },
      { month: 9, label: "M9", decision: "Hold the niche instead of opening adjacent segments.", rationale: "Preserve loop quality before chasing scale.", judgeSignal: "Judge sees strategic discipline protecting long-term viability.", financeImpact: "Cash 110k | runway 9.0 mo | revenue 11k", marketSignal: "Retention quality now matters more than volume.", tone: "cyan" },
      { month: 10, label: "M10", decision: "Reject broad SMB requests that would distort the system.", rationale: "Not all revenue is good revenue in this worldline.", judgeSignal: "Judge sees a valuable rejection that preserves focus.", financeImpact: "Cash 113k | runway 9.1 mo | revenue 12k", marketSignal: "Positioning remains sharp because scope stays bounded.", tone: "emerald" },
      { month: 11, label: "M11", decision: "Codify the report into a repeatable internal engine.", rationale: "The company is now turning tacit judgment into process.", judgeSignal: "Judge sees strong sustainability conditions emerging.", financeImpact: "Cash 115k | runway 9.2 mo | revenue 13k", marketSignal: "Customers trust the system because outcomes stay consistent.", tone: "emerald" },
      { month: 12, label: "M12", decision: "Prepare for careful expansion without abandoning the niche loop.", rationale: "The business is ready for a second-order decision, not a reinvention.", judgeSignal: "Judge classifies the line as sustainable with optional scale paths.", financeImpact: "Cash 118k | runway 9.2 mo | revenue 15k", marketSignal: "The wedge is now both legible and monetized.", tone: "emerald" },
    ],
  },
  "company-sigma": {
    finalOutcome: "Explore",
    finalNarrative:
      "Company Sigma finds demand but never turns demand into a sufficiently repeatable operating system. The worldline remains alive, yet strategically unresolved.",
    successOrFailureReason:
      "Sigma does not die because customers want the outcome, but it also does not truly scale because every delivery keeps bending toward custom work and founder-heavy operations.",
    judgeSummary: {
      headline: "Demand exists, but system quality lags behind service complexity.",
      summary:
        "The judge agent concludes Sigma is caught in the middle: strong enough to avoid death, too operationally messy to become truly durable. The limiting factor is not market pain but standardization.",
      primaryCause: "Service-led execution without strong enough product boundaries",
      counterfactual:
        "If Sigma had narrowed customer variability by month 4, it could have moved from exploratory survival into a sustainable cohort.",
    },
    stageTimeline: [
      {
        stage: "Early Pull",
        startMonth: 1,
        endMonth: 3,
        summary: "The wedge resonates quickly and converts into promising pilot demand.",
        outcome: "Explore",
        tone: "emerald",
      },
      {
        stage: "Service Drag",
        startMonth: 4,
        endMonth: 6,
        summary: "Delivery becomes too bespoke, eating founder energy and blocking standardization.",
        outcome: "Explore",
        tone: "amber",
      },
      {
        stage: "Automation Drift",
        startMonth: 7,
        endMonth: 10,
        summary: "Attempts to automate happen across too many variants, so leverage stays limited.",
        outcome: "Explore",
        tone: "amber",
      },
      {
        stage: "Plateau",
        startMonth: 11,
        endMonth: 12,
        summary: "The company remains useful but unresolved, ending the year in an exploratory state.",
        outcome: "Explore",
        tone: "amber",
      },
    ],
    keyEvents: [
      { month: 2, label: "M2", title: "Demand validates the wedge early.", summary: "Sigma proves the problem is real, which prevents immediate failure.", category: "demand", tone: "emerald" },
      { month: 5, label: "M5", title: "Manual delivery complexity begins compounding.", summary: "Customer work starts splintering into too many variants to scale cleanly.", category: "operations", tone: "amber" },
      { month: 8, label: "M8", title: "The company tries to automate without enough standardization.", summary: "Automation effort adds surface area faster than it removes operational drag.", category: "automation", tone: "amber" },
      { month: 10, label: "M10", title: "Growth stalls into a service-shaped plateau.", summary: "Sigma avoids death, but does not unlock compounding economics.", category: "plateau", tone: "amber" },
      { month: 12, label: "M12", title: "Sigma finishes as an unresolved exploratory business.", summary: "It needs stricter scope and product boundaries to become durable.", category: "outcome", tone: "amber" },
    ],
    monthlyLogs: [
      { month: 1, label: "M1", decision: "Launch a service-led wedge with strong founder involvement.", rationale: "Speed to signal matters more than clean automation at the start.", judgeSignal: "Judge sees plausible demand and acceptable burn.", financeImpact: "Cash 70k | runway 5.8 mo | revenue 1k", marketSignal: "Customers respond to the promise of clearer decisions.", tone: "emerald" },
      { month: 2, label: "M2", decision: "Double down on interviews and early pilots.", rationale: "The company wants proof that the wedge is real before narrowing scope further.", judgeSignal: "Judge confirms demand but flags delivery variability risk.", financeImpact: "Cash 69k | runway 5.7 mo | revenue 2k", marketSignal: "Pilot conversations convert better than expected.", tone: "emerald" },
      { month: 3, label: "M3", decision: "Accept several adjacent use cases to avoid losing momentum.", rationale: "Revenue pressure starts shaping the product boundary too early.", judgeSignal: "Judge warns that signal quality may blur.", financeImpact: "Cash 66k | runway 5.3 mo | revenue 3k", marketSignal: "Demand is real, but customer profiles diverge.", tone: "amber" },
      { month: 4, label: "M4", decision: "Keep custom delivery promises instead of pruning scope.", rationale: "The founder wants to preserve near-term wins.", judgeSignal: "Judge sees operational drag beginning to dominate.", financeImpact: "Cash 64k | runway 5.0 mo | revenue 4k", marketSignal: "Accounts are closing, but each one needs different handling.", tone: "amber" },
      { month: 5, label: "M5", decision: "Patch process complexity with more manual coordination.", rationale: "The system is still too varied to productize cleanly.", judgeSignal: "Judge flags scale friction as the primary blocker.", financeImpact: "Cash 61k | runway 4.8 mo | revenue 4k", marketSignal: "Customer value stays positive despite internal strain.", tone: "amber" },
      { month: 6, label: "M6", decision: "Experiment with internal templates to regain structure.", rationale: "Some standardization is needed before further growth.", judgeSignal: "Judge sees stabilization, not real leverage.", financeImpact: "Cash 59k | runway 4.7 mo | revenue 5k", marketSignal: "Customers still want the output, not the system.", tone: "amber" },
      { month: 7, label: "M7", decision: "Prune a few low-fit requests but keep broad service coverage.", rationale: "The founder wants to improve quality without sacrificing too much revenue.", judgeSignal: "Judge sees a partial recovery in operating clarity.", financeImpact: "Cash 57k | runway 4.5 mo | revenue 5k", marketSignal: "Quality improves, but the business still lacks a sharp core loop.", tone: "amber" },
      { month: 8, label: "M8", decision: "Add automation across multiple delivery branches.", rationale: "Automation is used as a catch-up move instead of a force multiplier.", judgeSignal: "Judge warns that complexity remains higher than the payoff.", financeImpact: "Cash 56k | runway 4.4 mo | revenue 5k", marketSignal: "Customers do not clearly reward the extra system complexity.", tone: "amber" },
      { month: 9, label: "M9", decision: "Keep the hybrid service-product model alive.", rationale: "The company can neither simplify fully nor scale decisively.", judgeSignal: "Judge labels the line operationally fragile.", financeImpact: "Cash 55k | runway 4.3 mo | revenue 6k", marketSignal: "Demand persists but does not strengthen enough.", tone: "amber" },
      { month: 10, label: "M10", decision: "Stabilize accounts rather than push for aggressive growth.", rationale: "The line now prioritizes survival over expansion.", judgeSignal: "Judge sees a plateau rather than a collapse.", financeImpact: "Cash 53k | runway 4.2 mo | revenue 6k", marketSignal: "Retention is acceptable, growth remains muted.", tone: "amber" },
      { month: 11, label: "M11", decision: "Refine the service mix and hold the best-fit customers.", rationale: "The company needs clarity, but not a hard reset.", judgeSignal: "Judge sees a useful business with limited compounding.", financeImpact: "Cash 52k | runway 4.1 mo | revenue 6k", marketSignal: "Customer love is not the bottleneck; repeatability is.", tone: "amber" },
      { month: 12, label: "M12", decision: "End the cycle without scaling until scope is narrowed further.", rationale: "The line remains exploratory because it never locked a clean operating loop.", judgeSignal: "Judge classifies Sigma as explore, not sustainable.", financeImpact: "Cash 51k | runway 4.1 mo | revenue 6k", marketSignal: "The wedge has value, but the business model still leaks complexity.", tone: "amber" },
    ],
  },
  "company-nova": {
    finalOutcome: "Dead",
    finalNarrative:
      "Company Nova is the classic losing worldline: it builds breadth before proof, mistakes activity for learning, and runs out of capital before the strategy becomes coherent.",
    successOrFailureReason:
      "Nova dies because product ambition compounds faster than pricing proof, market clarity, or revenue. By the time the founder tries to narrow, the runway is already gone.",
    judgeSummary: {
      headline: "Overbuild kills the line before demand can rescue it.",
      summary:
        "The judge agent attributes Nova's death to premature platform expansion, weak pricing validation, and a failure to choose one buyer and one use case early enough.",
      primaryCause: "Overbuild before pricing proof",
      counterfactual:
        "If Nova had sold a narrow manual outcome in month 1-2 instead of building a broad platform, it might have earned another strategic cycle.",
    },
    stageTimeline: [
      {
        stage: "Platform Ambition",
        startMonth: 1,
        endMonth: 2,
        summary: "The founder starts with a broad product vision instead of a single constrained wedge.",
        outcome: "Dead",
        tone: "amber",
      },
      {
        stage: "Signal Deficit",
        startMonth: 3,
        endMonth: 4,
        summary: "The company ships motion without earning clear demand or pricing proof.",
        outcome: "Dead",
        tone: "rose",
      },
      {
        stage: "Cash Collapse",
        startMonth: 5,
        endMonth: 6,
        summary: "Runway and founder energy both fall below recovery threshold.",
        outcome: "Dead",
        tone: "rose",
      },
      {
        stage: "Termination",
        startMonth: 7,
        endMonth: 12,
        summary: "The line is no longer viable under remaining constraints.",
        outcome: "Dead",
        tone: "rose",
      },
    ],
    keyEvents: [
      { month: 1, label: "M1", title: "Nova starts broad instead of narrow.", summary: "The first strategic move already points the line toward avoidable complexity.", category: "scope", tone: "amber" },
      { month: 3, label: "M3", title: "Weak revenue signal arrives too late and too small.", summary: "The company gets motion, but not real proof of a repeatable wedge.", category: "signal", tone: "rose" },
      { month: 5, label: "M5", title: "Runway collapses before the strategy corrects.", summary: "This is the terminal inflection point of the worldline.", category: "failure", tone: "rose" },
      { month: 6, label: "M6", title: "Judge marks the company non-recoverable.", summary: "Constraints now dominate every future branch of the simulation.", category: "judge", tone: "rose" },
      { month: 12, label: "M12", title: "Nova ends as a dead worldline.", summary: "The lesson is not that the idea was impossible, but that the strategy burned its learning window too early.", category: "outcome", tone: "rose" },
    ],
    monthlyLogs: [
      { month: 1, label: "M1", decision: "Start building a broad platform immediately.", rationale: "The founder assumes completeness will create demand faster than validation work.", judgeSignal: "Judge flags early strategic sprawl.", financeImpact: "Cash 72k | runway 6.0 mo | revenue 0k", marketSignal: "No meaningful demand signal yet.", tone: "amber" },
      { month: 2, label: "M2", decision: "Add more features instead of running pricing tests.", rationale: "The company confuses shipping motion with venture progress.", judgeSignal: "Judge sees weak learning relative to burn.", financeImpact: "Cash 61k | runway 5.1 mo | revenue 0k", marketSignal: "Interest exists, urgency does not.", tone: "rose" },
      { month: 3, label: "M3", decision: "Launch to a broad audience without a narrow promise.", rationale: "The founder tries to let the market pick the use case after build.", judgeSignal: "Judge marks the signal as noisy and under-differentiated.", financeImpact: "Cash 48k | runway 4.0 mo | revenue 1k", marketSignal: "Low conversion and unclear buyer identity.", tone: "rose" },
      { month: 4, label: "M4", decision: "Keep expanding product breadth to fix weak traction.", rationale: "The line responds to weak pull with more surface area.", judgeSignal: "Judge sees compounding strategic error.", financeImpact: "Cash 34k | runway 2.8 mo | revenue 1k", marketSignal: "The market still cannot describe what Nova is for.", tone: "rose" },
      { month: 5, label: "M5", decision: "Attempt a late positioning correction under cash stress.", rationale: "The founder finally tries to narrow, but too late.", judgeSignal: "Judge marks runway collapse as imminent.", financeImpact: "Cash 7k | runway 0.6 mo | revenue 1k", marketSignal: "There is insufficient time to validate a corrected wedge.", tone: "rose" },
      { month: 6, label: "M6", decision: "Freeze major operations as capital runs out.", rationale: "Recovery paths are gone once learning speed falls below burn speed.", judgeSignal: "Judge terminates the line.", financeImpact: "Cash 0k | runway 0 mo | revenue 0k", marketSignal: "No durable signal remains.", tone: "rose" },
      { month: 7, label: "M7", decision: "No viable next move remains.", rationale: "The company is now operating after strategic death.", judgeSignal: "Judge sees no recoverable branch.", financeImpact: "Cash 0k | runway 0 mo | revenue 0k", marketSignal: "The wedge never reached clear market legibility.", tone: "rose" },
      { month: 8, label: "M8", decision: "The system remains inactive.", rationale: "Post-collapse months serve only as replay evidence.", judgeSignal: "Line remains dead.", financeImpact: "Cash 0k | runway 0 mo | revenue 0k", marketSignal: "No active customer signal.", tone: "rose" },
      { month: 9, label: "M9", decision: "The system remains inactive.", rationale: "No new branch can form without capital or corrected structure.", judgeSignal: "Line remains dead.", financeImpact: "Cash 0k | runway 0 mo | revenue 0k", marketSignal: "No active customer signal.", tone: "rose" },
      { month: 10, label: "M10", decision: "The system remains inactive.", rationale: "The replay now exists to make the failure mechanics legible.", judgeSignal: "Line remains dead.", financeImpact: "Cash 0k | runway 0 mo | revenue 0k", marketSignal: "No active customer signal.", tone: "rose" },
      { month: 11, label: "M11", decision: "The system remains inactive.", rationale: "There is no second cycle without earlier discipline.", judgeSignal: "Line remains dead.", financeImpact: "Cash 0k | runway 0 mo | revenue 0k", marketSignal: "No active customer signal.", tone: "rose" },
      { month: 12, label: "M12", decision: "Worldline closes as a dead branch.", rationale: "The founder spent the learning window on breadth instead of proof.", judgeSignal: "Judge uses Nova as a failure reference case.", financeImpact: "Cash 0k | runway 0 mo | revenue 0k", marketSignal: "The final lesson is strategic, not merely financial.", tone: "rose" },
    ],
  },
};

function buildReplay(company: WorldlineCompany): WorldlineReplay {
  const override = manualReplayNarratives[company.id];

  if (override) {
    return {
      company,
      ...override,
    };
  }

  const finalOutcome = getFinalOutcome(company);

  return {
    company,
    finalOutcome,
    finalNarrative: getGenericReason(company, finalOutcome),
    successOrFailureReason: getGenericReason(company, finalOutcome),
    judgeSummary: getGenericJudgeSummary(company, finalOutcome),
    monthlyLogs: getGenericMonthlyLogs(company, finalOutcome),
    keyEvents: getGenericKeyEvents(company, finalOutcome),
    stageTimeline: getGenericStageTimeline(company, finalOutcome),
  };
}

export const worldlineReplayMap: Record<string, WorldlineReplay> = Object.fromEntries(
  worldlineCompanies.map((company) => [company.id, buildReplay(company)]),
);

export function getWorldlineReplay(companyId: string) {
  return worldlineReplayMap[companyId];
}

export function getWorldlineReplayIds() {
  return Object.keys(worldlineReplayMap);
}
