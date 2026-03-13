import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
};

export function SectionCard({
  eyebrow,
  title,
  description,
  className,
  contentClassName,
  children,
}: SectionCardProps) {
  return (
    <Card className={cn("border-white/10 bg-slate-950/65", className)}>
      <CardHeader className="border-b border-white/8 pb-5">
        {eyebrow ? (
          <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">{eyebrow}</div>
        ) : null}
        <CardTitle className="text-2xl tracking-[-0.05em]">{title}</CardTitle>
        {description ? <p className="text-sm leading-6 text-slate-400">{description}</p> : null}
      </CardHeader>
      <CardContent className={cn("pt-6", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
