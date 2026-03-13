import { cn } from "@/lib/utils";
import { StatusPill } from "@/components/shared/status-pill";
import type { SignalTone } from "@/types/console";

type WorldlineStateCardProps = {
  label: string;
  value: string;
  caption: string;
  tone?: SignalTone;
  className?: string;
};

export function WorldlineStateCard({
  label,
  value,
  caption,
  tone = "default",
  className,
}: WorldlineStateCardProps) {
  return (
    <div className={cn("rounded-[24px] border border-white/10 bg-white/[0.03] p-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</div>
        <StatusPill tone={tone}>{caption}</StatusPill>
      </div>
      <div className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-white">{value}</div>
    </div>
  );
}
