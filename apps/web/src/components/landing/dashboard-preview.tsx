import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, ArrowUpRight, Layers3, LineChart, Orbit } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  companyDistribution,
  survivalCurve,
  topInsights,
  trajectoryMetrics,
} from "@/mock";

const chartGrid = "rgba(148, 163, 184, 0.12)";

export function DashboardPreview() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr,0.8fr]">
      <Card className="overflow-hidden border-cyan-300/15 bg-slate-950/70">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-white/8 pb-5">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Simulation Overview</div>
            <CardTitle className="mt-2 text-2xl tracking-[-0.04em]">100 Parallel Worldlines</CardTitle>
          </div>
          <div className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
            replay-ready
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="space-y-4 rounded-[24px] border border-white/8 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Survival Curve</div>
                <div className="text-sm text-slate-400">
                  Runway, CAC, founder energy, and market noise across monthly heartbeats
                </div>
              </div>
              <LineChart className="h-4 w-4 text-cyan-200" />
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={survivalCurve} margin={{ left: -18, right: 8, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="survivalFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.34} />
                      <stop offset="95%" stopColor="#67e8f9" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={chartGrid} vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#7dd3fc", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip
                    cursor={{ stroke: "rgba(103,232,249,0.22)" }}
                    contentStyle={{
                      background: "rgba(2, 6, 23, 0.94)",
                      border: "1px solid rgba(103, 232, 249, 0.16)",
                      borderRadius: 16,
                      color: "#e2e8f0",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="survival"
                    stroke="#67e8f9"
                    strokeWidth={2}
                    fill="url(#survivalFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4 rounded-[24px] border border-white/8 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Founder Profiles</div>
                <div className="text-sm text-slate-400">Outcome distribution by operator pattern</div>
              </div>
              <Orbit className="h-4 w-4 text-cyan-200" />
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyDistribution} margin={{ left: -18, right: 8, top: 10, bottom: 0 }}>
                  <CartesianGrid stroke={chartGrid} vertical={false} />
                  <XAxis
                    dataKey="archetype"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                    contentStyle={{
                      background: "rgba(2, 6, 23, 0.94)",
                      border: "1px solid rgba(103, 232, 249, 0.16)",
                      borderRadius: 16,
                      color: "#e2e8f0",
                    }}
                  />
                  <Bar dataKey="wins" radius={[14, 14, 0, 0]} fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-4 lg:col-span-2 lg:grid-cols-3">
            {trajectoryMetrics.map((metric) => (
              <div key={metric.label} className="rounded-[22px] border border-white/8 bg-slate-900/75 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{metric.label}</div>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-3xl font-semibold tracking-[-0.05em] text-white">{metric.value}</div>
                    <div className="mt-1 text-sm text-slate-400">{metric.caption}</div>
                  </div>
                  <div className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                    {metric.delta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-white/10 bg-slate-950/70">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl tracking-[-0.04em]">Judge + Audit</CardTitle>
              <Layers3 className="h-4 w-4 text-cyan-200" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {topInsights.map((insight) => (
              <div key={insight.title} className="rounded-[22px] border border-white/8 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-medium text-white">{insight.title}</div>
                  <div className="rounded-full border border-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-400">
                    {insight.tag}
                  </div>
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-400">{insight.body}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-amber-300/15 bg-[linear-gradient(180deg,rgba(245,158,11,0.08),rgba(2,6,23,0.86))]">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-2 text-amber-200">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Stop-Loss Trigger</div>
                <div className="mt-2 text-sm leading-6 text-slate-300">
                  If CAC remains above payback after three pricing and ICP iterations, stop broad SMB
                  expansion and pivot into a narrower compliance wedge before runway compression becomes
                  irreversible.
                </div>
                <div className="mt-4 inline-flex items-center gap-1 text-sm text-amber-200">
                  View action plan
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
