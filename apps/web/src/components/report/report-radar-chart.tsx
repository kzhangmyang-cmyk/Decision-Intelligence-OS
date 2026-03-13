"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import type { ScoreBreakdown } from "@/types/console";

type ReportRadarChartProps = {
  breakdown: ScoreBreakdown[];
};

function shortLabel(label: string) {
  switch (label) {
    case "Market pain":
      return "Pain";
    case "Customer urgency":
      return "Urgency";
    case "Founder fit":
      return "Founder";
    case "Unit economics":
      return "Economics";
    default:
      return label;
  }
}

export function ReportRadarChart({ breakdown }: ReportRadarChartProps) {
  const data = breakdown.map((item) => ({
    ...item,
    axisLabel: shortLabel(item.label),
  }));

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr] xl:items-center">
      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="68%">
            <PolarGrid stroke="rgba(148,163,184,0.14)" />
            <PolarAngleAxis
              dataKey="axisLabel"
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickCount={5}
              axisLine={false}
            />
            <Radar
              name="Viability"
              dataKey="score"
              stroke="#67e8f9"
              fill="#22d3ee"
              fillOpacity={0.18}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-3">
        {breakdown.map((item) => (
          <div key={item.label} className="rounded-[22px] border border-white/8 bg-white/[0.02] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-white">{item.label}</div>
                <div className="mt-1 text-sm leading-6 text-slate-400">{item.note}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-white">{item.score}</div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">confidence {item.confidence}</div>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-900/80">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.4),rgba(56,189,248,0.95))]"
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
