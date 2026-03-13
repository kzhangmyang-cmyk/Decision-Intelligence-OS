"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Binary,
  BrainCircuit,
  ChartColumnIncreasing,
  Compass,
  Radar,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { HeroCommandCenter } from "@/components/landing/hero-command-center";
import { SectionHeading } from "@/components/landing/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const capabilityCards = [
  {
    icon: BrainCircuit,
    title: "Signal Mapping Layer",
    label: "Assess",
    description:
      "Turn a question, chart notes, symbolic evidence, and constraints into a structured signal map the engine can reason about.",
  },
  {
    icon: Radar,
    title: "100 Astrological Worldlines",
    label: "Simulate",
    description:
      "Run 100 symbolic branches of the same scenario with different archetype emphasis, timing bias, and interpretation drift.",
  },
  {
    icon: Compass,
    title: "Replayable Guidance",
    label: "Act",
    description:
      "Convert the strongest and weakest branches into next questions, timing windows, action paths, and stop-loss notes.",
  },
];

const architectureBlocks = [
  {
    title: "Symbolic Modeling",
    body: "Structure the question first so the simulator can inspect signals instead of reacting to free-form prompts.",
  },
  {
    title: "Worldline Engine",
    body: "The same scenario branches into 100 constrained paths rather than collapsing into one definitive reading.",
  },
  {
    title: "Replay + Guidance",
    body: "Every path is inspectable, replayable, and convertible into concrete next moves rather than abstract interpretation alone.",
  },
];

const workflow = [
  {
    step: "01",
    title: "Assess",
    body: "Map the symbolic inputs clearly before jumping to interpretation.",
  },
  {
    step: "02",
    title: "Simulate",
    body: "Compare 100 possible paths instead of anchoring on a single reading too early.",
  },
  {
    step: "03",
    title: "Act",
    body: "Turn the strongest signal patterns into next steps, timing notes, and caution flags.",
  },
];

