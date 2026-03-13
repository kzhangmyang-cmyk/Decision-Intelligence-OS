"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { DistributionPoint } from "@/types/simulation";

type SimulationDistributionChartProps = {
  data: DistributionPoint[];
};

export function SimulationDistributionChart({ data }: SimulationDistributionChartProps) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 6, top: 10, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.12)" horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis
            dataKey="label"
            type="category"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
            width={110}
          />
          <Tooltip
            formatter={(value: number) => [`${value} companies`, "count"]}
            contentStyle={{
              background: "rgba(2, 6, 23, 0.94)",
              border: "1px solid rgba(103, 232, 249, 0.16)",
              borderRadius: 16,
              color: "#e2e8f0",
            }}
          />
          <Bar dataKey="value" fill="#f97316" radius={[0, 10, 10, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
