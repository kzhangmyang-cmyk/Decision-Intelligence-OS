import { cn } from "@/lib/utils";
import type { WorldlineCompany } from "@/types/simulation";

const toneClasses = {
  cyan: "bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.42)]",
  emerald: "bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.35)]",
  amber: "bg-amber-300 shadow-[0_0_16px_rgba(252,211,77,0.28)]",
  rose: "bg-rose-400 shadow-[0_0_16px_rgba(251,113,133,0.28)]",
  default: "bg-slate-500",
};

type WorldlineMatrixProps = {
  companies: WorldlineCompany[];
};

export function WorldlineMatrix({ companies }: WorldlineMatrixProps) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
      {companies.map((company) => (
        <div
          key={company.id}
          title={`${company.name} · ${company.founderType} · ${company.strategyType} · ${company.status}`}
          className="rounded-xl border border-white/10 bg-white/[0.03] p-1.5"
        >
          <div className={cn("h-6 rounded-lg", toneClasses[company.tone] ?? toneClasses.default)} />
        </div>
      ))}
    </div>
  );
}
