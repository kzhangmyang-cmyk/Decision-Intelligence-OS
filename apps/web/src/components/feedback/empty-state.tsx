import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { SearchX } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon: Icon = SearchX,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("rounded-[28px] border border-dashed border-white/12 bg-white/[0.02] p-8 text-center", className)}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-100">
        <Icon className="h-6 w-6" />
      </div>
      <div className="mt-5 text-xl font-semibold tracking-[-0.04em] text-white">{title}</div>
      <div className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">{description}</div>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
