import type { LucideIcon } from "lucide-react";
import { BrainCircuit, Compass, FileText, Orbit, Radar } from "lucide-react";

export type ConsoleNavItem = {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
};

export const consoleNavItems: ConsoleNavItem[] = [
  {
    label: "Intake",
    href: "/intake",
    description: "Structure the thesis",
    icon: FileText,
    isActive: (pathname) => pathname === "/intake",
  },
  {
    label: "Report",
    href: "/report",
    description: "Read the score",
    icon: BrainCircuit,
    isActive: (pathname) => pathname === "/report",
  },
  {
    label: "Simulation",
    href: "/simulation",
    description: "Watch 100 worldlines",
    icon: Orbit,
    isActive: (pathname) => pathname === "/simulation",
  },
  {
    label: "Replay",
    href: "/simulation/company-alpha",
    description: "Trace one company",
    icon: Radar,
    isActive: (pathname) => pathname.startsWith("/simulation/") && pathname !== "/simulation",
  },
  {
    label: "Planner",
    href: "/planner",
    description: "Turn signal into action",
    icon: Compass,
    isActive: (pathname) => pathname === "/planner",
  },
];

export function getConsolePageLabel(pathname: string) {
  const item = consoleNavItems.find((navItem) => navItem.isActive(pathname));
  return item?.label ?? "Console";
}
