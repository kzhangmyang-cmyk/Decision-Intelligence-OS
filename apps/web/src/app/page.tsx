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
    title: "Decision Intelligence Engine",
    label: "Assess",
    description:
      "把 idea、证据、约束和创始人条件压成结构化判断，输出 Viability Score、Data Sufficiency、Confidence、风险与杠杆。",
  },
  {
    icon: Radar,
    title: "100 Parallel Worldlines",
    label: "Simulate",
    description:
      "围绕同一个创业方向生成 100 家虚拟公司，在预算、runway、创始人精力、交付能力和单位经济约束下按月运行。",
  },
  {
    icon: Compass,
    title: "DecisionOS Planner",
    label: "Act",
    description:
      "把评分和世界线结果转成 Day 1 到 Month 6 的行动序列，明确关键指标、Next Best Experiment 和止损条件。",
  },
];

const architectureBlocks = [
  {
    title: "MiroFish 主链路",
    body: "世界建模 -> 角色生成 -> 多公司仿真 -> 报告与回放，把 idea 压成可演化的世界模型。",
  },
  {
    title: "Paperclip 控制平面",
    body: "Org chart、heartbeat、budget、audit log、multi-company isolation，让仿真遵守经营约束，而不是自由聊天。",
  },
  {
    title: "OS2.0 判断层",
    body: "评分系统、数据充分度、置信度、风险识别、杠杆识别和 Next Best Experiment 先于深度仿真发生。",
  },
];

const workflow = [
  {
    step: "01",
    title: "Assess",
    body: "先判断这件事现在值不值得做，而不是靠主观热情开工。",
  },
  {
    step: "02",
    title: "Simulate",
    body: "再让 100 条平行世界线在不同 founder 类型、渠道、价格和市场噪声中跑起来。",
  },
  {
    step: "03",
    title: "Act",
    body: "最后只保留最值得执行的动作、指标、实验顺序和止损点。",
  },
];

const audiences = [
  {
    icon: Target,
    title: "AI 创业者",
    body: "方向很多、资源很少时，更需要高密度判断，而不是泛泛的创业建议。",
  },
  {
    icon: Binary,
    title: "一人公司",
    body: "把有限时间和现金压到胜率更高的路径上，避免在低概率方向上消耗数月。",
  },
  {
    icon: Users,
    title: "2-10 人团队",
    body: "在产品、GTM、预算分配之间建立统一决策语言，减少拍脑袋推进。",
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
              <div className="font-medium text-white">Decision Intelligence OS</div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                startup decision operating system
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
                把创业的不确定性，压缩成可判断、可仿真、可执行的决策系统。
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                先判断一个 idea 当前值不值得做，再让 100 家虚拟公司在同一市场里按月运行，
                最后只输出最值得执行的实验、动作和止损条件。Decision Intelligence OS
                不是聊天助手，而是创业决策引擎、世界线仿真器和行动规划器。
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
                ["78/100", "viability signal"],
                ["100", "virtual companies"],
                ["Monthly", "heartbeat replay"],
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
          title="融合 MiroFish、Paperclip 和 OS2.0，不再是泛化的创业助手。"
          description="产品主张很直接：先建立世界模型，再在硬约束里跑 100 条世界线，最后只输出值得执行的判断和动作。"
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
          title="从结构化判断，到世界线仿真，再到行动规划。"
          description="这三个模块不是孤立页面，而是一条连续的创业决策链路。先判断，再仿真，最后行动。"
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
          title="像控制平面一样查看评分、世界线结果和下一步动作。"
          description="首页预览展示的是系统如何把创业问题转成一组持续更新的决策界面：评分、风险、世界线分布、Judge 解释层和动作建议。"
        />
        <div className="mt-10">
          <DashboardPreview />
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-6 py-20 md:px-8">
        <SectionHeading
          eyebrow="Workflow"
          title="Assess -&gt; Simulate -&gt; Act"
          description="不是先做产品再找解释，而是先做判断，再跑世界线，最后把资源压到最有胜率的动作上。"
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
          title="为需要快速判断、快速验证、快速止损的人而设计。"
          description="如果你没有大公司预算，也没有长周期容错空间，你更需要的是一个决策操作系统，而不是一个只会陪你聊天的框。"
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
                  把你的创业想法放进系统，先判断，再仿真，再行动。
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                  从第一条证据开始建立结构化判断，让每一步资源投入都更像计算，而不是赌运气。
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-end">
                <Link href="/intake" className={buttonVariants({ size: "lg" })}>
                  Create First Project
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
