"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Binary, Sparkles } from "lucide-react";

import { currentProject } from "@/mock";
import { consoleNavItems } from "@/lib/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SideRail() {
  const pathname = usePathname();

  return (
    <Card className="h-full overflow-hidden border-white/10 bg-slate-950/70">
      <CardContent className="flex h-full flex-col p-5">
        <div className="rounded-[24px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(34,211,238,0.1),rgba(15,23,42,0.2))] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Astrological Decision Simulator</div>
              <div className="text-xs uppercase tracking-[0.26em] text-slate-500">Symbolic Console</div>
            </div>
          </div>
          <div className="mt-5 rounded-[20px] border border-white/10 bg-slate-950/60 p-4">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Active Project</div>
            <div className="mt-2 text-lg font-medium text-white">{currentProject.name}</div>
            <div className="mt-1 text-sm text-slate-400">{currentProject.mode}</div>
          </div>
        </div>

        <div className="mt-6 space-y-2 overflow-auto pr-1">
          {consoleNavItems.map((item) => {
            const active = item.isActive(pathname);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-[22px] border px-4 py-4 transition-all duration-300",
                  active
                    ? "border-cyan-300/20 bg-cyan-300/10 shadow-[0_0_0_1px_rgba(103,232,249,0.08)]"
                    : "border-transparent bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.05]",
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-2xl border transition-colors",
                    active
                      ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
                      : "border-white/10 bg-slate-900/80 text-slate-400 group-hover:text-white",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className={cn("text-sm font-medium", active ? "text-white" : "text-slate-200")}>{item.label}</div>
                  <div className="truncate text-xs text-slate-500">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto space-y-4 pt-6">
          <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
              <Binary className="h-3.5 w-3.5 text-cyan-200" />
              System State
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Decision engine</span>
                <span className="text-cyan-100">online</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Simulation mode</span>
                <span className="text-cyan-100">symbolic</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Audit log</span>
                <span className="text-cyan-100">recording</span>
              </div>
            </div>
          </div>
          <Link href="/" className={cn(buttonVariants({ variant: "secondary" }), "w-full justify-between")}>
            Back to Landing
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
