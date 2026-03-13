"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ComparisonPoint } from "@/types/simulation";

type SimulationComparisonChartProps = {
  data: ComparisonPoint[];
};

export function SimulationComparisonChart({ data }: SimulationComparisonChartProps) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -18, right: 6, top: 10, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              background: "rgba(2, 6, 23, 0.94)",
              border: "1px solid rgba(103, 232, 249, 0.16)",
              borderRadius: 16,
              color: "#e2e8f0",
            }}
          />
          <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
          <Bar dataKey="outcomeScore" name="Outcome score" fill="#38bdf8" radius={[10, 10, 0, 0]} />
          <Bar dataKey="survivalRate" name="Month-12 survival" fill="#34d399" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
