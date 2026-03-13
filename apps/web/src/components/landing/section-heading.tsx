import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl space-y-4", className)}>
      <div className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.32em] text-cyan-200">
        {eyebrow}
      </div>
      <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">{description}</p>
    </div>
  );
}
