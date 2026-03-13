import type { ReactNode } from "react";

import { RouteTransition } from "@/components/shared/route-transition";
import { SideRail } from "@/components/shell/side-rail";
import { TopCommandBar } from "@/components/shell/top-command-bar";

type ConsoleShellProps = {
  children: ReactNode;
};

export function ConsoleShell({ children }: ConsoleShellProps) {
  return (
    <div className="mx-auto max-w-[1600px] px-3 py-3 sm:px-4 md:px-6 lg:py-6">
      <div className="grid gap-4 lg:grid-cols-[280px,minmax(0,1fr)] xl:grid-cols-[300px,minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-6 h-[calc(100vh-3rem)]">
            <SideRail />
          </div>
        </aside>
        <div className="min-w-0 space-y-4">
          <TopCommandBar />
          <RouteTransition>
            <div className="space-y-4">{children}</div>
          </RouteTransition>
        </div>
      </div>
    </div>
  );
}
