import { ArrowUpRight, BrainCircuit, Gauge, Orbit, Radar, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";

const scoreBars = [81, 69, 76, 88, 61];

export function HeroCommandCenter() {
  return (
    <div className="relative mx-auto w-full max-w-[38rem]">
      <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-[90px]" />
      <div className="absolute inset-10 rounded-full border border-cyan-300/10" />
      <div className="absolute inset-20 rounded-full border border-cyan-300/10" />
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_30px_rgba(103,232,249,0.75)]" />

      <Card className="relative overflow-hidden border-cyan-300/20 bg-slate-950/75 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_28px_80px_rgba(2,12,27,0.72)]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.08),transparent_38%,transparent_65%,rgba(56,189,248,0.1))]" />
        <div className="relative space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Worldline Control</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                Astrolabe Decision Simulator
              </div>
            </div>
            <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
              Symbolic Replay
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.4fr,0.9fr]">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.26em] text-slate-400">
                <span>Signal Matrix</span>
                <BrainCircuit className="h-4 w-4 text-cyan-200" />
              </div>
              <div className="mt-5 flex items-end gap-3">
                <div>
                  <div className="text-5xl font-semibold tracking-[-0.08em] text-white">79</div>
                  <div className="mt-1 text-sm text-slate-400">Composite signal confidence</div>
                </div>
                <div className="mb-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                  timing 0.72
                </div>
              </div>

              <div className="mt-6 grid grid-cols-5 gap-2">
                {scoreBars.map((value, index) => (
                  <div key={value} className="space-y-2">
                    <div className="flex h-24 items-end rounded-2xl bg-slate-900/80 p-2">
                      <div
                        className="w-full rounded-xl bg-gradient-to-t from-cyan-500 via-sky-400 to-cyan-200 shadow-[0_0_20px_rgba(103,232,249,0.18)]"
                        style={{ height: `${value}%` }}
                      />
                    </div>
                    <div className="text-center font-mono text-[11px] text-slate-500">0{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400">100 Worldlines</div>
                    <div className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-white">12 phases</div>
                  </div>
                  <Orbit className="h-5 w-5 text-cyan-200" />
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>Signal clusters</span>
                    <span className="font-mono text-cyan-200">5 layers</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Replay mode</span>
                    <span className="font-mono text-cyan-200">phase-driven</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Judge layer</span>
                    <span className="font-mono text-cyan-200">active</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
                  <span>Action Pulse</span>
                  <Sparkles className="h-4 w-4 text-amber-200" />
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="flex items-start gap-3 rounded-2xl border border-cyan-300/12 bg-cyan-300/8 p-3">
                    <Gauge className="mt-0.5 h-4 w-4 text-cyan-200" />
                    <div>
                      <div className="font-medium text-white">Pause before acting on the first dramatic signal</div>
                      <div className="mt-1 text-slate-400">
                        Highest leverage move from the replayed worldline field
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Top judge verdict</span>
                    <span className="inline-flex items-center gap-1 text-cyan-200">
                      compare branches first
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              { label: "Assess", icon: Radar, value: "Signals, tension, confidence" },
              { label: "Simulate", icon: Orbit, value: "100 symbolic worldlines" },
              { label: "Act", icon: Gauge, value: "Timing notes, next moves" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3"
              >
                <item.icon className="h-4 w-4 text-cyan-200" />
                <div>
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  <div className="text-xs text-slate-400">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