const audiences = [
  {
    icon: Target,
    title: "Astrologers",
    body: "Use a structured replay layer when a client question has too many symbolic branches to trust one linear read.",
  },
  {
    icon: Binary,
    title: "Symbolic Researchers",
    body: "Inspect how timing, archetypes, and interpretation bias alter the shape of a possible path.",
  },
  {
    icon: Users,
    title: "Decision Makers",
    body: "Compare scenario paths when a choice feels timing-sensitive, emotionally noisy, or symbolically complex.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-8 md:px-8 md:pb-28 md:pt-12">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium text-white">Astrological Decision Simulator</div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                symbolic worldline engine
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
            <a href="#capabilities" className="transition-colors hover:text-white">
              Capabilities
            </a>
            <a href="#workflow" className="transition-colors hover:text-white">
              Workflow
            </a>
            <a href="#audience" className="transition-colors hover:text-white">
              Audience
            </a>
          </div>
        </div>

        <div className="mt-16 grid items-center gap-14 xl:grid-cols-[1.05fr,0.95fr]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="relative z-10 space-y-8"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-cyan-100"
            >
              Assess -&gt; Simulate -&gt; Act
            </motion.div>
            <motion.div variants={fadeUp} className="space-y-6">
              <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-[-0.08em] text-white md:text-6xl xl:text-7xl">
                Compare symbolic paths before you commit to one interpretation.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                Astrological Decision Simulator structures the question, simulates 100 worldlines, and
                turns symbolic uncertainty into replayable action paths. It is built for moments when one
                reading is not enough and the real task is comparing branches with discipline.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-col gap-4 sm:flex-row">
              <Link href="/intake" className={buttonVariants({ size: "lg" })}>
                Start Assessment
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#dashboard-preview"
                className={buttonVariants({ size: "lg", variant: "secondary" })}
              >
                Explore Dashboard
                <ChartColumnIncreasing className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-3">
              {[
                ["100", "symbolic worldlines"],
                ["12", "replay phases"],
                ["Replay", "judgeable paths"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 backdrop-blur-xl"
                >
                  <div className="text-2xl font-semibold tracking-[-0.06em] text-white">{value}</div>
                  <div className="mt-1 text-sm uppercase tracking-[0.22em] text-slate-500">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.18 }}
            className="relative"
          >
            <HeroCommandCenter />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-8">
        <SectionHeading
          eyebrow="Architecture"
          title="A symbolic simulator, not a one-shot horoscope interface."
          description="The product thesis is simple: structure the signal field, branch the scenario into multiple worldlines, then convert the replay into a better next move."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {architectureBlocks.map((item, index) => (
            <Card key={item.title} className="border-white/10 bg-white/[0.03]">
              <CardContent className="p-6">
                <div className="text-mono text-xs uppercase tracking-[0.28em] text-cyan-200/70">
                  0{index + 1}
                </div>
                <div className="mt-4 text-lg font-medium text-white">{item.title}</div>
                <p className="mt-4 text-lg leading-8 text-slate-200">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="capabilities" className="mx-auto max-w-7xl px-6 py-20 md:px-8">
        <SectionHeading
          eyebrow="Core Capabilities"
          title="From signal mapping, to worldline simulation, to guidance."
          description="These modules are not isolated pages. They are one continuous loop: assess the symbolic field, simulate the branches, then act with more clarity."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {capabilityCards.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <Card className="group relative h-full overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.88))] transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:shadow-glow">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.12),_transparent_32%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-100">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="text-mono text-xs uppercase tracking-[0.28em] text-slate-500">
                      {item.label}
                    </div>
                  </div>
                  <CardTitle className="pt-4 text-2xl tracking-[-0.05em]">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative pt-0 text-base leading-7 text-slate-300">
                  {item.description}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="dashboard-preview" className="mx-auto max-w-7xl px-6 py-20 md:px-8">
        <SectionHeading
          eyebrow="Dashboard Preview"
          title="Read the symbolic field like a control plane, not a feed of disconnected interpretations."
          description="The preview shows how the product combines signal confidence, path divergence, judge notes, and next guidance in one replayable interface."
        />
        <div className="mt-10">
          <DashboardPreview />
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-6 py-20 md:px-8">
        <SectionHeading
          eyebrow="Workflow"
          title="Assess -&gt; Simulate -&gt; Act"
          description="Do not jump from raw symbolism to conclusions. First structure the signal, then inspect the branches, then decide what deserves action."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {workflow.map((item, index) => (
            <Card key={item.step} className="relative overflow-hidden border-white/10 bg-white/[0.03]">
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-cyan-400/0 via-cyan-300/80 to-cyan-400/0" />
              <CardHeader>
                <div className="text-mono text-xs uppercase tracking-[0.28em] text-cyan-200/70">
                  {item.step}
                </div>
                <CardTitle className="text-2xl tracking-[-0.05em]">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-base leading-7 text-slate-300">{item.body}</CardContent>
              {index < workflow.length - 1 ? (
                <div className="pointer-events-none absolute right-[-18px] top-1/2 hidden h-px w-9 -translate-y-1/2 bg-gradient-to-r from-cyan-300/60 to-transparent lg:block" />
              ) : null}
            </Card>
          ))}
        </div>
      </section>

      <section id="audience" className="mx-auto max-w-7xl px-6 py-20 md:px-8">
        <SectionHeading
          eyebrow="Built For"
          title="Made for readers who want structure, replay, and comparison."
          description="If a decision feels symbolically dense or timing-sensitive, this system is designed to slow interpretation down and make the branches legible."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {audiences.map((item) => (
            <Card key={item.title} className="border-white/10 bg-white/[0.03]">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 text-cyan-200">
                  <item.icon className="h-5 w-5" />
                </div>
                <CardTitle className="pt-4 text-2xl tracking-[-0.05em]">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-base leading-7 text-slate-300">{item.body}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28 pt-12 md:px-8">
        <Card className="overflow-hidden border-cyan-300/20 bg-[linear-gradient(135deg,rgba(8,47,73,0.75),rgba(2,6,23,0.92))] panel-highlight">
          <CardContent className="relative p-8 md:p-12">
            <div className="absolute right-[-4rem] top-[-4rem] h-48 w-48 rounded-full bg-cyan-300/10 blur-[80px]" />
            <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr] lg:items-end">
              <div>
                <div className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-cyan-100">
                  Ready to Start
                </div>
                <h2 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">
                  Put the question into the system. Assess it. Simulate it. Replay it.
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                  The goal is not to force certainty. The goal is to compare possible paths with more discipline than instinct alone can provide.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-end">
                <Link href="/intake" className={buttonVariants({ size: "lg" })}>
                  Create First Scenario
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="#workflow" className={buttonVariants({ size: "lg", variant: "secondary" })}>
                  See How It Works
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
