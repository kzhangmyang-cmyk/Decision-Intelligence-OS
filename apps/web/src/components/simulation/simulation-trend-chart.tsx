"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TrendPoint } from "@/types/simulation";

type SimulationTrendChartProps = {
  data: TrendPoint[];
  variant: "survival" | "profitability";
};

const tooltipStyle = {
  background: "rgba(2, 6, 23, 0.94)",
  border: "1px solid rgba(103, 232, 249, 0.16)",
  borderRadius: 16,
  color: "#e2e8f0",
};

export function SimulationTrendChart({ data, variant }: SimulationTrendChartProps) {
  if (variant === "survival") {
    return (
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -18, right: 6, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="simulationSurvivalFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#67e8f9" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[0, 100]} />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "survival rate"]}
              contentStyle={tooltipStyle}
              cursor={{ stroke: "rgba(103,232,249,0.18)" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#67e8f9"
              strokeWidth={2.4}
              fill="url(#simulationSurvivalFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -18, right: 6, top: 10, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[-50, 40]} />
          <ReferenceLine y={0} stroke="rgba(148,163,184,0.28)" strokeDasharray="4 4" />
          <Tooltip
            formatter={(value: number) => [`${value}%`, "profitability"]}
            contentStyle={tooltipStyle}
            cursor={{ stroke: "rgba(16,185,129,0.18)" }}
          />
          <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2.4} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
