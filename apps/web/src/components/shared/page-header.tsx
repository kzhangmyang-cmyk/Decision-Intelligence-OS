import type { ReactNode } from "react";

import { StatusPill } from "@/components/shared/status-pill";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  badgeTone?: "default" | "cyan" | "amber" | "emerald" | "rose";
  actions?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  badgeTone = "cyan",
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-panel backdrop-blur-xl lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">{eyebrow}</div>
          {badge ? <StatusPill tone={badgeTone}>{badge}</StatusPill> : null}
        </div>
        <h1 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white md:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
