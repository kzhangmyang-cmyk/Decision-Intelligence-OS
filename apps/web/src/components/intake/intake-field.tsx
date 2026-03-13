import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type IntakeFieldProps = {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

export function IntakeField({ label, hint, className, children }: IntakeFieldProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-white">{label}</label>
        {hint ? <p className="text-sm leading-6 text-slate-400">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}
