import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { SectionCard } from "@/components/shared/section-card";
import { StatusPill } from "@/components/shared/status-pill";

type IntakeSectionProps = {
  index: string;
  title: string;
  description: string;
  completionLabel: string;
  children: ReactNode;
};

export function IntakeSection({
  index,
  title,
  description,
  completionLabel,
  children,
}: IntakeSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <SectionCard
        eyebrow={`Section ${index}`}
        title={title}
        description={description}
        className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.72),rgba(2,6,23,0.88))]"
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">structured input layer</div>
          <StatusPill tone="cyan">{completionLabel}</StatusPill>
        </div>
        <div className="space-y-6">{children}</div>
      </SectionCard>
    </motion.div>
  );
}
