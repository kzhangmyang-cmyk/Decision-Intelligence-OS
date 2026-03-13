"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = "Something broke in the console",
  description = "The interface hit an unexpected state. Retry the operation or return to a known page.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("rounded-[28px] border border-rose-300/15 bg-rose-300/[0.06] p-8 text-center", className)}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-300/10 text-rose-100">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <div className="mt-5 text-xl font-semibold tracking-[-0.04em] text-white">{title}</div>
      <div className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-300">{description}</div>
      {onRetry ? (
        <div className="mt-6 flex justify-center">
          <Button variant="secondary" onClick={onRetry}>
            <RotateCcw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      ) : null}
    </div>
  );
}
