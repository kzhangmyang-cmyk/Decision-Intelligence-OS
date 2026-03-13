"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CircleDashed,
  Coins,
  FileUp,
  Layers3,
  Plus,
  Save,
  Sparkles,
  Target,
  Trash2,
  Users,
} from "lucide-react";

import { IntakeField } from "@/components/intake/intake-field";
import { IntakeSection } from "@/components/intake/intake-section";
import { PageHeader } from "@/components/shared/page-header";
import { StatusPill } from "@/components/shared/status-pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { decisionOsDataSource } from "@/lib/api-source";
import { defaultIntakeDraft } from "@/mock";
import type { IntakeAttachment, IntakeDraft } from "@/types/console";

const STORAGE_KEY = "dio-intake-draft";

const founderProfileOptions = [
  "Solo technical founder",
  "Solo commercial founder",
  "Hybrid founder",
  "Operator-led duo",
  "Research-led team",
];

const attachmentTypeOptions = ["link", "repo", "landing-page", "demo", "doc"];

const sectionLabels = [
  { id: "01", name: "Thesis" },
  { id: "02", name: "Business" },
  { id: "03", name: "Founder" },
  { id: "04", name: "Signal" },
];

function createAttachment(): IntakeAttachment {
  return {
    id: crypto.randomUUID(),
    type: "link",
    url: "",
    note: "",
  };
}

function getCompletionLabel(completed: number, total: number) {
  return `${completed}/${total} complete`;
}

function countFilled(values: string[]) {
  return values.filter((value) => value.trim().length > 0).length;
}

function saveDraftToStorage(draft: IntakeDraft) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

function loadDraftFromStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<IntakeDraft>;

    return {
      ...defaultIntakeDraft,
      ...parsed,
      supplementaryEvidence: Array.isArray(parsed.supplementaryEvidence)
        ? parsed.supplementaryEvidence
        : defaultIntakeDraft.supplementaryEvidence,
    };
  } catch {
    return null;
  }
}

