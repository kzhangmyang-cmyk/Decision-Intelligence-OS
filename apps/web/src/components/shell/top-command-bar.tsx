"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Play, Search } from "lucide-react";

import { currentProject } from "@/mock";
import { consoleNavItems, getConsolePageLabel } from "@/lib/navigation";
import { buttonVariants } from "@/components/ui/button";
import { StatusPill } from "@/components/shared/status-pill";
import { cn } from "@/lib/utils";

export function TopCommandBar() {
  const pathname = usePathname();

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-panel backdrop-blur-xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill tone="cyan">{getConsolePageLabel(pathname)}</StatusPill>
            <StatusPill tone="default">{currentProject.signal}</StatusPill>
            <StatusPill tone="default">{currentProject.status}</StatusPill>
          </div>
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-slate-500">Project context</div>
            <div className="mt-1 text-lg font-medium text-white">{currentProject.name}</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="hidden min-w-[16rem] items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-400 xl:flex">
            <Search className="h-4 w-4 text-cyan-200" />
            Search project state, reports, or company replays
          </div>
          <Link href="/simulation" className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "justify-center") }>
            <Play className="h-4 w-4" />
            Run Simulation
          </Link>
          <Link href="/planner" className={cn(buttonVariants({ size: "sm" }), "justify-center") }>
            <Download className="h-4 w-4" />
            Export Plan
          </Link>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {consoleNavItems.map((item) => {
          const active = item.isActive(pathname);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                active
                  ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
                  : "border-white/10 bg-white/[0.03] text-slate-300",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
