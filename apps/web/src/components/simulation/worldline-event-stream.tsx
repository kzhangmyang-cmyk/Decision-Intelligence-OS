import { Activity } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { StatusPill } from "@/components/shared/status-pill";
import type { MonthlyKeyEvent } from "@/types/simulation";

type WorldlineEventStreamProps = {
  events: MonthlyKeyEvent[];
};

export function WorldlineEventStream({ events }: WorldlineEventStreamProps) {
  if (events.length === 0) {
    return (
      <EmptyState
        title="No key events available"
        description="This replay branch has not been annotated with major inflection points yet."
      />
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={`${event.label}-${event.title}`} className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
              <Activity className="h-4 w-4 text-cyan-200" />
              {event.label}
            </div>
            <StatusPill tone={event.tone}>{event.category}</StatusPill>
          </div>
          <div className="mt-4 text-base font-medium leading-7 text-white">{event.title}</div>
          <div className="mt-3 text-sm leading-6 text-slate-400">{event.summary}</div>
        </div>
      ))}
    </div>
  );
}
