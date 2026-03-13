import { LoaderCircle, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type LoadingStateProps = {
  title?: string;
  description?: string;
  fullScreen?: boolean;
  className?: string;
};

export function LoadingState({
  title = "Loading decision state",
  description = "Preparing the next layer of the operating system.",
  fullScreen = false,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        fullScreen ? "min-h-screen px-6 py-16" : "min-h-[280px] rounded-[28px] border border-white/10 bg-slate-950/60 p-8",
        className,
      )}
    >
      <div className="relative max-w-md text-center">
        <div className="absolute inset-x-10 top-4 h-32 rounded-full bg-cyan-300/10 blur-[70px]" />
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
          <LoaderCircle className="h-7 w-7 animate-spin" />
        </div>
        <div className="relative mt-6 text-xl font-semibold tracking-[-0.04em] text-white">{title}</div>
        <div className="relative mt-3 text-sm leading-6 text-slate-400">{description}</div>
        <div className="relative mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
          initializing strategic console
        </div>
      </div>
    </div>
  );
}
