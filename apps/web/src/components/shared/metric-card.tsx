import { Card, CardContent } from "@/components/ui/card";
import { StatusPill } from "@/components/shared/status-pill";
import type { ConsoleMetric } from "@/types/console";

type MetricCardProps = {
  metric: ConsoleMetric;
};

export function MetricCard({ metric }: MetricCardProps) {
  return (
    <Card className="border-white/10 bg-white/[0.03]">
      <CardContent className="p-5">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{metric.label}</div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <div className="text-3xl font-semibold tracking-[-0.05em] text-white">{metric.value}</div>
            <div className="mt-1 text-sm leading-6 text-slate-400">{metric.caption}</div>
          </div>
          {metric.delta ? <StatusPill tone={metric.tone}>{metric.delta}</StatusPill> : null}
        </div>
      </CardContent>
    </Card>
  );
}
