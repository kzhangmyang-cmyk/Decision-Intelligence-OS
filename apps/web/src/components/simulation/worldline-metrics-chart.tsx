"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { WorldlineMonth } from "@/types/simulation";

type WorldlineMetricsChartProps = {
  data: WorldlineMonth[];
};

export function WorldlineMetricsChart({ data }: WorldlineMetricsChartProps) {
  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -18, right: 12, top: 10, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis yAxisId="money" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis
            yAxisId="energy"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            domain={[0, 100]}
          />
          <ReferenceLine yAxisId="money" y={0} stroke="rgba(148,163,184,0.28)" strokeDasharray="4 4" />
          <Tooltip
            contentStyle={{
              background: "rgba(2, 6, 23, 0.94)",
              border: "1px solid rgba(103, 232, 249, 0.16)",
              borderRadius: 16,
              color: "#e2e8f0",
            }}
          />
          <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
          <Line yAxisId="money" type="monotone" dataKey="cash" name="cash (k)" stroke="#67e8f9" strokeWidth={2.2} dot={false} />
          <Line yAxisId="money" type="monotone" dataKey="revenue" name="revenue (k)" stroke="#34d399" strokeWidth={2.2} dot={false} />
          <Line yAxisId="energy" type="monotone" dataKey="founderEnergy" name="founder energy" stroke="#f59e0b" strokeWidth={2.2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
