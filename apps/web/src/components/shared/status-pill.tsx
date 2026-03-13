import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { SignalTone } from "@/types/console";

const toneClasses: Record<SignalTone, string> = {
  default: "border-white/10 bg-white/[0.04] text-slate-300",
  cyan: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
  amber: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  emerald: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  rose: "border-rose-300/20 bg-rose-300/10 text-rose-100",
};

type StatusPillProps = {
  children: ReactNode;
  tone?: SignalTone;
  className?: string;
};

export function StatusPill({ children, tone = "default", className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.24em]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