export function IntakeWorkbench() {
  const router = useRouter();
  const [draft, setDraft] = useState<IntakeDraft>(defaultIntakeDraft);
  const [savedAt, setSavedAt] = useState<string>("not saved yet");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const storedDraft = loadDraftFromStorage();

    if (storedDraft) {
      setDraft(storedDraft);
      setSavedAt("loaded from draft");
    }
  }, []);

  const sectionProgress = useMemo(() => {
    const thesis = countFilled([
      draft.oneLiner,
      draft.targetCustomer,
      draft.corePain,
      draft.solution,
    ]);
    const business = countFilled([
      draft.businessModel,
      draft.pricing,
      draft.acquisitionChannels,
    ]);
    const founder = countFilled([draft.founderProfile, draft.teamSize, draft.budget]);
    const signal = countFilled([draft.traction, draft.competitors]) + (draft.supplementaryEvidence.length > 0 ? 1 : 0);

    return {
      thesis,
      business,
      founder,
      signal,
    };
  }, [draft]);

  const totalCompleted = useMemo(() => {
    return countFilled([
      draft.oneLiner,
      draft.targetCustomer,
      draft.corePain,
      draft.solution,
      draft.businessModel,
      draft.pricing,
      draft.acquisitionChannels,
      draft.founderProfile,
      draft.teamSize,
      draft.budget,
      draft.traction,
      draft.competitors,
    ]) + (draft.supplementaryEvidence.length > 0 ? 1 : 0);
  }, [draft]);

  const progress = Math.round((totalCompleted / 13) * 100);

  const evidenceCountByType = useMemo(() => {
    return draft.supplementaryEvidence.reduce<Record<string, number>>((accumulator, item) => {
      accumulator[item.type] = (accumulator[item.type] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [draft.supplementaryEvidence]);

  function updateField<K extends keyof IntakeDraft>(field: K, value: IntakeDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function updateAttachment(id: string, field: keyof IntakeAttachment, value: string) {
    setDraft((current) => ({
      ...current,
      supplementaryEvidence: current.supplementaryEvidence.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function addAttachment() {
    setDraft((current) => ({
      ...current,
      supplementaryEvidence: [...current.supplementaryEvidence, createAttachment()],
    }));
  }

  function removeAttachment(id: string) {
    setDraft((current) => ({
      ...current,
      supplementaryEvidence: current.supplementaryEvidence.filter((item) => item.id !== id),
    }));
  }

  function handleSaveDraft() {
    saveDraftToStorage(draft);
    setSavedAt(`saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
  }

  async function handleSubmit() {
    saveDraftToStorage(draft);
    setSubmitting(true);
    setSubmitError(null);

    try {
      const scenario = await decisionOsDataSource.createScenario(draft);
      await decisionOsDataSource.triggerAssessment(scenario.id);
      setSavedAt(`submitted ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
      router.push(`/report?scenarioId=${scenario.id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit scenario.");
      setSavedAt("submission failed");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Project Intake"
        title="Translate the product thesis into a structured simulation input."
        description="This intake is designed like a scenario workbench, not a dead admin form. Capture the thesis, audience, business model, execution reality, and validation signal in a format the engine can score and simulate later."
        badge={`${progress}% signal readiness`}
        actions={
          <>
            <Button variant="secondary" size="lg" onClick={handleSaveDraft}>
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button size="lg" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <CircleDashed className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {submitting ? "Submitting" : "Submit to Simulator"}
            </Button>
          </>
        }
      />

      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-panel backdrop-blur-xl">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Intake Progress</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">{progress}% complete</div>
            <div className="mt-2 text-sm text-slate-400">{savedAt}</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {sectionLabels.map((section, index) => {
              const values = [sectionProgress.thesis, sectionProgress.business, sectionProgress.founder, sectionProgress.signal];
              const totals = [4, 3, 3, 3];
              const completed = values[index] ?? 0;
              const total = totals[index] ?? 1;
              const done = completed === total;

              return (
                <div
                  key={section.id}
                  className="rounded-[22px] border border-white/10 bg-slate-950/70 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{section.id}</div>
                    {done ? <Check className="h-4 w-4 text-emerald-300" /> : <CircleDashed className="h-4 w-4 text-slate-500" />}
                  </div>
                  <div className="mt-3 text-sm font-medium text-white">{section.name}</div>
                  <div className="mt-1 text-xs text-slate-400">{getCompletionLabel(completed, total)}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-900/80">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.55),rgba(56,189,248,0.95),rgba(244,244,245,0.9))]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {submitError ? (
        <div className="rounded-[24px] border border-rose-300/15 bg-rose-300/[0.08] px-5 py-4 text-sm text-rose-100">
          {submitError}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.15fr,0.85fr]">
        <div className="space-y-4">
          <IntakeSection
            index="01"
            title="Startup Thesis"
            description="Define what this project is, who it serves, and what pain it is actually trying to remove."
            completionLabel={getCompletionLabel(sectionProgress.thesis, 4)}
          >
            <IntakeField label="Project codename" hint="Optional, but helpful for organizing the venture inside the system.">
              <Input
                value={draft.projectName}
                onChange={(event) => updateField("projectName", event.target.value)}
                placeholder="Astrological Decision Simulator"
              />
            </IntakeField>

            <IntakeField label="1. One-line description" hint="What is this startup in one sharp sentence?">
              <Textarea
                value={draft.oneLiner}
                onChange={(event) => updateField("oneLiner", event.target.value)}
                placeholder="A decision operating system that helps founders judge, simulate, and act before they overbuild."
                className="min-h-[110px]"
              />
            </IntakeField>

            <div className="grid gap-6 lg:grid-cols-2">
              <IntakeField label="2. Target customer" hint="Who experiences this pain most intensely right now?">
                <Textarea
                  value={draft.targetCustomer}
                  onChange={(event) => updateField("targetCustomer", event.target.value)}
                  placeholder="AI founders, solo operators, and 2-10 person teams deciding whether a niche is worth building for."
                  className="min-h-[140px]"
                />
              </IntakeField>

              <IntakeField label="3. Core pain" hint="What high-cost uncertainty or failure mode are they facing?">
                <Textarea
                  value={draft.corePain}
                  onChange={(event) => updateField("corePain", event.target.value)}
                  placeholder="They often build before they know whether the market is real, urgent, or monetizable."
                  className="min-h-[140px]"
                />
              </IntakeField>
            </div>

            <IntakeField label="4. Solution" hint="Describe the proposed product or wedge clearly and concretely.">
              <Textarea
                value={draft.solution}
                onChange={(event) => updateField("solution", event.target.value)}
                placeholder="Structure evidence, score feasibility, simulate 100 constrained company worldlines, and output an action plan."
              />
            </IntakeField>
          </IntakeSection>

          <IntakeSection
            index="02"
            title="Business Design"
            description="Capture how the startup makes money and how it expects to reach the first customers."
            completionLabel={getCompletionLabel(sectionProgress.business, 3)}
          >
            <IntakeField label="5. Business model / charging model" hint="How do you intend to make money in V1?">
              <Textarea
                value={draft.businessModel}
                onChange={(event) => updateField("businessModel", event.target.value)}
                placeholder="Paid pilots first, then subscription for ongoing strategic use and replay access."
                className="min-h-[110px]"
              />
            </IntakeField>

            <div className="grid gap-6 lg:grid-cols-2">
              <IntakeField label="6. Pricing" hint="What price or price range are you considering?">
                <Textarea
                  value={draft.pricing}
                  onChange={(event) => updateField("pricing", event.target.value)}
                  placeholder="$500-$2,000 pilot, then recurring subscription depending on team and usage."
                  className="min-h-[120px]"
                />
              </IntakeField>

              <IntakeField label="7. Acquisition channels" hint="How do you expect to get the first qualified users or buyers?">
                <Textarea
                  value={draft.acquisitionChannels}
                  onChange={(event) => updateField("acquisitionChannels", event.target.value)}
                  placeholder="Founder-led outreach, communities, referrals, niche landing pages, and content."
                  className="min-h-[120px]"
                />
              </IntakeField>
            </div>
          </IntakeSection>

          <IntakeSection
            index="03"
            title="Founder Reality"
            description="The system needs the real execution envelope, not just the dream version of the startup."
            completionLabel={getCompletionLabel(sectionProgress.founder, 3)}
          >
            <div className="grid gap-6 lg:grid-cols-[0.8fr,0.4fr,0.4fr]">
              <IntakeField label="8. Founder profile" hint="Who is driving this and what advantage do they have?">
                <div className="space-y-3">
                  <Select
                    value={founderProfileOptions.includes(draft.founderProfile) ? draft.founderProfile : "Custom"}
                    onChange={(event) => {
                      if (event.target.value !== "Custom") {
                        updateField("founderProfile", event.target.value);
                      }
                    }}
                  >
                    {founderProfileOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                    <option value="Custom">Custom founder profile</option>
                  </Select>
                  <Textarea
                    value={draft.founderProfile}
                    onChange={(event) => updateField("founderProfile", event.target.value)}
                    placeholder="Hybrid founder with strong product taste and willingness to sell manually before building deeper."
                    className="min-h-[130px]"
                  />
                </div>
              </IntakeField>

              <IntakeField label="9. Team size" hint="Include founder(s) and active operators.">
                <Input
                  value={draft.teamSize}
                  onChange={(event) => updateField("teamSize", event.target.value)}
                  placeholder="3"
                />
              </IntakeField>

              <IntakeField label="10. Budget" hint="Use current usable capital, not optimistic future funding.">
                <Input
                  value={draft.budget}
                  onChange={(event) => updateField("budget", event.target.value)}
                  placeholder="68000"
                />
              </IntakeField>
            </div>
          </IntakeSection>

          <IntakeSection
            index="04"
            title="Validation Signal"
            description="Feed the engine with real traction, competition context, and supporting artifacts it can later reference."
            completionLabel={getCompletionLabel(sectionProgress.signal, 3)}
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <IntakeField label="11. Traction / validation" hint="What have you already tested, learned, or shipped?">
                <Textarea
                  value={draft.traction}
                  onChange={(event) => updateField("traction", event.target.value)}
                  placeholder="Interviews, pilots, signups, waitlist, usage, or any real validation signal."
                  className="min-h-[150px]"
                />
              </IntakeField>

              <IntakeField label="12. Competitors" hint="Who else are users comparing this against today?">
                <Textarea
                  value={draft.competitors}
                  onChange={(event) => updateField("competitors", event.target.value)}
                  placeholder="AI planning copilots, startup analytics dashboards, generic strategy tools, consultants, or spreadsheets."
                  className="min-h-[150px]"
                />
              </IntakeField>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-white">13. Supplementary evidence</div>
                  <div className="mt-1 text-sm leading-6 text-slate-400">
                    Add links, repos, landing pages, demos, docs, or anything the future API can store as typed evidence.
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={addAttachment}>
                  <Plus className="h-4 w-4" />
                  Add Evidence
                </Button>
              </div>

              <div className="space-y-4">
                {draft.supplementaryEvidence.map((attachment, index) => (
                  <div
                    key={attachment.id}
                    className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(15,23,42,0.72),rgba(2,6,23,0.9))] p-4"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Evidence #{index + 1}</div>
                      <Button variant="ghost" size="sm" onClick={() => removeAttachment(attachment.id)}>
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-[0.32fr,0.68fr]">
                      <IntakeField label="Type">
                        <Select
                          value={attachment.type}
                          onChange={(event) => updateAttachment(attachment.id, "type", event.target.value)}
                        >
                          {attachmentTypeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Select>
                      </IntakeField>
                      <IntakeField label="URL / resource path">
                        <Input
                          value={attachment.url}
                          onChange={(event) => updateAttachment(attachment.id, "url", event.target.value)}
                          placeholder="https://..."
                        />
                      </IntakeField>
                    </div>
                    <IntakeField label="Why this matters" className="mt-4">
                      <Textarea
                        value={attachment.note}
                        onChange={(event) => updateAttachment(attachment.id, "note", event.target.value)}
                        placeholder="Explain what signal this artifact provides and why the judge layer should care."
                        className="min-h-[110px]"
                      />
                    </IntakeField>
                  </div>
                ))}
              </div>
            </div>
          </IntakeSection>
        </div>

        <div className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-[28px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(34,211,238,0.12),rgba(2,6,23,0.82))] p-5 shadow-[0_0_0_1px_rgba(103,232,249,0.08),0_20px_70px_rgba(2,12,27,0.45)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Decision Engine Readiness</div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">structured intake snapshot</div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                  <Layers3 className="h-4 w-4 text-cyan-200" />
                  coverage
                </div>
                <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">{totalCompleted}/13</div>
                <div className="mt-1 text-sm text-slate-400">core modules filled</div>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                  <FileUp className="h-4 w-4 text-cyan-200" />
                  artifacts
                </div>
                <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">
                  {draft.supplementaryEvidence.length}
                </div>
                <div className="mt-1 text-sm text-slate-400">attached evidence items</div>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                  <Target className="h-4 w-4 text-cyan-200" />
                  next signal
                </div>
                <div className="mt-3 text-lg font-medium text-white">Pricing proof</div>
                <div className="mt-1 text-sm text-slate-400">still the highest-leverage missing variable</div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-panel backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Structured Preview</div>
            <div className="mt-4 space-y-4">
              {[
                { label: "One-liner", value: draft.oneLiner },
                { label: "Target customer", value: draft.targetCustomer },
                { label: "Core pain", value: draft.corePain },
                { label: "Solution", value: draft.solution },
              ].map((item) => (
                <div key={item.label} className="rounded-[22px] border border-white/8 bg-white/[0.02] p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.label}</div>
                  <div className="mt-3 text-sm leading-6 text-slate-200">
                    {item.value || "Waiting for input..."}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-panel backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Constraint Snapshot</div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {[
                { icon: Users, label: "Team", value: `${draft.teamSize || "-"} active operators` },
                { icon: Coins, label: "Budget", value: draft.budget ? `$${draft.budget}` : "not set" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-[22px] border border-white/8 bg-white/[0.02] p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-100">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.label}</div>
                    <div className="mt-2 text-sm text-white">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-panel backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Evidence Mix</div>
              <StatusPill tone="default">ready for API mapping</StatusPill>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(evidenceCountByType).length > 0 ? (
                Object.entries(evidenceCountByType).map(([type, count]) => (
                  <StatusPill key={type} tone="cyan" className="capitalize">
                    {type} x {count}
                  </StatusPill>
                ))
              ) : (
                <StatusPill tone="default">no evidence attached yet</StatusPill>
              )}
            </div>
            <div className="mt-4 rounded-[22px] border border-white/8 bg-white/[0.02] p-4 text-sm leading-6 text-slate-400">
              Each evidence item is already stored in a typed structure with `type`, `url`, and `note`
              fields, so it can be posted directly to a future FastAPI endpoint.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
